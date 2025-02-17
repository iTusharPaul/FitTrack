import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import Appbar from "./components/Appbar";
import Landing from "./components/Landing";
import Signup from "./components/Signup";
import Signin from './components/Signin';
import ChestList from './components/ChestList';
import BackList from './components/BackList';
import LegsList from './components/LegsList';
import ArmsList from './components/ArmsList';
import ShouldersList from './components/ShouldersList';
import WorkoutProgress from './components/WorkoutProgress';
import HabbitLogger from './components/HabbitLogger';
import { RecoilRoot, useRecoilState } from 'recoil';
import WaterIntakeReport from './components/Habbit Reports/WaterIntakeReport';
import SleepReport from './components/Habbit Reports/SleepReport';
import StepCountReport from './components/Habbit Reports/StepCountReport';
import WorkoutDurationReport from './components/Habbit Reports/WorkoutDurationReport';
import Profile from './components/Profile';
import { useSetRecoilState } from 'recoil';
import { userState } from './store/atoms/user';
import { BASE_URL } from './config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert } from '@mui/material';


function App() {
  return <div style={{width: "100vw",
    height:"100vh",
    margin:0,
    backgroundColor:"black"
  }}>
    
    <RecoilRoot>
    <Router>
    <Appbar/> 
    <Inituser/>
    <Routes>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/" element={<Landing/>}/>
      <Route path="/ChestList" element={<ChestList/>}/>
      <Route path="/BackList" element={<BackList/>}/>
      <Route path="/LegsList" element={<LegsList/>}/>
      <Route path="/ArmsList" element={<ArmsList/>}/>
      <Route path="/ShouldersList" element={<ShouldersList/>}/>
      <Route path = "/WorkoutProgress" element={<WorkoutProgress/>}/>
      <Route path="/HabbitLogger" element={<HabbitLogger/>}/>
      <Route path="/WaterIntakeReport" element={<WaterIntakeReport/>}/>
      <Route path="/SleepReport" element={<SleepReport/>}/>
      <Route path="/StepCountReport" element={<StepCountReport/>}/>
      <Route path="/WorkoutDurationReport" element={<WorkoutDurationReport/>}/>
      <Route path="/Profile" element={<Profile/>}/>
    </Routes>
    </Router> 
  </RecoilRoot>
  </div>
}

function Inituser(){
  const setUser = useSetRecoilState(userState);
  const init=async()=>{
    try{
      const response = await axios.get(`${BASE_URL}/user/me`,{headers:{
        "Authorization": "Bearer "+ localStorage.getItem("token")
      }})

      if(response.data.username){
        setUser({
          isLoading:false,
          userEmail:response.data.username
        })
      }
      else{
        setUser({
          isLoading:false,
          userEmail:null
        })
        alert('You are not logged in. Kindly Signup/Login');
      }

  }catch(e){
    setUser({
      isLoading:false,
      userEmail:null
    })
    alert('You are not logged in. Kindly Signup/Login');
  }
};

useEffect(()=>{
  init();
},[]);

return <></>
}

 

export default App
