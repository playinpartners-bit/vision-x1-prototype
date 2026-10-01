import { Icon } from '../ui/Icon';

/** Stylised phone showing the Telegram companion experience (no real integration). */
export function TelegramMock() {
  return (
    <div className="phone" aria-label="Illustration of Vision X1 messages in Telegram">
      <div className="phone__notch" />
      <div className="phone__header">
        <span className="phone__avatar">X1</span>
        <div>
          <div className="phone__title">Vision X1</div>
          <div className="phone__sub">bot · companion</div>
        </div>
      </div>
      <div className="phone__body">
        <div className="tg-msg">
          <div className="tg-msg__label">☀️ Morning briefing</div>
          6 match pages today · 3 Vision X1 Views locked.
          <br />
          Featured: <strong>PSG vs Marseille</strong>, 21:00
          <div className="tg-msg__btn">Open match page</div>
        </div>
        <div className="tg-msg">
          <div className="tg-msg__label">🔒 New Vision X1 View</div>
          Camille Rousseau published on PSG vs Marseille — locked 12 h 45 min before kickoff.
        </div>
        <div className="tg-msg">
          <div className="tg-msg__label">📋 Line-ups confirmed</div>
          Inter vs Atalanta XIs are in. The data layer has been updated.
        </div>
        <div className="tg-msg tg-msg--community">
          <div className="tg-msg__label">💬 Community · 1,240 members</div>
          <em>Hugo:</em> That PSG right-back vs OM's left winger duel is the whole game.
        </div>
        <div className="tg-msg tg-msg--me">Remind me at line-ups 👍</div>
      </div>
      <div className="phone__input">
        <span>Message</span>
        <Icon name="send" size={16} />
      </div>
    </div>
  );
}
