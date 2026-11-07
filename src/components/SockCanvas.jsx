import { useEffect, useRef } from 'react';
import { Canvas, loadSVGFromURL, util, FabricImage } from 'fabric';
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
  const imgUrl = useSelector((state)=>state.customSock.img);
  console.log('img=',imgUrl);
  const sockShapeRef = useRef(null);





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

      //bodySvg 패브릭 객체 저장 (clipPath의 범위를 지정하기 위해서)
      if (url === bodySvg) {
            sockShapeRef.current = svgObject;
        }

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



    // 4. 이미지 fabric img 객체로 변환
    const handleImageUpload = async (e) => {
    //const file = img;
    //if (!file) return;
    //const imageUrl = URL.createObjectURL(file);

    try {
        const img = await FabricImage.fromURL(imgUrl);

        // 5. 이미지 이동 영역제한 : bodySvg 영역을 이미지 clone:클리핑 영역으로 지정
        // 5-1. 이미지 크기 설정
        img.scaleToWidth(70);
        img.scaleToHeight(70);

        // 5-2. bodySvg 중심 좌표 가져오기
        const center = sockShapeRef.current.getCenterPoint();

        // 5-3. 이미지 중심을 bodySvg 중심에 배치
        img.set({
            left: center.x + 25,
            top: center.y - 200,
            originX: 'center',
            originY: 'center',
        });

        // 5-4. 클리핑 적용
        const sockShape = await sockShapeRef.current.clone();

        sockShape.set({
            absolutePositioned: true,
        });
        img.clipPath = sockShape;
        // 5. end




        canvas.add(img);
        canvas.requestRenderAll();
    } finally {
        URL.revokeObjectURL(imgUrl);
    }
    };
    handleImageUpload();


    // 마지막. 컴포넌트 제거 시 Canvas 정리
    return () => {
      canvas.dispose();
    };


  }, [imgUrl]);

  return <canvas ref={canvasRef} />;
}

export default SockCanvas;