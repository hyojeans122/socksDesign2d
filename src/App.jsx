import { useState } from 'react'
import sockImg from './assets/중목.png';
import './App.css'
import SideBar from './components/SideBar';
import SockView from './components/SockView';



function App() {
  
  

  return (
    <>
    <div className="wrapper">

      <SideBar></SideBar>

      {/* 양말 뷰 섹션 */}
      <SockView></SockView>
    </div>
    </>
  )
}



export default App
