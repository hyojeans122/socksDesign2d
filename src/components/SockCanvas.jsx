import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Canvas, FabricImage, Path } from 'fabric';
import { useSelector, useDispatch } from 'react-redux';
import { addImg } from '../store/store';
import { getImage } from '../imageDB';
import { getSockGeometry, sections } from '../sockDesign';

function fitCanvas(canvas, type, zoom) {
  const top = getSockGeometry(type).top;
  const height = 690 - top;
  const scale = Math.min((canvas.width - 90) / 360, (canvas.height - 130) / height, 0.9) * zoom;
  canvas.setViewportTransform([scale, 0, 0, scale, (canvas.width - 350 * scale) / 2, (canvas.height - height * scale) / 2 - top * scale]);
  canvas.requestRenderAll();
}

function SockCanvas({ ref, zoom, onStatus, onSaveStatus, onSectionChange }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const partsRef = useRef({});
  const imageRef = useRef(null);
  const sceneRef = useRef({ type: '축구', zoom: 1 });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const { sockType, sockColor } = useSelector((state) => state.sock);
  const imgUrl = useSelector((state) => state.customSock.img);
  const dispatch = useDispatch();

  // 캔버스를 한 번 생성하고 컨테이너 크기에 맞춰 편집 영역을 조절한다.
  useEffect(() => {
    const canvas = new Canvas(canvasRef.current, { selection: false, preserveObjectStacking: true });
    fabricRef.current = canvas;
    const observer = new ResizeObserver(([entry]) => {
      canvas.setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
      fitCanvas(canvas, sceneRef.current.type, sceneRef.current.zoom);
    });
    observer.observe(hostRef.current);
    setReady(true);
    return () => {
      observer.disconnect();
      fabricRef.current = null;
      canvas.dispose();
    };
  }, []);

  // 양말 종류가 바뀌면 부위별 경로를 다시 만들고 직접 클릭할 수 있게 한다.
  useEffect(() => {
    if (!ready || !fabricRef.current) return;
    const canvas = fabricRef.current;
    Object.values(partsRef.current).forEach((part) => canvas.remove(part));
    const geometry = getSockGeometry(sockType);
    const parts = {};
    sections.forEach(({ id }) => {
      const part = new Path(geometry[id], { fill: '#FAF9F6', stroke: '#424D46', strokeWidth: 1.8, strokeLineJoin: 'round', selectable: false, hoverCursor: 'pointer' });
      part.on('mousedown', () => onSectionChange(id));
      parts[id] = part;
      canvas.add(part);
    });
    partsRef.current = parts;
    sceneRef.current.type = sockType;
    fitCanvas(canvas, sockType, sceneRef.current.zoom);
  }, [ready, sockType, onSectionChange]);

  useEffect(() => {
    if (!ready) return;
    sections.forEach(({ id }) => partsRef.current[id]?.set({ fill: sockColor[id] }));
    fabricRef.current?.requestRenderAll();
  }, [ready, sockType, sockColor]);

  useEffect(() => {
    sceneRef.current.zoom = zoom;
    if (fabricRef.current) fitCanvas(fabricRef.current, sockType, zoom);
  }, [zoom, sockType]);

  // 이미지 원본은 IndexedDB에서 복원하고 URL은 교체 또는 해제 시 정리한다.
  useEffect(() => {
    let cancelled = false;
    let restoredUrl;
    getImage().then((file) => {
      if (!file || cancelled) return;
      restoredUrl = URL.createObjectURL(file);
      dispatch(addImg(restoredUrl));
    }).catch(() => {
      if (!cancelled) setError('저장된 이미지를 불러오지 못했어요. 다시 업로드해 주세요.');
    });
    return () => { cancelled = true; if (restoredUrl) URL.revokeObjectURL(restoredUrl); };
  }, [dispatch]);

  useEffect(() => () => { if (imgUrl) URL.revokeObjectURL(imgUrl); }, [imgUrl]);

  // 비동기 로딩 중 URL이나 양말 종류가 바뀌면 이전 결과를 무시한다.
  useEffect(() => {
    if (!ready || !fabricRef.current) return;
    const canvas = fabricRef.current;
    let cancelled = false;
    if (imageRef.current) canvas.remove(imageRef.current);
    imageRef.current = null;
    setError('');
    onStatus(imgUrl ? 'loading' : 'ready');
    if (!imgUrl) { canvas.requestRenderAll(); return; }
    FabricImage.fromURL(imgUrl).then((image) => {
      if (cancelled) { image.dispose(); return; }
      const geometry = getSockGeometry(sockType);
      image.scale(80 / Math.max(image.width, image.height));
      image.set({ left: 200, top: geometry.imageY, originX: 'center', originY: 'center', cornerColor: '#315B48', cornerSize: 9, transparentCorners: false, borderColor: '#315B48' });
      image.clipPath = new Path(geometry.body, { absolutePositioned: true, fill: '#000', strokeWidth: 0 });
      imageRef.current = image;
      canvas.add(image);
      canvas.requestRenderAll();
      onStatus('ready');
    }).catch(() => {
      if (cancelled) return;
      setError('이미지를 표시하지 못했어요. 다른 이미지를 선택해 주세요.');
      onStatus('error');
    });
    return () => { cancelled = true; };
  }, [ready, imgUrl, sockType, onStatus]);

  useEffect(() => {
    try {
      localStorage.setItem('sockData', JSON.stringify({ sockType, sockColor }));
      onSaveStatus('자동 저장됨');
    } catch {
      onSaveStatus('저장하지 못했어요');
    }
  }, [sockType, sockColor, onSaveStatus]);

  // 화면 확대 비율과 관계없이 전체 양말을 투명 배경 PNG로 내보낸다.
  useImperativeHandle(ref, () => ({
    exportPNG() {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const previous = [...canvas.viewportTransform];
      canvas.discardActiveObject();
      try {
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        const link = document.createElement('a');
        link.href = canvas.toDataURL({ format: 'png', multiplier: 2, left: 0, top: 0, width: 360, height: 710 });
        link.download = 'sock-design.png';
        link.click();
      } finally {
        canvas.setViewportTransform(previous);
        canvas.requestRenderAll();
      }
    },
  }), []);

  return <div ref={hostRef} className="canvas-host"><canvas ref={canvasRef} aria-label={`${sockType} 양말 편집 캔버스`} />{error && <div className="canvas-error" role="alert">{error}</div>}</div>;
}

export default SockCanvas;
