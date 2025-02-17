import React, { useState } from "react";
import { Button, Card, Typography, TextField } from "@mui/material";
import { BASE_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/userEmail";
import { isUserLoading } from "../store/selectors/isUserLoading";

export default function ExerciseLogger({ workout, closePopupHandler }) {
  const [set1, setSet1] = useState({ reps: 0, weight: 0 });
  const [set2, setSet2] = useState({ reps: 0, weight: 0 });
  const [set3, setSet3] = useState({ reps: 0, weight: 0 });
  const userEmail = useRecoilValue(userEmailState);
  const UserLoading = useRecoilValue(isUserLoading);
  const navigate = useNavigate();

  useEffect(()=>{
    if (UserLoading || !userEmail) {
      navigate("/");
    }
  }, [UserLoading, userEmail, navigate])

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <Card
        style={{
          width: "400px",
          padding: "20px",
          backgroundColor: "#1e1e1e",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(228, 79, 38, 0.3)",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Typography variant="h5" style={{ color: "#E44F26" }} gutterBottom>
          {workout.name}
        </Typography>
        <Typography variant="body1" color="gray" gutterBottom>
          Log your progress for this workout below
        </Typography>

        <SetLogger setNumber={1} setSet={setSet1} />
        <SetLogger setNumber={2} setSet={setSet2} />
        <SetLogger setNumber={3} setSet={setSet3} />

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#E44F26", color: "white" }}
            onClick={async () => {
              try {
                const response = await axios.post(`${BASE_URL}/user/logExercise`, {
                  exerciseId: workout._id,
                  sets: [set1, set2, set3],
                }, {
                  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
                });
                alert(response.data.msg);
              } catch (e) {
                alert("Error logging workout: " + e.message);
              }
              closePopupHandler();
            }}
          >
            Log Workout
          </Button>
          <Button
            variant="outlined"
            style={{ color: "#E44F26", borderColor: "#E44F26" }}
            onClick={closePopupHandler}
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}

function SetLogger({ setNumber, setSet }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "10px" }}>
      <Typography variant="h6" style={{ color: "#E44F26", marginRight: "10px" }}>
        Set{setNumber}
      </Typography>
      <TextField
        onChange={(e) => setSet((prev) => ({ ...prev, weight: e.target.value }))}
        variant="outlined"
        label="Weight"
        type="number"
        InputLabelProps={{ style: { color: "white" } }}
        InputProps={{ style: { color: "white", borderColor: "#E44F26" } }}
        style={{ marginRight: "10px" }}
      />
      <TextField
        onChange={(e) => setSet((prev) => ({ ...prev, reps: e.target.value }))}
        variant="outlined"
        label="Reps"
        type="number"
        InputLabelProps={{ style: { color: "white" } }}
        InputProps={{ style: { color: "white", borderColor: "#E44F26" } }}
      />
    </div>
  );
}
