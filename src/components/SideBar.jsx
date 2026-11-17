import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { changeSockType,changeSockColor, addImg } from "../store/store";
import { saveImage } from '../imageDB';

function SideBar({ exportPNG }){

  const [active, setActive] = useState(false);
  const [sect, setSect] = useState(null);

  const types = ['단목','중목','장목','축구','페이크'];
  const section = ['body', 'cuff',  'heel', 'toe'];
  const color = ['green', 'blue', 'yellow', 'orange', 'purple'];
  let dispatch = useDispatch();

  // 선택한 양말 종류를 Redux 상태에 반영한다.
  function changeSock(val){

    dispatch(changeSockType(val));
  }
  // 선택한 부위의 색상만 변경한다.
  function changeColor(color){
    dispatch(changeSockColor({section : sect, color : color}));
    console.log("변경할 부위, color =",sect, color);
  }

  const [image, setImage] = useState(null);

  // 원본을 IndexedDB에 저장하고 표시용 임시 URL을 Redux에 전달한다.
  async function handleImageUpload(e) {

    const file = e.target.files[0];

    if (!file) return;

    await saveImage(file);

    const imgUrl = URL.createObjectURL(file);

    dispatch(addImg(imgUrl));
}

  function handleClick() {
    const png = exportPNG.current.exportPNG();
    console.log(png);
  }

  // 연결된 캔버스의 PNG 내보내기 함수를 호출한다.
  function handleDownloadPNG() {
  console.log('1. 다운로드 버튼 클릭');

  console.log('2. ref 확인:', exportPNG.current);

  if (!exportPNG.current) {
    console.log('ref가 연결되지 않음');
    return;
  }

  console.log('3. exportPNG 함수 확인:', exportPNG.current.exportPNG);

  exportPNG.current.exportPNG();
}

  return (
    <>

      <div className="sidebar">

        <div className={`toggle-tab tab1 ${active ? 'active':''}`} onClick={()=>setActive(!active)}>
          <div className="toggle-name"><span>양말종류 선택</span> </div>
          <div className="arrow"></div>
        </div>

        <div className="toggle-content">
          {
            types.map((type)=>
            (
              <button onClick={() => changeSock(type)}>{type}양말</button>

            ))
          }
        </div>

        <div className={`toggle-tab tab2 ${active ? 'active':''}`} onClick={()=>setActive(!active)}>
          <div className="toggle-name"><span>양말색상 선택</span> </div>
          <div className="arrow"></div>
        </div>
        <div className="toggle-content">
          <div style={{ width: '100%' }}><span>부위</span></div>
          {
            section.map((sec)=>
            (
              <button onClick={() => setSect(sec)}>{sec}</button>
            ))
          }

          <div style={{ width: '100%' }}><span>색상</span></div>
          {
            color.map((col)=>
            (
              <button onClick={() => changeColor(col)}>{col}</button>
            ))
          }
        </div>

        <div className={`toggle-tab tab3 ${active ? 'active':''}`} onClick={()=>setActive(!active)}>
          <div className="toggle-name"><span>로고 업로드</span> </div>
          <div className="arrow"></div>
        </div>
        <div className="toggle-content">
          <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {image && <img src={image} alt="업로드 이미지" width="300" />}
          </div>
        </div>

        <div className="toggle-tab tab4" >

          <button onClick={handleDownloadPNG}>PNG 다운로드</button>
        </div>

      </div>

      </>
  )
}

export default SideBar;