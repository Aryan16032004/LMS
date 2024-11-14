import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    status:false,
    userData:null,
    userRole:""

}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
       login(state,action){
        state.status = true;
        state.userData = action.payload.userData;
        state.userRole =action.payload.userRole; 
       },
       logout(state){
        state.status = false;
        state.userData = null;
        state.userRole = "";
       }
    }
})   

export const {login,logout} = authSlice.actions;

export default authSlice.reducer;
