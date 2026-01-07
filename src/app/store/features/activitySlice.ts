import { createSlice } from '@reduxjs/toolkit';
interface activityState {
  packageName: string;
  packageId: string;
  activity: any[];
}
interface changeActivityType {
  slot: number;
  day: number;
  activity: any[];
}
const initialState: activityState = {
  packageName: '',
  packageId: '',
  activity: [],
};
const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setActivity: (state, action) => {
      state.activity = action.payload.activity;
      state.packageName = action.payload.packageName;
      state.packageId = action.payload.packageId;
    },
    changeActivity: (state, action) => {
      const { slot, day, activity }: changeActivityType = action.payload;
      const updatedData = state.activity.map(dayItem => {
        if (dayItem.day === day) {
          const updatedEvents = dayItem.event.map((slotItem: any) => {
            if (slotItem.slot === slot) {
              return { ...slotItem, ...activity, activityType: 'allocated' };
            } else {
              return slotItem;
            }
          });

          return { ...dayItem, event: updatedEvents };
        } else {
          return dayItem;
        }
      });

      state.activity = updatedData;
    },
  },
});

export const { setActivity, changeActivity } = activitySlice.actions;
export default activitySlice.reducer;
