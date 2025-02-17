import { atom } from "recoil";

export  const muscleGroupsState = atom({
    key:"muscleGroupsState",
    default:{
        isLoading:true,
        muscleGroups:[]
    }
});