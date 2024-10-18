import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  profile: {},
  userList: [],
  userNamespace: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
      let data = JSON.stringify(state.profile);
      localStorage.setItem("appUser", data);
    },
    getUserProfile: (state) => {
      let data = localStorage.getItem("appUser");
      state.profile = data =JSON.parse(data);
      // Check if the user's role is "user"
     
      if (data.role === "user") {
        
        
        const result = [];

        // Loop through the object to find all namespaces
        for (const key in data) {
          if (key.startsWith('namespace')) {
            const namespaceValue = data[key];
      
            // Collect all keys that start with this namespaceValue, remove the prefix
            const relatedData = { namespace: namespaceValue };
            for (const relatedKey in data) {
              if (relatedKey.startsWith(namespaceValue)) {
                const strippedKey = relatedKey.replace(`${namespaceValue}-`, ''); // Strip prefix
                relatedData[strippedKey] = data[relatedKey];
              }
            }   
            result.push(relatedData);
          }
        }
      
        state.userNamespace= result;
        console.log("namespaces",state.userNamespace);
        
      }
    },
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
  },
});
export const { setUserProfile, getUserProfile, setUserList } =
  userSlice.actions;
export default userSlice.reducer;
