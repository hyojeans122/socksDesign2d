import { useRef, useState } from 'react';
import './App.css';
import SideBar from './components/SideBar';
import SockView from './components/SockView';
import Icon from './components/Icon';

function App() {
  // 편집 도구와 다운로드 버튼이 하나의 캔버스를 공유한다.
  const sockCanvasRef = useRef(null);
  const [section, setSection] = useState('body');
  const [canvasStatus, setCanvasStatus] = useState('loading');
  const [saveStatus, setSaveStatus] = useState('');

  return (
    <div className="studio">
      <header className="app-header">
        <div className="header-identity">
          <a className="brand" href="./" aria-label="Sock Studio 홈">
            <span>sock<span className="brand-light">studio</span><span className="brand-dot">.</span></span>
          </a>
          <h1 className="header-description">나만의 양말 만들기</h1>
        </div>
        <div className="header-actions">
          <span className="save-status" role="status"><span className={`status-dot ${saveStatus === '저장하지 못했어요' ? 'is-error' : ''}`} />{saveStatus || '디자인 준비 중'}</span>
          <button className="button button-primary" disabled={canvasStatus !== 'ready'} onClick={() => sockCanvasRef.current?.exportPNG()}>
            <Icon name="download" size={17} /><span>PNG 다운로드</span>
          </button>
        </div>
      </header>
      <main className="editor-layout">
        <SideBar section={section} onSectionChange={setSection} />
        <SockView ref={sockCanvasRef} onSectionChange={setSection} onStatus={setCanvasStatus} onSaveStatus={setSaveStatus} />
      </main>
    </div>
  );
}

export default App;
