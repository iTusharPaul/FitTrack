import {atom} from 'recoil';

export const exercisesLogged = atom({
    key:"exercisesLogged",
    default:{
        isLoading:true,
        exercises:{}
    }
});