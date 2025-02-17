import { habitState } from "../atoms/habits";
import { selector } from "recoil";

export const  waterIntakeState = selector({
    key:"waterIntakeState",
    get:({get})=>{
        const state = get(habitState);
        return state.waterIntake;
    }
});