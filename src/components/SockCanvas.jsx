import { useEffect, useImperativeHandle, useRef } from 'react';
import { Canvas, loadSVGFromURL, util, FabricImage } from 'fabric';
import bodySvg from '../assets/body.svg';
import cuffSvg from '../assets/cuff.svg';
import heelSvg from '../assets/heel.svg';
import toeSvg from '../assets/toe.svg';
import { useSelector, useDispatch } from 'react-redux';
import { changeSockColor,changeSockType,addImg } from '../store/store';
import { getImage } from '../imageDB';

function SockCanvas({ ref }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const sockSvg = useRef({body: null, cuff: null, heel: null, toe: null});
  const sockColor = useSelector((state) => state.sock.sockColor);
  const imgUrl = useSelector((state)=>state.customSock.img);
  const sockShapeRef = useRef(null);
  const uploadedImgRef = useRef(null);
  const dispatch = useDispatch();

  // 고정된 양말 종류(축구), 현재 색상과 이미지 URL을 JSON으로 만든다.
  function makeSockJson(){

    return JSON.stringify({'sockType':'축구', 'sockColor':sockColor, 'imgUrl':imgUrl});
  }

  // 디자인 정보를 localStorage에 저장한다.
  function saveLocalStorage(){

    const val = makeSockJson();
    console.log("json 데이터라네!!",val);
    localStorage.setItem('sockData',val);

  }

// 저장된 양말 정보를 Redux에 전달하고 IndexedDB의 이미지를 복원한다.
async function restoreSock() {
    const val = JSON.parse(localStorage.getItem('sockData'));

    if (val) {
        dispatch(changeSockType(val.sockType));
        dispatch(changeSockColor(val.sockColor));
    }

    const file = await getImage();

    if (!file) return;

    const imgUrl = URL.createObjectURL(file);
    dispatch(addImg(imgUrl));
}

    // SVG를 Fabric 객체로 변환해 부위별로 보관하고 캔버스에 추가한다.
    async function addSvg(url,section) {
        const { objects, options } = await loadSVGFromURL(url);
        const svgObject = util.groupSVGElements(objects, options);

        svgObject.set({

            fill: sockColor[section],
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
        sockSvg.current[section].set({
            fill: color,
    });
        fabricRef.current.requestRenderAll();
    }

    // 캔버스를 2배 해상도의 PNG로 변환해 다운로드한다.
    function exportPNG() {
        console.log('4. 자식 exportPNG 실행');

        const canvas = fabricRef.current;
        console.log('5. Fabric Canvas:', canvas);

        const pngUrl = canvas.toDataURL({
            format: 'png',
            multiplier: 2,
        });

        console.log('6. 생성된 PNG URL:', pngUrl);

        const link = document.createElement('a');

        link.href = pngUrl;
        link.download = 'sock-design.png';

        link.click();
    }

    // 부모가 ref를 통해 PNG 내보내기를 호출할 수 있게 한다.
    useImperativeHandle(ref, () => ({
    exportPNG,
    }));

    // Redux의 부위별 색상을 SVG 객체에 반영한다.
    const loadSockColor = async () => {

        await editSvg('body', sockColor.body);
        await editSvg('cuff', sockColor.cuff);
        await editSvg('heel', sockColor.heel);
        await editSvg('toe', sockColor.toe);

        fabricRef.current.requestRenderAll();
    };

    // 마운트 시 캔버스를 생성하고 언마운트 시 해제한다.
    useEffect(() => {

    console.log('canvas 마운트 할 때 localStorage 값이에용 ',JSON.parse(localStorage.getItem('sockData')));

    const canvas = new Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#f5f5f5',
    });
    fabricRef.current=canvas;

    return () => {
        console.log('canvas 언마운트 할 때 localStorage 값이에용 ',JSON.parse(localStorage.getItem('sockData')));
        fabricRef.current = null;
        canvas.dispose();
    };

    },[]);

    // 초기 마운트 시 저장 정보 복원, SVG 로딩과 저장을 시작한다.
    useEffect(() => {

        restoreSock();

        const loadSock = async () => {

        addSvg(bodySvg, 'body');
        addSvg(cuffSvg, 'cuff');
        addSvg(heelSvg, 'heel');
        addSvg(toeSvg, 'toe');

        fabricRef.current.requestRenderAll();
        };

        loadSock();
        loadSockColor();
        saveLocalStorage();

    },[]);

    // 색상이 바뀌면 SVG 색상과 저장 데이터를 갱신한다.
    useEffect(() => {

        loadSockColor();
        saveLocalStorage();

    },[sockColor]);

    // 이미지 URL이 바뀌면 이미지를 배치하고 몸체 내부만 표시한다.
    useEffect(() => {

    const handleImageUpload = async (e) => {
    try {

        if (!imgUrl) return;

        if (uploadedImgRef.current) {
            fabricRef.current.remove(uploadedImgRef.current);
        }

        const img = await FabricImage.fromURL(imgUrl);

        img.scaleToWidth(70);
        img.scaleToHeight(70);

        const center = sockShapeRef.current.getCenterPoint();

        img.set({
            left: center.x + 25,
            top: center.y - 200,
            originX: 'center',
            originY: 'center',
        });

        // 몸체를 복제해 캔버스 좌표 기준의 클리핑 마스크로 사용한다.
        const sockShape = await sockShapeRef.current.clone();

        sockShape.set({
            absolutePositioned: true,
        });
        img.clipPath = sockShape;

        fabricRef.current.add(img);
        fabricRef.current.requestRenderAll();
    } finally {
        // 로딩 작업이 끝나면 임시 이미지 URL을 해제한다.
        URL.revokeObjectURL(imgUrl);
    }
    };
    handleImageUpload();
    saveLocalStorage();

    },[imgUrl]);

  return <canvas ref={canvasRef} />;
}

export default SockCanvas;