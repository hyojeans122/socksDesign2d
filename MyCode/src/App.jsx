import { useRef, useState } from 'react'
import sockImg from './assets/중목.png';
import './App.css'
import SideBar from './components/SideBar';
import SockView from './components/SockView';
import SockCanvas from './components/SockCanvas';


function App() {
  //ref객체 생성해서 <SockCanvas에 전달해주기!!
  const sockCanvasRef = useRef(null);
  

  return (
    <>
    <div className="wrapper">

      <SideBar exportPNG={sockCanvasRef}/>
      <SockCanvas ref={sockCanvasRef}/>
      {/* 양말 뷰 섹션 */}
      <SockView></SockView>

      

    </div>
    </>
  )
}



export default App
