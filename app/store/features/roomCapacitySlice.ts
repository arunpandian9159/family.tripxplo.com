import { createSlice } from "@reduxjs/toolkit";

export interface Room {
  room: {
    perRoom: number;
    totalRooms: number;
    totalAdults: number;
    totalChilds: number;
    // New age category fields
    children611: number; // Children 6-11 years
    children25: number; // Child below 5 (2-5 years)
    infants: number; // Infants under 2 years
    // Family type tracking
    familyTypeName: string;
    isFamilyTypeSelected: boolean; // false = detected, true = selected (after Apply)
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
  // New age category fields
  children611?: number;
  children25?: number;
  infants?: number;
}
const initialState: Room = {
  room: {
    perRoom: 0,
    totalRooms: 0,
    totalAdults: 0,
    totalChilds: 0,
    children611: 0,
    children25: 0,
    infants: 0,
    familyTypeName: "",
    isFamilyTypeSelected: false,
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
      state.room.children611 = 0;
      state.room.children25 = 0;
      state.room.infants = 0;
      state.room.familyTypeName = "";
      state.room.isFamilyTypeSelected = false;
      state.room.initiallyLoaded = true;
    },
    selectRoom(state, action) {
      const rooms: { room: InputRoomWithId[] } = action.payload;
      state.room.totalRooms = rooms.room.length;
      state.room.totalAdults = rooms.room.reduce(
        (total, room) => total + room.totalAdults,
        0
      );
      state.room.totalChilds = rooms.room.reduce(
        (total, room) => total + room.totalChilds,
        0
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
      // Store individual age categories
      state.room.children611 = rooms.room?.children611 ?? 0;
      state.room.children25 = rooms.room?.children25 ?? 0;
      state.room.infants = rooms.room?.infants ?? 0;
      // totalChilds = sum of all child categories for API compatibility
      state.room.totalChilds =
        (rooms.room?.children611 ?? 0) +
        (rooms.room?.children25 ?? 0) +
        (rooms.room?.infants ?? 0);
      state.room.roomSchema = [{ id: 1, totalAdults: 0, totalChilds: 0 }];
    },
    selectInitiallyLoaded(state, action) {
      state.room.initiallyLoaded = action.payload;
    },
    setFamilyType(state, action) {
      state.room.familyTypeName = action.payload.name;
      state.room.isFamilyTypeSelected = action.payload.isSelected ?? false;
    },
  },
});
export const {
  initialLoad,
  selectRoom,
  selectAdultsChild,
  selectPerRooom,
  selectInitiallyLoaded,
  setFamilyType,
} = selectRoomSlice.actions;
export default selectRoomSlice.reducer;
