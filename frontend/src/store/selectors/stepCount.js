import { habitState } from "../atoms/habits";
import { selector } from "recoil";

export const  stepCountState = selector({
    key:"stepCountState",
    get:({get})=>{
        const state = get(habitState);
        return state.stepCount;
    }
});