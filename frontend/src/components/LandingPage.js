import React from 'react';
import { motion } from 'framer-motion';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaRocket, FaCloudUploadAlt, FaShieldAlt, FaChartLine, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import './LandingPage.css';

const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="landing-root">
      <header className="site-header" role="banner">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="logo" aria-label="BankStatement Converter">BankStatement<span className="accent">.</span></div>
          <nav className="nav-actions d-flex align-items-center" role="navigation" aria-label="primary">
            <a href="#pricing" className="nav-link me-3">Pricing</a>
            <a href="#features" className="nav-link me-3">Features</a>
            <Button variant="outline-primary" size="sm" className="me-2 btn-signin">Sign in</Button>
            <Button variant="light" size="sm" onClick={onGetStarted}>Try for free</Button>
          </nav>
        </Container>
      </header>

      <section className="hero">
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="hero-content">
                <div className="eyebrow">Automate your bookkeeping</div>
                <h1 className="hero-title">Convert bank PDFs to clean spreadsheets in seconds</h1>
                <p className="hero-sub">Upload any bank statement PDF and receive fully parsed transactions ready for accounting, analysis, or tax work.</p>
                <div className="hero-ctas d-flex align-items-center">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button className="btn-gradient" size="lg" onClick={onGetStarted}><FaRocket className="me-2"/> Get Started</Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="ms-3">
                    <Button variant="outline-light" size="lg">Request a Demo</Button>
                  </motion.div>
                </div>
                <div className="trust-row mt-4">
                  <div>Trusted by accountants & finance teams</div>
                </div>
              </motion.div>
            </Col>
            <Col md={5}>
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="hero-panel">
                <div className="panel-header">Sample output</div>
                <div className="panel-body">
                  <pre className="mock-csv">Date,Description,Amount
2025-06-01,ACME Store,-45.20
2025-06-03,Salary,2500.00
2025-06-05,Transfer to savings,-300.00</pre>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="features" className="features">
        <Container>
          <motion.div className="features-grid" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
            <motion.div className="feature" variants={fadeUp}><FaCloudUploadAlt className="feature-icon"/><h5>Easy Uploads</h5><p>Drag & drop PDF statements or upload from your computer.</p></motion.div>
            <motion.div className="feature" variants={fadeUp}><FaChartLine className="feature-icon"/><h5>Data Ready</h5><p>Download clean CSV/XLSX for bookkeeping and BI tools.</p></motion.div>
            <motion.div className="feature" variants={fadeUp}><FaShieldAlt className="feature-icon"/><h5>Secure</h5><p>We respect privacy — processing is safe and transient.</p></motion.div>
          </motion.div>
        </Container>
      </section>

      <section className="how-it-works">
        <Container>
          <h3 className="section-title">How it works</h3>
          <Row>
            <Col md={4}>
              <div className="step"><div className="step-badge">1</div><h6>Upload your PDF</h6><p>Choose a PDF from your device.</p></div>
            </Col>
            <Col md={4}>
              <div className="step"><div className="step-badge">2</div><h6>Automatic parsing</h6><p>Our engine extracts dates, descriptions and amounts.</p></div>
            </Col>
            <Col md={4}>
              <div className="step"><div className="step-badge">3</div><h6>Download</h6><p>Export to CSV or Excel and continue your workflow.</p></div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="pricing">
        <Container>
          <h3 className="section-title text-center">Pricing</h3>
          <Row className="g-4 justify-content-center">
            <Col md={3}>
              <div className="price-card">
                <div className="price">Free</div>
                <div className="price-sub">Up to 5 conversions / month</div>
                <ul>
                  <li>Basic parsing</li>
                  <li>Email support</li>
                </ul>
                <Button variant="outline-primary" onClick={onGetStarted}>Get started</Button>
              </div>
            </Col>
            <Col md={3}>
              <div className="price-card recommended">
                <div className="price">Pro</div>
                <div className="price-sub">$29 / month</div>
                <ul>
                  <li>Unlimited conversions</li>
                  <li>Priority support</li>
                </ul>
                <Button variant="primary" onClick={onGetStarted}>Start free trial</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="cta-footer">
        <Container className="text-center">
          <h4>Ready to simplify statement processing?</h4>
          <Button variant="primary" size="lg" onClick={onGetStarted}><FaRocket className="me-2"/>Start converting now</Button>
        </Container>
      </section>

      <footer className="site-footer">
        <Container fluid>
          <Row className="align-items-center justify-content-between">
            <Col md={6} className="brand">© {new Date().getFullYear()} BankStatement Converter</Col>
            <Col md={6} className="d-flex justify-content-end align-items-center">
              <div className="footer-links me-4">
                <a href="/privacy">Privacy</a>
                <a href="/terms" className="ms-3">Terms</a>
              </div>
              <div className="socials me-4">
                <a href="https://twitter.com" aria-label="twitter"><FaTwitter/></a>
                <a href="https://linkedin.com" aria-label="linkedin" className="ms-3"><FaLinkedin/></a>
                <a href="https://github.com" aria-label="github" className="ms-3"><FaGithub/></a>
              </div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="footer-heart ms-3">
                <span>Developed with</span>
                <motion.span className="heart pulse ms-2" whileHover={{ scale: 1.25 }}>&#10084;</motion.span>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}
