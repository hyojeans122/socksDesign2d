import { useState } from 'react'
import sockImg from './assets/중목.png';
import './App.css'


function App() {
  
  const [active, setActive] = useState(false);

  return (
    <>
    <div className="wrapper">
      {/* 사이드바 섹션 
          1. 화면 구현
      */}
      <div className="sidebar">
        {/* toggle-tab을 클릭하면 active 클래스를 추가해주때용 
            이 태그에 클래스명 추가하는 방법 기억나? */}
        <div className={`toggle-tab tab1 ${active ? 'active':''}`} onClick={()=>setActive(!active)}>
          <div className="toggle-name"><span>양말종류 선택</span> </div>
          <div className="arrow"></div>
        </div>
        {/* 위에 active가 붙으면 여기도 보여지게 해야되는데,  */}
        <div className="toggle-content">
          <button>단목양말</button>
          <button>중목양말</button>
          <button>장목양말</button>
          <button>단목양말</button>
          <button>중목양말</button>
          <button>장목양말</button>
        </div>
        <div className="toggle-tab tab2"></div>
        <div className="toggle-tab tab3"></div>
        <div className="toggle-tab tab4"></div>
      </div>

      {/* 양말 뷰 섹션 */}
      <div className="socks-view">
          <div className="socks-view-inner">
            {/* 여기에 이미지를 보여주어야 하는데 일단 원하는 위치에 보여주는 것부터 하자 */}
            <img src={sockImg} alt="" />
          </div>
      </div>
    </div>
    </>
  )
}

export default App
