import { createSlice } from '@reduxjs/toolkit';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
interface UserType {
  userId: string;
  email: string;
  gender: string;
  profileImg: string;
  userType: string;
  fullName: string;
  mobileNo: number;
  redeemCoins: number;
  claimRedeemCoins: number;
}
const initialState = {
  userId: '',
  email: '',
  gender: '',
  profileImg: '',
  userType: '',
  fullName: '',
  mobileNo: 0,
  redeemCoins: 0,
  claimRedeemCoins: 0,
};
const userSlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user: UserType = action.payload;
      state.fullName = user.fullName;
      state.email = user.email;
      state.gender = user.gender;
      state.profileImg = user.profileImg;
      state.userType = user.userType;
      state.userId = user.userId;
      state.mobileNo = user.mobileNo;
      state.redeemCoins = user.redeemCoins;
      state.claimRedeemCoins = user.claimRedeemCoins;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
