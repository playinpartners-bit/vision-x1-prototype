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
          6 fixtures today · 4 AI analyses · 3 expert insights.
          <br />
          Featured: <strong>PSG vs Marseille</strong>, 21:00
        </div>
        <div className="tg-msg">
          <div className="tg-msg__label">⚠️ Fitness update</div>
          PSG centre-back is a late fitness test. Our analysts will update the read once XIs are confirmed.
        </div>
        <div className="tg-msg">
          <div className="tg-msg__label">📋 Line-ups confirmed</div>
          Inter vs Atalanta — both XIs are in. Tap to see what changed vs. our preview.
          <div className="tg-msg__btn">Open in Vision X1</div>
        </div>
        <div className="tg-msg tg-msg--me">Key risks for PSG–OM?</div>
        <div className="tg-msg">
          Top 3: line-up uncertainty, rotation after Europe, rivalry discipline. Full breakdown in the app →
        </div>
      </div>
      <div className="phone__input">
        <span>Message</span>
        <Icon name="send" size={16} />
      </div>
    </div>
  );
}
