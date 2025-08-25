const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdf = require('pdf-parse');
const tesseract = require('tesseract.js');
const xlsx = require('xlsx');

const fs = require('fs').promises;
const path = require('path');
const pdfPoppler = require('pdf-poppler');

const app = express();
const port = 5001; // Using a different port than the default React port

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to parse transaction text. This is a simple example.
// A real-world application would need much more sophisticated parsing.
const parseTransactions = (text) => {
    const lines = text.split('\n');
    const transactions = [];
    // More flexible regex for dates: MM/DD, MM/DD/YY, MM/DD/YYYY, or MMDD
    const dateRegex = /\b(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|\d{4})\b/;
    // Regex for amounts: allows for s/£ prefix, commas/periods, optional negative sign, and varying decimal places
    const amountRegex = /[s£]?\s*-?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?/;

    lines.forEach(line => {
        const dateMatch = line.match(dateRegex);
        const amountMatch = line.match(amountRegex);

        if (dateMatch && amountMatch) {
            const date = dateMatch[0];
            const amount = amountMatch[0];

            // Attempt to extract description: everything between date and amount
            let description = line.substring(dateMatch.index + date.length, amountMatch.index).trim();

            // Remove any extra spaces
            description = description.replace(/\s+/g, ' ');

            // Basic Debit/Credit detection (very naive)
            let debit = '';
            let credit = '';
            // Clean amount for numerical comparison
            const cleanAmount = parseFloat(amount.replace(/[s£,]/g, ''));

            if (cleanAmount < 0) {
                debit = Math.abs(cleanAmount).toFixed(2); // Ensure two decimal places
            } else {
                credit = cleanAmount.toFixed(2); // Ensure two decimal places
            }

            transactions.push({
                Date: date,
                Description: description,
                Debit: debit,
                Credit: credit,
                Amount: cleanAmount.toFixed(2) // Store cleaned amount
            });
        }
    });
    return transactions;
};


// API Endpoint for file upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  let tempDir; // Declare tempDir here so it's accessible in finally block

  try {
    console.log('File received:', req.file.originalname);
    console.log('Attempting to process PDF with pdf-parse...');

    let extractedText = '';
    const data = await pdf(req.file.buffer);
    extractedText = data.text;

    // If pdf-parse returns little or no text, try OCR
    if (extractedText.trim().length < 50) {
        console.log('pdf-parse extracted minimal text. Attempting OCR with Tesseract via pdf-poppler...');

        tempDir = path.join(__dirname, 'temp', Date.now().toString());
        await fs.mkdir(tempDir, { recursive: true });

        const pdfFilePath = path.join(tempDir, req.file.originalname);
        await fs.writeFile(pdfFilePath, req.file.buffer);

        const imagePaths = [];
        const options = {
            format: 'png',
            out_dir: tempDir,
            out_prefix: path.basename(pdfFilePath, path.extname(pdfFilePath)),
            page: null
        };

        await pdfPoppler.convert(pdfFilePath, options)
            .then(async res => {
                // pdf-poppler returns an array of paths to the generated images
                // We need to find them based on the prefix and format
                const files = await fs.readdir(tempDir);
                files.forEach(file => {
                    if (file.startsWith(options.out_prefix) && file.endsWith('.png')) {
                        imagePaths.push(path.join(tempDir, file));
                    }
                });
            })
            .catch(error => {
                console.error('Error converting PDF to image:', error);
                throw new Error('Failed to convert PDF to image for OCR.');
            });

        if (imagePaths.length === 0) {
            throw new Error('No images generated from PDF for OCR.');
        }

        const worker = await tesseract.createWorker('eng');
        for (const imagePath of imagePaths) {
            const imageBuffer = await fs.readFile(imagePath);
            const { data: { text } } = await worker.recognize(imageBuffer);
            extractedText += text + '\n'; // Concatenate text from all pages
        }
        await worker.terminate();
        console.log('OCR processing complete.');
    } else {
        console.log('pdf-parse processing complete.');
    }

    if (!extractedText) {
        return res.status(500).json({ error: 'Failed to extract text from the PDF.' });
    }

    console.log('Extracted Text:', extractedText); // Added this line

    // Parse the extracted text to find transactions
    const structuredData = parseTransactions(extractedText);

    if (structuredData.length === 0) {
        return res.status(400).json({
            error: 'No transactions found. The document format might not be supported yet.',
            extractedText: extractedText // for debugging
        });
    }

    console.log(`Successfully extracted ${structuredData.length} transactions.`);

    res.status(200).json({
      message: 'File processed successfully.',
      filename: req.file.originalname,
      data: structuredData
    });

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Failed to process the file.' });
  } finally {
    // Clean up temporary files and directory
    if (tempDir) {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
        console.log(`Cleaned up temporary directory: ${tempDir}`);
      } catch (cleanupError) {
        console.error('Error cleaning up temporary directory:', cleanupError);
      } 
    }
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});