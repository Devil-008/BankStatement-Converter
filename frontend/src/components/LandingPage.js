import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button, Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import { FaRocket, FaCloudUploadAlt, FaShieldAlt, FaChartLine, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import './LandingPage.css';

const sectionVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } }
};

const featureVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const AnimatedSection = ({ children }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      variants={sectionVariant}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="landing-page">
      <Navbar bg="light" expand="lg" fixed="top">
        <Container fluid>
          <Navbar.Brand href="#home">Statement Converter</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <header className="hero-section text-center">
        <Container>
          <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hero-title">Convert Your Bank Statements Effortlessly</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }} className="hero-subtitle">Upload your PDF bank statements and get clean, organized CSV files in seconds.</motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
            <Button variant="primary" size="lg" onClick={onGetStarted}>
              <FaRocket className="me-2" /> Get Started
            </Button>
          </motion.div>
        </Container>
      </header>

      <main>
        <section id="features" className="features-section text-center">
          <Container>
            <AnimatedSection>
              <h2 className="section-title">Features</h2>
              <Row>
                <Col md={4}>
                  <motion.div variants={featureVariant} initial="hidden" whileInView={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }} viewport={{ once: true }}>
                    <div className="feature-card">
                      <FaCloudUploadAlt className="feature-icon" />
                      <h3 className="feature-title">Easy Uploads</h3>
                      <p>Drag and drop your PDF statements or upload them from your computer.</p>
                    </div>
                  </motion.div>
                </Col>
                <Col md={4}>
                  <motion.div variants={featureVariant} initial="hidden" whileInView={{ opacity: 1, scale: 1, transition: { delay: 0.4 } }} viewport={{ once: true }}>
                    <div className="feature-card">
                      <FaChartLine className="feature-icon" />
                      <h3 className="feature-title">Data Ready</h3>
                      <p>Download clean CSV/XLSX files compatible with your favorite accounting software.</p>
                    </div>
                  </motion.div>
                </Col>
                <Col md={4}>
                  <motion.div variants={featureVariant} initial="hidden" whileInView={{ opacity: 1, scale: 1, transition: { delay: 0.6 } }} viewport={{ once: true }}>
                    <div className="feature-card">
                      <FaShieldAlt className="feature-icon" />
                      <h3 className="feature-title">Secure & Private</h3>
                      <p>Your data is processed securely and is never stored on our servers.</p>
                    </div>
                  </motion.div>
                </Col>
              </Row>
            </AnimatedSection>
          </Container>
        </section>

        <section id="about" className="about-section bg-light">
          <Container>
            <AnimatedSection>
              <Row className="justify-content-center">
                <Col md={8} className="text-center">
                  <h2 className="section-title">About Us</h2>
                  <p>We are a team of developers and accountants passionate about simplifying financial workflows. Our mission is to provide you with the best tools to manage your financial data efficiently and securely.</p>
                </Col>
              </Row>
            </AnimatedSection>
          </Container>
        </section>
      </main>

      <footer id="contact" className="footer text-center">
        <Container fluid>
          <Row>
            <Col>
              <p>&copy; {new Date().getFullYear()} Statement Converter. All Rights Reserved.</p>
              <div className="social-icons">
                <motion.a href="https://twitter.com" aria-label="Twitter" whileHover={{ y: -5 }}><FaTwitter /></motion.a>
                <motion.a href="https://linkedin.com" aria-label="LinkedIn" whileHover={{ y: -5 }}><FaLinkedin /></motion.a>
                <motion.a href="https://github.com" aria-label="GitHub" whileHover={{ y: -5 }}><FaGithub /></motion.a>
              </div>
              <p className="heart-text">Developed with <span className="heart-icon">❤️</span></p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}