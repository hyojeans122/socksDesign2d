import { useEffect, useRef } from 'react';
import { Canvas, loadSVGFromURL, util } from 'fabric';
import bodySvg from '../assets/body.svg';
import cuffSvg from '../assets/cuff.svg';
import heelSvg from '../assets/heel.svg';
import toeSvg from '../assets/toe.svg';
import { useSelector, useDispatch } from 'react-redux';

function SockCanvas() {
  const canvasRef = useRef(null);
  //store에서 state 꺼내오기 state 구조 어떻게 할까 [{}, {}]
  const sockColor = useSelector((state) => state.sock.sockColor);
  console.log('sockColor는?? ' , sockColor);





  useEffect(() => {
    // 1. Fabric Canvas 생성
    const canvas = new Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#f5f5f5',
    });

    // 2. SVG 파일을 Fabric 객체로 변환하는 함수
    const addSvg = async (url, color) => {
      const { objects, options } = await loadSVGFromURL(url);
      const svgObject = util.groupSVGElements(objects, options);

      svgObject.set({
        fill: color,
        selectable: false,
        evented: false,
      });

      canvas.add(svgObject);
    };

    // 3. 양말 SVG를 순서대로 Canvas에 추가
    const loadSock = async () => {
      //각 SVG 파일의 내부 요소만 Fabir객체로 그룹화하는 함수
      await addSvg(bodySvg, sockColor.body);
      await addSvg(cuffSvg, sockColor.cuff);
      await addSvg(heelSvg, sockColor.heel);
      await addSvg(toeSvg, sockColor.toe);

      canvas.requestRenderAll();
    };

    loadSock();

    // 4. 컴포넌트 제거 시 Canvas 정리
    return () => {
      canvas.dispose();
    };
  });

  return <canvas ref={canvasRef} />;
}

export default SockCanvas;