import { configureStore, createSlice } from '@reduxjs/toolkit'

// 양말 종류 상태 값부터 slice 객체로 만들어보자.
// 어떻게 만들었었지?
// step1) createSlice()로 slice 객체 생성. 객체 안에는 state 초기값과 변경로직 값이 들어있음
let sock = createSlice({
    name: 'sock',
    // 양말 종류 state를 정의합시다.  이렇게 정의하면 되나..?어떻게 정의하지
    initialState: { 
        sockType: '축구',
    },

    reducers: {
        changeSockType(state,action){
            state.sockType = action.payload;
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
        sockType: sock.reducer
    }
})

export let {changeSockType} = sock.actions;