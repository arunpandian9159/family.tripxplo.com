import { createSlice } from "@reduxjs/toolkit";

export interface Room {
  room: {
    perRoom: number;
    totalRooms: number;
    totalAdults: number;
    totalChilds: number;
    roomSchema: InputRoomWithId[];
    initiallyLoaded: boolean;
  };
}
interface InputRoomWithId {
  id: number;
  totalAdults: number;
  totalChilds: number;
}
interface InputAdultChild {
  adult: number;
  child: number;
  room: number;
}
const initialState: Room = {
  room: {
    perRoom: 0,
    totalRooms: 0,
    totalAdults: 0,
    totalChilds: 0,
    roomSchema: [
      {
        id: 1,
        totalAdults: 0,
        totalChilds: 0,
      },
    ],
    initiallyLoaded: false,
  },
};
const selectRoomSlice = createSlice({
  name: "selectRoomSlice",
  initialState: initialState,
  reducers: {
    initialLoad(state) {
      if (state.room.initiallyLoaded) return;
      state.room.totalRooms = 0;
      state.room.totalAdults = 0;
      state.room.totalChilds = 0;
      state.room.initiallyLoaded = true;
    },
    selectRoom(state, action) {
      const rooms: { room: InputRoomWithId[] } = action.payload;
      state.room.totalRooms = rooms.room.length;
      state.room.totalAdults = rooms.room.reduce(
        (total, room) => total + room.totalAdults,
        0,
      );
      state.room.totalChilds = rooms.room.reduce(
        (total, room) => total + room.totalChilds,
        0,
      );
      state.room.roomSchema = rooms.room.map((r) => {
        if (isNaN(r.totalAdults)) {
          r.totalAdults = 0;
        }
        if (isNaN(r.totalChilds)) {
          r.totalChilds = 0;
        }
        return r;
      });
    },
    selectPerRooom(state, action) {
      state.room.perRoom = action.payload;
    },
    selectAdultsChild(state, action) {
      const rooms: { room: InputAdultChild } = action.payload;
      state.room.totalRooms = rooms.room?.room;
      state.room.totalAdults = rooms.room?.adult;
      state.room.totalChilds = rooms.room?.child;
      state.room.roomSchema = [{ id: 1, totalAdults: 0, totalChilds: 0 }];
    },
    selectInitiallyLoaded(state, action) {
      state.room.initiallyLoaded = action.payload;
    },
  },
});
export const {
  initialLoad,
  selectRoom,
  selectAdultsChild,
  selectPerRooom,
  selectInitiallyLoaded,
} = selectRoomSlice.actions;
export default selectRoomSlice.reducer;
