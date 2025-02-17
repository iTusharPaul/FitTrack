import { Button, Typography, Card } from "@mui/material";
import CircularProgress from "@mui/joy/CircularProgress";
import { AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

function LandingBanner1() {
  const date = new Date().toISOString().split("T")[0];
  const [habits, setHabits] = useState({
    waterIntake: 0,
    sleep: 0,
    stepCount: 0,
    workoutDuration: 0,
  });
  const [targets, setTargets] = useState({
    waterIntake: 0,
    sleep: 0,
    stepCount: 0,
    workoutDuration: 0,
  });

  useEffect(() => {
    const fetchHabits = async () => {
      const response = await axios.get(
        `${BASE_URL}/user/getHabitLog/${date}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const habits = response.data.habitLog;
      setHabits({
        waterIntake: habits.waterIntake,
        sleep: habits.sleep,
        stepCount: habits.stepCount,
        workoutDuration: habits.workoutDuration,
      });
    };
    const fetchTargets = async () => {
      const response = await axios.get(`${BASE_URL}/user/me`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const targets = response.data.habitTargets;
      console.log(targets);
      setTargets({
        waterIntake: targets.waterIntake,
        sleep: targets.sleep,
        stepCount: targets.stepCount,
        workoutDuration: targets.workoutDuration,
      });
    };
    fetchHabits();
    fetchTargets();
  }, []);

  const data = [
    {
      type: "waterIntake",
      current: habits.waterIntake,
      target: targets.waterIntake,
      unit: "ml",
    },
    {
      type: "sleep",
      current: habits.sleep,
      target: targets.sleep,
      unit: "hrs",
    },
    {
      type: "stepCount",
      current: habits.stepCount,
      target: targets.stepCount,
      unit: "steps",
    },
    {
      type: "workoutDuration",
      current: habits.workoutDuration,
      target: targets.workoutDuration,
      unit: "mins",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {data.map((item) => {
        return <GoalCard key={item.type} item={item} />;
      })}
    </div>
  );
}

function GoalCard({ item }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card
        style={{
          margin: 10,
          width: 300,
          minHeight: 200,
          alignContent: "center",
          borderRadius: 20,
          padding: 10,
          background: "#121212",
          boxShadow: "0 0 10px rgba(228, 79, 38, 0.6)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" style={{ color: "#E44F26" }}>
            {item.type}
          </Typography>
          <Typography variant="h5" style={{ color: "white" }}>
            {item.current}/{item.target} {item.unit}
          </Typography>
          <CircularProgress
            color="primary"
            determinate
            size="lg"
            variant="solid"
            value={(item.current<=item.target)?(item.current / item.target) * 100:100}
          >
            {(item.current<=item.target)?parseInt((item.current / item.target) * 100):100}%
          </CircularProgress>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              navigate(`/${item.type}Report`);
            }}
            style={{
              marginTop: 10,
              backgroundColor: "#E44F26",
              color: "white",
            }}
          >
            Show report <AiOutlineEye />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default LandingBanner1;
