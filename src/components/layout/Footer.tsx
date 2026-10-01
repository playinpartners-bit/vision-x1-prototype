import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function ResponsibleNote({ compact }: { compact?: boolean }) {
  return (
    <div className="responsible">
      <span className="responsible__badge">18+</span>
      <p>
        {compact
          ? 'Vision X1 provides football analysis, not betting advice. No outcome is guaranteed.'
          : 'Vision X1 is a football intelligence and research product for adults (18+). We provide analysis and context, never guaranteed outcomes or betting advice. If you choose to bet, set limits and only stake what you can afford to lose.'}{' '}
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
            <p>Football intelligence, powered by data. Built in Europe for fans who want to understand the game more deeply.</p>
          </div>
          <div>
            <h4>Product</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/match/psg-marseille">Match Centre</Link>
            <Link to="/assistant">AI Assistant</Link>
          </div>
          <div>
            <h4>Company</h4>
            <span>Methodology</span>
            <span>Analyst team</span>
            <span>Contact</span>
          </div>
          <div>
            <h4>Trust</h4>
            <span>Responsible use</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
        <ResponsibleNote />
        <p className="footer__legal">
          © {new Date().getFullYear()} Vision X1 · Prototype build. All fixtures, statistics, analysts and outputs shown are DEMO DATA for
          illustration only. Club names are used for identification; crests are generated placeholders.
        </p>
      </div>
    </footer>
  );
}
