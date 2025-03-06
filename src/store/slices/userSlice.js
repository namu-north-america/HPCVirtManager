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

      if (data.role === "user") {
        const result = [];
        for (const key in data) {
          if (key.startsWith('namespace')) {
            const namespaceValue = data[key];
            const relatedData = { namespace: namespaceValue };
            for (const relatedKey in data) {
              if (relatedKey.startsWith(namespaceValue)) {
                const strippedKey = relatedKey.replace(`${namespaceValue}-`, '');
                relatedData[strippedKey] = data[relatedKey];
              }
            }
            result.push(relatedData);
          }
        }      
        state.userNamespace= result;
      }
    },

    setUserList: (state, action) => {
      state.userList = action.payload;
    },

  },
});

export const { setUserProfile, getUserProfile, setUserList } = userSlice.actions;

export default userSlice.reducer;
