import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { BASE_URL } from "../../config";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
    },
  },
});

export default function WaterIntakeReport() {
    const [weeklyWaterIntakeData,setWeeklyWaterIntakeData] = useState([]);
    useEffect(()=>{
      const fetchWeeklyHabit = async()=>{
        const response = await axios.get(`${BASE_URL}/user/weeklyHabit/waterIntake`,{
          headers:{
            Authorization: "Bearer "+ localStorage.getItem("token")
          }
        });

        setWeeklyWaterIntakeData(response.data);

      }
    
      fetchWeeklyHabit();
    },[])

  const days = weeklyWaterIntakeData.map((data) => data.day);
  const waterIntakeValues = weeklyWaterIntakeData.map((data) => data.waterIntake);

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper elevation={3} sx={{ padding: 3, backgroundColor: "background.paper" }}>
        <LineChart
          xAxis={[
            {
              data: days,
              label: "Days of the Week",
              scaleType: "band",
            },
          ]}
          series={[
            {
              data: waterIntakeValues,
              label: "Water Intake (ml)",
              color: "#90caf9",
            },
          ]}
          width={800}
          height={400}
        />
      </Paper>
    </ThemeProvider>
  );
}
