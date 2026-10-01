import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function ResponsibleNote({ compact }: { compact?: boolean }) {
  return (
    <div className="responsible">
      <span className="responsible__badge">18+</span>
      <p>
        {compact
          ? 'Vision X1 provides football analysis, not betting advice. No outcome is guaranteed.'
          : 'Vision X1 is a football intelligence product for adults (18+). We publish analysis and context — never guaranteed outcomes, odds or betting advice. Past accuracy does not guarantee future results.'}{' '}
        Support: <a href="https://www.begambleaware.org" target="_blank" rel="noreferrer">BeGambleAware</a> ·{' '}
        <a href="https://www.joueurs-info-service.fr" target="_blank" rel="noreferrer">Joueurs Info Service</a>
      </p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo />
            <p>Football Intelligence. Read the match before kickoff — data, AI summary and expert opinion, timestamped and accountable.</p>
          </div>
          <div>
            <h4>Product</h4>
            <Link to="/matches">Match Center</Link>
            <Link to="/track-record">Track Record</Link>
            <Link to="/me">My Vision X1</Link>
            <Link to="/assistant">Ask Vision X1 (preview)</Link>
          </div>
          <div>
            <h4>Company</h4>
            <span>Methodology</span>
            <span>Our analysts</span>
            <span>Telegram community</span>
            <span>Contact</span>
          </div>
          <div>
            <h4>Trust</h4>
            <Link to="/track-record">How Views are recorded</Link>
            <span>Responsible use</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
        <ResponsibleNote />
        <p className="footer__legal">
          © {new Date().getFullYear()} Vision X1 · Prototype build. All fixtures, statistics, analysts, Vision X1 Views, timestamps and track-record entries
          shown are DEMO DATA for illustration only. Club names are used for identification; crests are generated placeholders.
        </p>
      </div>
    </footer>
  );
}
