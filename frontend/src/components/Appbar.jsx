import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar } from '@mui/material';
import { deepPurple, orange } from "@mui/material/colors";
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import SideMenuPopup from './SideMenuPopup';
import AvatarMenuPopup from './AvatarMenuPopup';
import { userEmailState } from '../store/selectors/userEmail';
import { isUserLoading } from '../store/selectors/isUserLoading';
import { useRecoilValue } from 'recoil';


export default function AppBarButton() {
  const navigate = useNavigate();
  const [isSideMenuOpen,setIsSideMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const username = useRecoilValue(userEmailState);
  const isLoading = useRecoilValue(isUserLoading);
  if(!username || isLoading){
  return (
    <>
    {isSideMenuOpen && <div style={{
      backgroundColor: "linear-gradient(90deg, #121212, #FF4500)",
      height: "100%",
      width: "100%", 
      position: "fixed", 
      top: 0,
      left: 0,
      zIndex: 999,
    }}><div style={{position:"fixed",top:0,left:0,width:"15%",height:"100%",backgroundColor:"rgb(255, 255, 255)",zIndex:1000}}>
      <SideMenuPopup setIsSideMenuOpen={setIsSideMenuOpen}></SideMenuPopup></div></div>}

   
   
    
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{color:"white",backgroundColor:"#1A1A1A", margin:1}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 ,'&:hover':{color:"#E44F26"}}}
            onClick={()=>{setIsSideMenuOpen(true)}}
          >
            <MenuIcon />
          </IconButton>
            <Typography
              variant="h4"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                color: "#E44F26",
                cursor: "pointer",  // Move cursor property inside sx
                '&:hover': { color: "#FF7043" } // Proper hover effect
              }}
              onClick={() => navigate("/")}
            >
              FitTrack
            </Typography>

          <Button color="inherit" size='large' sx={{'&:hover':{color:"#FF7043"}}}onClick={()=>{navigate("/signup")}}><b>Signup</b></Button>
          <Button color="inherit" sx={{'&:hover':{color:"#FF7043"}}} onClick={()=>{navigate("/signin")}}><b>Signin</b></Button>
        </Toolbar>
      </AppBar>
    </Box>
    </>
  );
}

else{

const userInitial = username[0].toUpperCase();
return (
<>
{isSideMenuOpen && <div style={{
   backgroundColor: "linear-gradient( #121212, #FF4500)",
  height: "100%",
  width: "100%", 
  position: "fixed", 
  top: 0,
  left: 0,
  zIndex: 999,
}}><div style={{position:"fixed",top:0,left:0,width:"15%",height:"100%",backgroundColor:"rgb(255, 255, 255)",zIndex:1000}}>
  <SideMenuPopup setIsSideMenuOpen={setIsSideMenuOpen}></SideMenuPopup></div></div>}

  {isAvatarMenuOpen && <div style={{
      backgroundColor: "linear-gradient(90deg, #121212, #FF4500)",
      height: "100%",
      width: "100%", 
      position: "fixed", 
      top: 0,
      left: 0,
      zIndex: 999,
    }}><div style={{position:"fixed",top:0,left:0,width:"15%",height:"100%",backgroundColor:"rgb(255, 255, 255)",zIndex:1000}}>
      <AvatarMenuPopup setIsAvatarMenuOpen={setIsAvatarMenuOpen}></AvatarMenuPopup></div></div>}


<Box sx={{ flexGrow: 1 }}>
  <AppBar position="static" sx={{color:"white",backgroundColor:"#1A1A1A",margin:1}}>
    <Toolbar>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={()=>{setIsSideMenuOpen(true)}}
      >
        <MenuIcon />
      </IconButton>
      <Typography
              variant="h4"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                color: "#E44F26",
                cursor: "pointer",  // Move cursor property inside sx
                '&:hover': { color: "#FF7043" } // Proper hover effect
              }}
              onClick={() => navigate("/")}
            >
              FitTrack
            </Typography>
     
      <Avatar sx={{ bgcolor: orange[500]}} onClick={()=>{setIsAvatarMenuOpen(true)}}> { userInitial}</Avatar>
    </Toolbar>
  </AppBar>
</Box>
</>
);
}
}