import { useRef, useImperativeHandle } from 'react';

function SockCanvas({ ref }) {
  const fabricCanvasRef = useRef(null);

  function exportPNG() {
      return fabricCanvasRef.current.toDataURL({
        format: 'png',
      });
}

  //1번
  useImperativeHandle(ref, () => ({
    exportPNG
  }));
  //2번
  useImperativeHandle(ref, () => ({
    exportPNG : exportPNG;
  }));

  return <canvas />;
}

export default SockCanvas;