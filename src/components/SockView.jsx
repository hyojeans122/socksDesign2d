import SockCanvas from './SockCanvas';

function SockView({ ref, onSectionChange, onStatus, onSaveStatus }) {
  return (
    <section className="workspace" aria-label="양말 디자인 미리보기">
      <div className="canvas-stage">
        <SockCanvas ref={ref} zoom={1} onStatus={onStatus} onSaveStatus={onSaveStatus} onSectionChange={onSectionChange} />
      </div>
    </section>
  );
}

export default SockView;
