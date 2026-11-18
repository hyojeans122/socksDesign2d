import { configureStore, createSlice } from '@reduxjs/toolkit'
import { sockTypes } from '../sockDesign';

// 저장된 디자인을 읽어 양말 상태의 초기값으로 사용한다.
let sockData;
try {
    sockData = JSON.parse(localStorage.getItem('sockData'));
} catch {
    sockData = null;
}

function savedColor(section, fallback) {
    const value = sockData?.sockColor?.[section];
    return typeof value === 'string' && CSS.supports('color', value) ? value : fallback;
}

// 양말 종류와 부위별 색상을 관리한다.
let sock = createSlice({
    name: 'sock',
    initialState: { 
        sockType: sockTypes.includes(sockData?.sockType) ? sockData.sockType : '축구',
        sockColor : {
            body: savedColor('body', '#ffffff'),
            cuff: savedColor('cuff', '#ffffff'),
            heel: savedColor('heel', '#ffffff'),
            toe: savedColor('toe', '#ffffff')
        } 
    },

    reducers: {
        changeSockType(state,action){
            if (sockTypes.includes(action.payload)) state.sockType = action.payload;
        },
        changeSockColor(state,action){
            // payload의 section에 해당하는 부위만 color로 변경한다.
            const sect = action.payload.section;
            const col = action.payload.color;
            if (Object.hasOwn(state.sockColor, sect)) state.sockColor[sect] = col;

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
