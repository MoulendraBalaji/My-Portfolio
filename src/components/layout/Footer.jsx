import { navLinks } from '../../data/portfolio';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <p className="footer__copy">&copy; 2026 Moulendra Balaji. All rights reserved.</p>
        <nav className="footer__links" aria-label="Footer">
          {navLinks.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="footer__link">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}