import { configureStore, createSlice } from '@reduxjs/toolkit'

// 양말 종류 상태 값부터 slice 객체로 만들어보자.
// 어떻게 만들었었지?
// step1) createSlice()로 slice 객체 생성. 객체 안에는 state 초기값과 변경로직 값이 들어있음
let sock = createSlice({
    name: 'sock',
    // 양말 종류 state를 정의합시다.  이렇게 정의하면 되나..?어떻게 정의하지
    initialState: { 
        sockType: '축구',
        sockColor : {
            body : 'white', 
            cuff : 'green', 
            heel : 'blue', 
            toe : 'green'
        } 
    },

    reducers: {
        changeSockType(state,action){
            state.sockType = action.payload;
        },
        changeSockColor(state,action){
            //paylod로 section, color가 들어오
            //section에 해당하는 key 의 value를 color로 교체
            //state.sockColor = action.payload;
            const sect = action.payload.section;
            const col = action.payload.color;
            console.log("payload 출력들어가유~", sect);
            state.sockColor[sect] = col;

        }
    }
})

let customSock = createSlice({
    name : 'customSock',
    initialState : {
        img : null
    },
    reducers: {
        addImg(state,action){
            state.img = action.payload;
        }
    }
})

// 왜 이건 안되고 아래 코드는 되지?
// export const store = configureStore({
//   reducer: {
//     sockType: sock.reducer,
//   }
// })

export default configureStore({
    reducer: {
        sock: sock.reducer,
        customSock : customSock.reducer
    }
})

export let {changeSockType,changeSockColor } = sock.actions;
export let {addImg } = customSock.actions;