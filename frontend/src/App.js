import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Container, Row, Col, Card, Button, ProgressBar, Alert, Table, Modal } from 'react-bootstrap';
import './App.css';
import { utils, writeFile } from 'xlsx';
import LandingPage from './components/LandingPage';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [file, setFile] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0]);
    setError('');
    setProcessedData(null);
    setUploadProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      setProcessedData(response.data.data);
      setError('');
      setShowDownloadModal(true); // Show modal when data is processed
    } catch (err) {
      setError('File upload failed. Please try again.');
      console.error(err);
    }
  };

  const handleDownload = (format) => {
    if (!processedData) return;

    const worksheet = utils.json_to_sheet(processedData);
    if (format === 'csv') {
      const csvOutput = utils.sheet_to_csv(worksheet);
      const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Transactions');
      writeFile(workbook, 'transactions.xlsx');
    }
    setShowDownloadModal(false); // Close modal after download
  };


  return (
    <div>
      {showLanding ? (
        <LandingPage onGetStarted={() => setShowLanding(false)} />
      ) : (
        <Container className="mt-5">
          <Row className="justify-content-md-center">
            <Col xs={12} md={8}>
              <Card className="text-center">
                <Card.Header as="h4">Statement Converter</Card.Header>
                <Card.Body>
                  <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop a PDF file here, or click to select a file</p>
                    <em>(Only *.pdf files will be accepted)</em>
                  </div>
                  {file && <p className="mt-3">Selected file: {file.name}</p>}
                  <Button variant="primary" onClick={handleUpload} disabled={!file || uploadProgress > 0} className="mt-3">
                    {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Convert File'}
                  </Button>
                  {uploadProgress > 0 && <ProgressBar animated now={uploadProgress} className="mt-3" />}
                  {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {processedData && (
            <Row className="justify-content-md-center mt-4">
              <Col xs={12} md={10}>
                <Card>
                  <Card.Header as="h5">Extracted Transactions</Card.Header>
                  <Card.Body>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          {Object.keys(processedData[0]).map(key => <th key={key}>{key}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {processedData.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, i) => <td key={i}>{value}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="text-center mt-3">
                        <Button variant="success" onClick={() => handleDownload('xlsx')} className="me-2">
                            Download Excel (XLSX)
                        </Button>
                        <Button variant="info" onClick={() => handleDownload('csv')}>
                            Download CSV
                        </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Download Ready!</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <p>Your file has been successfully processed and is ready for download.</p>
              <Button variant="success" onClick={() => handleDownload('xlsx')} className="me-2">
                Download Excel (XLSX)
              </Button>
              <Button variant="info" onClick={() => handleDownload('csv')}>
                Download CSV
              </Button>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDownloadModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      )}
    </div>
  );
}

export default App;