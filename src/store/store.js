import { configureStore, createSlice } from '@reduxjs/toolkit'

// 저장된 디자인을 읽어 양말 상태의 초기값으로 사용한다.
const sockData = JSON.parse(localStorage.getItem('sockData'));

console.log("redux에서 localStorage color값 출력합니다:",sockData);
// 양말 종류와 부위별 색상을 관리한다.
let sock = createSlice({
    name: 'sock',
    initialState: { 
        sockType: sockData?.sockType ??'축구',
        sockColor : {
            body : sockData?.sockColor?.body ?? 'white', 
            cuff: sockData?.sockColor?.cuff ?? 'white',
            heel: sockData?.sockColor?.heel ?? 'white',
            toe: sockData?.sockColor?.toe ?? 'white'
        } 
    },

    reducers: {
        changeSockType(state,action){
            state.sockType = action.payload;
        },
        changeSockColor(state,action){
            // payload의 section에 해당하는 부위만 color로 변경한다.
            const sect = action.payload.section;
            const col = action.payload.color;
            console.log("payload 출력들어가유~", sect);
            state.sockColor[sect] = col;

        }
    }
})

// 캔버스에 표시할 첨부 이미지 URL을 관리한다.
let customSock = createSlice({
    name : 'customSock',
    initialState : {
        img : '',
    },
    reducers: {
        addImg(state,action){
            state.img = action.payload;
        }
    }
})

// 두 슬라이스를 결합해 Redux 스토어를 생성한다.
export default configureStore({
    reducer: {
        sock: sock.reducer,
        customSock : customSock.reducer
    }
})

export let {changeSockType,changeSockColor } = sock.actions;
export let {addImg } = customSock.actions;
