import { habitState } from "../atoms/habits";
import { selector } from "recoil";

export const  workoutDurationState = selector({
    key:"workoutDurationState",
    get:({get})=>{
        const state = get(habitState);
        return state.workoutDuration;
    }
});