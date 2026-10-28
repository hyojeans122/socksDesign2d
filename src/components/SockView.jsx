import shortImg from '../assets/단목.png';
import middleImg from '../assets/중목.png';
import longImg from '../assets/장목.png';
import soccerImg from '../assets/축구.png';
import fakeImg from '../assets/페이크.png';
import { useDispatch, useSelector } from 'react-redux';


//3. 양말 이미지 경로 변수화해주기. 어떻게 했었지?
//   이미지 넣는 법은 2가지거든, assert폴더에 넣고 import 하는 방법 vs public 폴더에 넣고 경로자체를 가져와 쓰는법
//   여기선 이미지를 컴폰넌트가 관리해야하니깐 import를 하는 방법을 사용하는게 적절해.

function SockView(){
  let sockType = useSelector((state) => state.sockType)
  console.log('sockType store로 관리한다!!!!',sockType);

  const sockTypes=[
    { name: '단목', image: shortImg },
    { name: '중목', image: middleImg },
    { name: '장목', image: longImg },
    { name: '축구', image: soccerImg },
    { name: '페이크', image: fakeImg }
  ]
  // 이제 state 값 가지고 와서 name과 동일한 idx의 image 값을 아래 img src 값으로 주면 되겠다.
  // sockType 값을 sockTypes에서 find 하자. 그 결과에서 image 속성 값을 추출하자.

  console.log('sockType:', sockType.sockType);
console.log('sockTypes:', sockTypes);
  let result = sockTypes.find((val,idx)=> {return val.name===sockType.sockType}) //아 첫번째 인자가 val이였나 헷갈림
  console.log("find결과!!",result);


    return( 
    <>
      <div className="socks-view">
      <div className="socks-view-inner">
        {/* 여기에 이미지를 보여주어야 하는데 일단 원하는 위치에 보여주는 것부터 하자 
            이제 SideBar에서 
        */}
        <img src={result.image} alt="" />
      </div>
      </div>
      
    </>
  )
}

export default SockView;