import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeSockType, changeSockColor, addImg } from '../store/store';
import { saveImage } from '../imageDB';
import { palette, sections, sockTypes } from '../sockDesign';
import Icon from './Icon';

function SideBar({ section, onSectionChange }) {
  const dispatch = useDispatch();
  const { sockType, sockColor } = useSelector((state) => state.sock);
  const imgUrl = useSelector((state) => state.customSock.img);
  const inputRef = useRef(null);
  const [uploadName, setUploadName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const selectedSection = sections.find((item) => item.id === section);
  const selectedColor = sockColor[section];
  const colorName = palette.find(([, hex]) => hex.toLowerCase() === selectedColor.toLowerCase())?.[0] || '사용자 지정';

  function changeColor(color) {
    dispatch(changeSockColor({ section, color }));
  }

  // 원본 파일을 저장한 뒤 미리보기와 캔버스에서 사용할 URL을 공유한다.
  async function uploadFile(file) {
    if (!file || uploading) return;
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      setError('PNG, JPG, WEBP 또는 SVG 이미지를 선택해 주세요.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('10MB 이하의 이미지를 선택해 주세요.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      await saveImage(file);
      dispatch(addImg(URL.createObjectURL(file)));
      setUploadName(file.name);
    } catch {
      setError('이미지를 저장하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setUploading(false);
    }
  }

  async function removeImage() {
    try {
      await saveImage(null);
      dispatch(addImg(''));
      setUploadName('');
      setError('');
    } catch {
      setError('이미지를 삭제하지 못했어요. 다시 시도해 주세요.');
    }
  }

  return (
    <aside className="sidebar" aria-label="디자인 편집 도구">
      <section className="tool-section">
        <div className="section-heading"><h2>양말 종류</h2><span className="selection-label">{sockType}</span></div>
        <div className="type-options" aria-label="양말 종류">
          {sockTypes.map((type, index) => (
            <button key={type} className={`type-option ${sockType === type ? 'is-selected' : ''}`} aria-pressed={sockType === type} onClick={() => dispatch(changeSockType(type))}>
              <svg width="28" height="36" viewBox="0 0 32 40" aria-hidden="true"><path d={`M12 ${[16, 10, 5, 2, 22][index]} H24 V27 L28 30 Q31 34 27 36 L22 38 Q19 39 16 36 L5 28 Q2 25 5 22 L12 17 Z`} fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d={`M12 ${[20, 14, 9, 6, 25][index]} H24`} fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
              <span>{type}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="tool-section">
        <div className="section-heading"><h2>부위별 색상</h2></div>
        <div className="part-options" aria-label="편집할 부위">
          {sections.map((item) => <button key={item.id} aria-pressed={section === item.id} className={section === item.id ? 'is-selected' : ''} onClick={() => onSectionChange(item.id)}>{item.name}</button>)}
        </div>
        <div className="color-caption"><span>{selectedSection.name} 컬러</span><span>{colorName}</span></div>
        <div className="color-palette" aria-label={`${selectedSection.name} 색상`}>
          {palette.map(([name, hex]) => <button key={hex} className={`color-swatch ${selectedColor.toLowerCase() === hex.toLowerCase() ? 'is-selected' : ''}`} style={{ '--swatch': hex }} aria-label={name} title={name} aria-pressed={selectedColor.toLowerCase() === hex.toLowerCase()} onClick={() => changeColor(hex)}>{selectedColor.toLowerCase() === hex.toLowerCase() && <Icon name="check" size={17} />}</button>)}
        </div>
        <label className="custom-color"><span className="color-input-wrap"><input type="color" value={/^#[0-9a-f]{6}$/i.test(selectedColor) ? selectedColor : '#ffffff'} onChange={(event) => changeColor(event.target.value)} aria-label="사용자 지정 색상" /><Icon name="plus" size={15} /></span><span>직접 색상 선택</span><code>{selectedColor.toUpperCase()}</code></label>
      </section>
      <section className="tool-section upload-section">
        <div className="section-heading"><h2>로고 · 이미지</h2><span className="optional-label">선택사항</span></div>
        <input ref={inputRef} className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" disabled={uploading} onChange={(event) => { uploadFile(event.target.files[0]); event.target.value = ''; }} />
        <button className={`upload-zone ${dragging ? 'is-dragging' : ''}`} disabled={uploading} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); uploadFile(event.dataTransfer.files[0]); }}>
          <span className="upload-icon"><Icon name="upload" size={21} /></span>
          <strong>{uploading ? '이미지 저장 중…' : '클릭하거나 이미지를 놓아주세요'}</strong>
          <span>PNG, JPG, WEBP, SVG · 최대 10MB</span>
        </button>
        {imgUrl && <div className="uploaded-file"><img src={imgUrl} alt="업로드한 로고" /><span>{uploadName || '저장된 이미지'}<small>캔버스에서 드래그해 위치를 조절하세요</small></span><button className="icon-button" onClick={removeImage} aria-label="이미지 삭제"><Icon name="close" size={16} /></button></div>}
        {error && <p className="error-message" role="alert">{error}</p>}
      </section>
      <div className="sidebar-note"><Icon name="check" size={16} /><span>디자인은 이 브라우저에 자동 저장돼요.</span></div>
    </aside>
  );
}

export default SideBar;
