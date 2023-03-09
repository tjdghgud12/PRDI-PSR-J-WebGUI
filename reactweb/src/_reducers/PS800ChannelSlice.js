import { createSlice } from "@reduxjs/toolkit";


const PS800ChannelSlice = createSlice({
    name: 'PS800Channel',
    initialState: { 
        numberOfChannels: 0,
        channelData : [
            { index: 1, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 851.006250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 806.006250, BW : 0.0125, sleepStatus: false },
            { index: 2, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 851.106250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 806.106250, BW : 0.0125, sleepStatus: false },
            { index: 3, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 851.206250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 806.206250, BW : 0.0125, sleepStatus: false },
            { index: 4, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 851.306250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 806.306250, BW : 0.0125, sleepStatus: false },
            { index: 5, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 851.406250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 806.406250, BW : 0.0125, sleepStatus: false },
            { index: 6, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 851.506250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 806.506250, BW : 0.0125, sleepStatus: false },
            { index: 7, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 851.606250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 806.606250, BW : 0.0125, sleepStatus: false },
            { index: 8, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 851.706250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 806.706250, BW : 0.0125, sleepStatus: false },
            { index: 9, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 851.806250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 806.806250, BW : 0.0125, sleepStatus: false },
            { index: 10, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 851.906250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 806.906250, BW : 0.0125, sleepStatus: false },
            { index: 11, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 852.006250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 807.006250, BW : 0.0125, sleepStatus: false },
            { index: 12, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 852.106250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 807.106250, BW : 0.0125, sleepStatus: false },
            { index: 13, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 852.206250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 807.206250, BW : 0.0125, sleepStatus: false },
            { index: 14, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 852.306250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 807.306250, BW : 0.0125, sleepStatus: false },
            { index: 15, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 852.406250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 807.406250, BW : 0.0125, sleepStatus: false },
            { index: 16, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 852.506250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 807.506250, BW : 0.0125, sleepStatus: false },
            { index: 17, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 852.606250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 807.606250, BW : 0.0125, sleepStatus: false },
            { index: 18, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 852.706250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 807.706250, BW : 0.0125, sleepStatus: false },
            { index: 19, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 852.806250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 807.806250, BW : 0.0125, sleepStatus: false },
            { index: 20, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 852.906250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 807.906250, BW : 0.0125, sleepStatus: false },
            { index: 21, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 853.006250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 808.006250, BW : 0.0125, sleepStatus: false },
            { index: 22, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 853.106250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 808.106250, BW : 0.0125, sleepStatus: false },
            { index: 23, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 853.206250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 808.206250, BW : 0.0125, sleepStatus: false },
            { index: 24, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 853.306250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 808.306250, BW : 0.0125, sleepStatus: false },
            { index: 25, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 853.406250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 808.406250, BW : 0.0125, sleepStatus: false },
            { index: 26, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 853.506250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 808.506250, BW : 0.0125, sleepStatus: false },
            { index: 27, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 853.606250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 808.606250, BW : 0.0125, sleepStatus: false },
            { index: 28, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 853.706250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 808.706250, BW : 0.0125, sleepStatus: false },
            { index: 29, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 853.806250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 808.806250, BW : 0.0125, sleepStatus: false },
            { index: 30, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 853.906250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 808.906250, BW : 0.0125, sleepStatus: false },
            { index: 31, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 854.006250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 809.006250, BW : 0.0125, sleepStatus: false },
            { index: 32, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 854.106250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 809.106250, BW : 0.0125, sleepStatus: false },
        ]
        
    },
    reducers: {
        PS800ChannelChange(state, action){
            if( action.payload.number == 'numberOfChannels' ){
                state.numberOfChannels = action.payload.value;
            }else{
                for (let i = 0; i < 32; i++) {
                    if( action.payload.number == i ){
                        state.channelData[i] = action.payload.value;
                    }
                } 
            }
        }
    }
})


export const { PS800ChannelChange } = PS800ChannelSlice.actions
export default PS800ChannelSlice.reducer