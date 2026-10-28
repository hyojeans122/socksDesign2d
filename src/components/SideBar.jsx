import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { changeSockType } from "../store/store";


// 3-3) 파일명과 동일한 SideBar 함수 안에서 useDispatch호출, 메소드 생성을 해야돼. 작성 규칙이야
function SideBar(){
  
  const [active, setActive] = useState(false);
  const types = ['단목','중목','장목','축구','페이크'];
  let dispatch = useDispatch();

  function changeSock(val){
    // 3-2) store action 호출하면서 파라미터로 전달해주자~ action dispatch 어떻게 했었더라?
    dispatch(changeSockType(val));
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
        {/* 위에 active가 붙으면 여기도 보여지게 해야되는데,  */}
        {/* 3-1) 현재 태그의 텍스트를 파라미터로 전달해줘야 하는데 아 보통 이 태그에 value로 정해두겠구나? data-set으로 전달했었나? 검색해봐야겠다. */}
        {/* <div className="toggle-content">
          <button onClick={() => changeSock('단목')}>단목양말</button>
          <button onClick={() => changeSock('중목')}>중목양말</button>
          <button onClick={() => changeSock('장목')}>장목양말</button>
          <button onClick={() => changeSock('축구')}>축구양말</button>
          <button onClick={() => changeSock('페이크')}>페이크삭스</button>
        </div> */}

        {/* 4-1) 데이터 기반 렌더링 */}
        <div className="toggle-content">
          {
            types.map((type)=>
            (
              <button onClick={() => changeSock(type)}>{type}양말</button>

            ))  
          }
        </div>

        <div className="toggle-tab tab2"></div>
        <div className="toggle-tab tab3"></div>
        <div className="toggle-tab tab4"></div>
      </div>
      
      </>
  )
}

export default SideBar;