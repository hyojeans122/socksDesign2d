import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { changeSockType,changeSockColor, addImg } from "../store/store";


// 3-3) 파일명과 동일한 SideBar 함수 안에서 useDispatch호출, 메소드 생성을 해야돼. 작성 규칙이야
function SideBar({ exportPNG }){
  
  const [active, setActive] = useState(false);
  const [sect, setSect] = useState(null);

  const types = ['단목','중목','장목','축구','페이크'];
  const section = ['body', 'cuff',  'heel', 'toe'];
  const color = ['green', 'blue', 'yellow', 'orange', 'purple'];
  let dispatch = useDispatch();

  function changeSock(val){
    // 3-2) store action 호출하면서 파라미터로 전달해주자~ action dispatch 어떻게 했었더라?
    dispatch(changeSockType(val));
  }
  function changeColor(color){
    dispatch(changeSockColor({section : sect, color : color}));
    console.log("변경할 부위, color =",sect, color);
  }

  // 이미지 업로드 기능 시작
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    dispatch(addImg(imageUrl));
  };
  // 이미지 업로드 기능 끝
  
    function handleClick() {
    const png = exportPNG.current.exportPNG();
    console.log(png);
  }

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
      {/* 사이드바 섹션 
      1. 화면 구현
      2. 컴포넌트로 분리하기
      3. 양말종류선택 기능구현하기
      4. 데이터 기반 렌더링 
      */}
      <div className="sidebar">
        {/* toggle-tab을 클릭하면 active 클래스를 추가해주때용 
            이 태그에 클래스명 추가하는 방법 기억나? */}
        <div className={`toggle-tab tab1 ${active ? 'active':''}`} onClick={()=>setActive(!active)}>
          <div className="toggle-name"><span>양말종류 선택</span> </div>
          <div className="arrow"></div>
        </div>
       

        {/* 4-1) 데이터 기반 렌더링 */}
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