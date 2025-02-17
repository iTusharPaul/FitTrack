import { atom } from "recoil";

export const habitState = atom({
    key:"habitState",
    default:{
        isLoading:true,
        waterIntake:0,
        sleep:0,
        stepCount:0,
        workoutDuration:0
    }
});