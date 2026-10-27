import sockImg from '../assets/중목.png';


function SockView(){
  return(
    <>
      <div className="socks-view">
      <div className="socks-view-inner">
        {/* 여기에 이미지를 보여주어야 하는데 일단 원하는 위치에 보여주는 것부터 하자 */}
        <img src={sockImg} alt="" />
      </div>
      </div>
      
    </>
  )
}

export default SockView;