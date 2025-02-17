import { Typography, TextField, Button } from '@mui/material';
import Card from '@mui/material/Card';
import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/userEmail";
import { isUserLoading } from "../store/selectors/isUserLoading";
import { useEffect } from 'react';


function Dailylog() {
  const navigate = useNavigate();
  const [waterIntake, setWaterIntake] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const userEmail = useRecoilValue(userEmailState);
  const UserLoading = useRecoilValue(isUserLoading);
 

  useEffect(()=>{
    if (UserLoading || !userEmail) {
      navigate("/");
    }
  }, [UserLoading, userEmail, navigate])

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${BASE_URL}/user/logHabit`,
        { waterIntake, sleep, stepCount, workoutDuration },
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
      alert("Habit logged successfully");
    } catch (error) {
      alert("Error logging habits.", error.message);
    }
  };

  return (
    <div className="daily-log-container">
      {/* Background Image */}
      <div className="image-container" />

      {/* Form Card */}
      <Card variant="outlined" className="card-container">
        <Typography variant="h5" className="card-title">
          Log Your Progress and Keep the Streak Alive!
        </Typography>

        <div className="input-container">
          {[
            { label: "Water Intake (ml)", state: setWaterIntake },
            { label: "Sleep Duration (hrs)", state: setSleep },
            { label: "Step Count", state: setStepCount },
            { label: "Workout Duration (mins)", state: setWorkoutDuration }
          ].map(({ label, state }) => (
            <div key={label} className="input-row">
              <Typography variant="body1" className="input-label">
                {label}
              </Typography>
              <TextField
                label={label}
                type="number"
                fullWidth
                variant="outlined"
                className="input-field"
                InputLabelProps={{ style: { color: "white" } }}
                onChange={(e) => state(e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="button-container">
          <Button variant="contained" className="submit-btn" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outlined" className="cancel-btn" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </div>
      </Card>

      {/* Styles */}
      <style>
        {`
          .daily-log-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            width: 100vw;
            background: black;
            box-sizing: border-box;
            overflow: hidden;
            padding: 20px;
          }

          .image-container {
            width: 100%;
            height: 40vh;
            background: url(https://img.freepik.com/free-photo/athletic-boxer-punching-with-determination_158595-4870.jpg?t=st=1739037478~exp=1739041078~hmac=53ce8f990ed8532707dc63957f953476797f20509308812525803a3b8b1b4246&w=996) 
              no-repeat center center;
            background-size: cover;
          }

          .card-container {
            width: 90%;
            max-width: 400px;
            padding: 30px;
            border-radius: 15px;
            background-color: #222;
            color: white;
            box-shadow: 0 0 15px rgba(228, 79, 38, 0.7);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-top: -30px; /* Slight overlap effect */
          }

          .card-title {
            text-align: center;
            align-self: center;
            margin-bottom: 25px;
            font-weight: bold;
            color: #E44F26;
          }

          .input-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 100%;
          }

          .input-row {
            display: flex;
            flex-direction: column;
            width: 100%;
          }

          .input-label {
            font-weight: bold;
            color: #E44F26;
            margin-bottom: 5px;
          }

          .input-field {
            background-color: #333;
            border-radius: 8px;
            color: white;
          }

          .button-container {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            width: 100%;
          }

          .submit-btn {
            width: 48%;
            background-color: #E44F26;
            color: white;
            font-weight: bold;
          }

          .cancel-btn {
            width: 48%;
            border-color: #E44F26;
            color: #E44F26;
            font-weight: bold;
          }

          @media (min-width: 768px) {
            .daily-log-container {
              flex-direction: row;
            }

            .image-container {
              width: 50%;
              height: 100vh;
            }

            .card-container {
              width: 50%;
              margin-top: 0;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Dailylog;
