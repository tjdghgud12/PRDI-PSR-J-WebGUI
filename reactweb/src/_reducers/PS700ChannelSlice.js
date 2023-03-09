import { createSlice } from "@reduxjs/toolkit";


const PS700ChannelSlice = createSlice({
    name: 'PS700Channel',
    initialState: { 
        numberOfChannels: 1,
        channelData : [
            { index: 'firstNet', DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 763.000000, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 793.000000, BW : 0, sleepStatus: false },
            { index: 1, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 769.006250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 799.006250, BW : 0.0125, sleepStatus: false },
            { index: 2, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 769.106250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 799.106250, BW : 0.0125, sleepStatus: false },
            { index: 3, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 769.206250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 799.206250, BW : 0.0125, sleepStatus: false },
            { index: 4, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 769.306250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 799.306250, BW : 0.0125, sleepStatus: false },
            { index: 5, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 769.406250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 799.406250, BW : 0.0125, sleepStatus: false },
            { index: 6, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 769.506250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 799.506250, BW : 0.0125, sleepStatus: false },
            { index: 7, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 769.606250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 799.606250, BW : 0.0125, sleepStatus: false },
            { index: 8, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 769.706250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 799.706250, BW : 0.0125, sleepStatus: false },
            { index: 9, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 769.806250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 799.806250, BW : 0.0125, sleepStatus: false },
            { index: 10, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 769.906250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 799.906250, BW : 0.0125, sleepStatus: false },
            { index: 11, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 770.006250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 800.006250, BW : 0.0125, sleepStatus: false },
            { index: 12, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 770.106250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 800.106250, BW : 0.0125, sleepStatus: false },
            { index: 13, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 770.206250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 800.206250, BW : 0.0125, sleepStatus: false },
            { index: 14, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 770.306250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 800.306250, BW : 0.0125, sleepStatus: false },
            { index: 15, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 770.406250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 800.406250, BW : 0.0125, sleepStatus: false },
            { index: 16, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 770.506250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 800.506250, BW : 0.0125, sleepStatus: false },
            { index: 17, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 770.606250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 800.606250, BW : 0.0125, sleepStatus: false },
            { index: 18, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 770.706250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 800.706250, BW : 0.0125, sleepStatus: false },
            { index: 19, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 770.806250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 800.806250, BW : 0.0125, sleepStatus: false },
            { index: 20, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 770.906250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 800.906250, BW : 0.0125, sleepStatus: false },
            { index: 21, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 771.006250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 801.006250, BW : 0.0125, sleepStatus: false },
            { index: 22, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 771.106250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 801.106250, BW : 0.0125, sleepStatus: false },
            { index: 23, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 771.206250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 801.206250, BW : 0.0125, sleepStatus: false },
            { index: 24, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 771.306250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 801.306250, BW : 0.0125, sleepStatus: false },
            { index: 25, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 771.406250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 801.406250, BW : 0.0125, sleepStatus: false },
            { index: 26, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 771.506250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 801.506250, BW : 0.0125, sleepStatus: false },
            { index: 27, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 771.606250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 801.606250, BW : 0.0125, sleepStatus: false },
            { index: 28, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 771.706250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 801.706250, BW : 0.0125, sleepStatus: false },
            { index: 29, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 771.806250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 801.806250, BW : 0.0125, sleepStatus: false },
            { index: 30, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 771.906250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 801.906250, BW : 0.0125, sleepStatus: false },
            { index: 31, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 772.006250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 802.006250, BW : 0.0125, sleepStatus: false },
            { index: 32, DLinput: 0, DLatten: 0, DLoutput: 0, DLfreqInfo: 772.106250, ULinput: 0, ULatten: 0, ULoutput: 0, ULfreqInfo: 802.106250, BW : 0.0125, sleepStatus: false },
        ],
        
    },
    reducers: {
        PS700ChannelChange(state, action){
            if( action.payload.number == 'firstNet' ){
                state.channelData[0] = action.payload.value;
            }else if( action.payload.number == 'numberOfChannels' ){
                state.numberOfChannels = action.payload.value;
            }else{
                for (let i = 0; i < 33; i++) {
                    if( action.payload.number == i ){
                        state.channelData[i] = action.payload.value;
                    }
                } 
            }
        }
    }
})


export const { PS700ChannelChange } = PS700ChannelSlice.actions
export default PS700ChannelSlice.reducer