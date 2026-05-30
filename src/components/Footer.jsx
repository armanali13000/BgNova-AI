import { Link } from 'react-router-dom';
import { FiGithub, FiInstagram, FiLinkedin, FiMail } from 'react-icons/fi';
import footerLogo from '../assets/bgnova-ai-footer-logo.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img className="footer-logo" src={footerLogo} alt="BgNova AI logo" />
        </div>
        <p className="footer-copy">
          Premium browser-based background removal, cleanup, repair, preview, and export tools for creators.
        </p>
      </div>
      <div className="footer-columns">
        <div>
          <h3>Product</h3>
          <Link to="/">Home</Link>
          <Link to="/editor">Editor</Link>
          <Link to="/about">About</Link>
        </div>
        <div>
          <h3>Legal</h3>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h3>Connect</h3>
          <a href="mailto:hello@bgnova.ai">
            <FiMail /> hello@bgnova.ai
          </a>
          <div className="footer-socials">
            <a href="https://github.com" aria-label="GitHub"><FiGithub /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn"><FiLinkedin /></a>
            <a href="https://instagram.com" aria-label="Instagram"><FiInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 BgNova AI. All rights reserved.</span>
        <span>Developed by <strong>Arman</strong></span>
      </div>
    </footer>
  );
}

export default Footer;
