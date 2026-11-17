import { useRef, useState } from 'react'
import sockImg from './assets/중목.png';
import './App.css'
import SideBar from './components/SideBar';
import SockView from './components/SockView';
import SockCanvas from './components/SockCanvas';

function App() {

  // 사이드바에서 캔버스의 PNG 내보내기를 호출하도록 ref를 공유한다.
  const sockCanvasRef = useRef(null);

  return (
    <>
    <div className="wrapper">

      <SideBar exportPNG={sockCanvasRef}/>
      <SockCanvas ref={sockCanvasRef}/>

      <SockView></SockView>

    </div>
    </>
  )
}

export default App
