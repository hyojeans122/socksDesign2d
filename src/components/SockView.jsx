import shortImg from '../assets/단목.png';
import middleImg from '../assets/중목.png';
import longImg from '../assets/장목.png';
import soccerImg from '../assets/축구.png';
import fakeImg from '../assets/페이크.png';
import { useDispatch, useSelector } from 'react-redux';
import SockCanvas from './SockCanvas';

function SockView(){
  let sockType = useSelector((state) => state.sock.sockType)
  console.log('sockType store로 관리한다!!!!',sockType);

  const sockTypes=[
    { name: '단목', image: shortImg },
    { name: '중목', image: middleImg },
    { name: '장목', image: longImg },
    { name: '축구', image: soccerImg },
    { name: '페이크', image: fakeImg }
  ]

  console.log('sockType:', sockType);
  console.log('sockTypes:', sockTypes);
  // 선택한 양말 종류에 맞는 미리보기 이미지를 찾는다.
  let result = sockTypes.find((val,idx)=> {return val.name===sockType})
  console.log("find결과!!",result);

  return(
  <>
    <div className="socks-view">
    <div className="socks-view-inner">

      <SockCanvas/>

      <img src={result.image} alt="" />

    </div>
    </div>

  </>
  )
}

export default SockView;