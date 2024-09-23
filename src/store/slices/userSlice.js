import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  profile: {},
  userList:[]
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
      let  data = JSON.stringify(state.profile);
      localStorage.setItem("appUser", data);
      
    },
    getUserProfile: (state) => {
      let data = localStorage.getItem("appUser");
      state.profile = JSON.parse(data);
    },
    setUserList: (state, action) => {
      state.userList = action.payload; 
    },

  },
  
});
export const { setUserProfile ,getUserProfile,setUserList} = userSlice.actions;
export default userSlice.reducer;
