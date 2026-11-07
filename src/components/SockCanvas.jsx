import { useEffect, useRef } from 'react';
import { Canvas, loadSVGFromURL, util, FabricImage } from 'fabric';
import bodySvg from '../assets/body.svg';
import cuffSvg from '../assets/cuff.svg';
import heelSvg from '../assets/heel.svg';
import toeSvg from '../assets/toe.svg';
import { useSelector, useDispatch } from 'react-redux';

function SockCanvas() {
  const canvasRef = useRef(null);// HTML canvas 참조
  const fabricRef = useRef(null); // Fabric Canvas 객체 참조
  const sockSvg = useRef({body: null, cuff: null, heel: null, toe: null}); // sock svg Fabric객체 참조
  const sockColor = useSelector((state) => state.sock.sockColor);
  const imgUrl = useSelector((state)=>state.customSock.img);
  const sockShapeRef = useRef(null); //클리핑 영역

     
    //SVG 파일을 Fabric 객체로 변환하는 함수
    async function addSvg(url,section) {
    const { objects, options } = await loadSVGFromURL(url);
    const svgObject = util.groupSVGElements(objects, options);

    svgObject.set({
        fill: 'white',
        selectable: false,
        evented: false,
    });

    if (url === bodySvg) {
        sockShapeRef.current = svgObject;
    }

    sockSvg.current[section] = svgObject;

    fabricRef.current.add(svgObject);


    }


    function editSvg(section, color) {
    //sockColor [{},{},{},{}] 로 되어 있어서 아래 코드 구조변경필요함
    sockSvg.current[section].set({
        fill: color,
    });

    fabricRef.current.requestRenderAll();
    }

  // refactor : canvas 생성 useEffect : 최초 마운트 시 1회 실행
    useEffect(() => {
    // STEP1) Fabric Canvas 생성
    const canvas = new Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#f5f5f5',
    });
    fabricRef.current=canvas;

    // 컴포넌트가 unmount 될 때 실행되는 코드입니다
    return () => {
        fabricRef.current = null;
        canvas.dispose();
    };

    },[]);
 
 
    // refactor : 양말 svg 렌더링 useEffect : 양말 svg 가 변경될 때마다 실행
    useEffect(() => {
        // 양말 SVG를 순서대로 Canvas에 추가
        const loadSock = async () => {
        // 각 SVG를 Fabir객체로 만들기
        addSvg(bodySvg, 'body');
        addSvg(cuffSvg, 'cuff');
        addSvg(heelSvg, 'heel');
        addSvg(toeSvg, 'toe');

        fabricRef.current.requestRenderAll();
        };

        loadSock();
    
    },[]); ////////SVG 파일을 현재엔 import한 url로 고정되어 있음. 추후에 양말 형태 state로 구현했을 때 useEffect [양말형태state변수] 로 변경해줘야함. []안에 변수 추가하는 걸 뭐라고 불렀지?





  // refactor :  양말 부위별 색상 변경 렌더링 useEffect : 양말 색상(sockColor)가 변경될 때마다 실행
    useEffect(() => {
        // 양말 SVG를 순서대로 Canvas에 추가
        const loadSock = async () => {
        // 각 SVG를 Fabir객체로 만들기
        await editSvg('body', sockColor.body);
        await editSvg('cuff', sockColor.cuff);
        await editSvg('heel', sockColor.heel);
        await editSvg('toe', sockColor.toe);

        fabricRef.current.requestRenderAll();
        };

        loadSock();
    
    },[sockColor]);

  // refactor :  첨부 이미지 렌더링 및 클리핑 마스크로 이동영역제한 useEffect : 첨부이미지(imgUrl)이 변경될 때마다 실행 
    useEffect(() => {
        
    const handleImageUpload = async (e) => {
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


        fabricRef.current.add(img);
        fabricRef.current.requestRenderAll();
    } finally {
        URL.revokeObjectURL(imgUrl);
    }
    };
    handleImageUpload();

    },[imgUrl]);












  return <canvas ref={canvasRef} />;
}

export default SockCanvas;