import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Typography, Card, Box,Button } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../config';
import { useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/userEmail";
import { isUserLoading } from "../store/selectors/isUserLoading";
import { Navigate, useNavigate } from 'react-router-dom';
export default function WorkoutProgress() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [exercises, setExercises] = useState([]);
  const userEmail = useRecoilValue(userEmailState);
  const UserLoading = useRecoilValue(isUserLoading);
  const navigate = useNavigate();

  useEffect(()=>{
    if (UserLoading || !userEmail) {
      navigate("/");
    }
  }, [UserLoading, userEmail, navigate])

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user/getExeriseLog?date=${selectedDate.toISOString().split('T')[0]}`,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );

        setExercises(response.data.logs);
      } catch (e) {
        console.log('Error fetching logs:', e.message);
      }
    };

    fetchLog();
  }, [selectedDate]);

  return (<>
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e1e1e',
        color: 'white',
        minHeight: '100vh',
        padding: 2,
      }}
    >
      <Card
        sx={{
          backgroundColor: '#2c2c2c',
          padding: 3,
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(228, 79, 38, 0.3)',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          marginBottom: { xs: 3, md: 0 },
        }}
      >
        <Typography variant="h6" color="#E44F26" gutterBottom>
          Choose a date to view your exercise logs
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker value={selectedDate} onChange={setSelectedDate} />
        </LocalizationProvider>
      </Card>

      <Card
        sx={{
          backgroundColor: '#2c2c2c',
          padding: 3,
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(228, 79, 38, 0.3)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          marginLeft: { md: 3 },
        }}
      >
        <Typography variant="h6" color="#E44F26" gutterBottom>
          Exercises Logged on {selectedDate.format('YYYY-MM-DD')}
        </Typography>
        {exercises && exercises.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {exercises.map((exercise, index) => (
              <li key={index} style={{ padding: 10, borderBottom: '1px solid gray' }}>
                <Typography variant="h6" color="#E44F26">
                  {exercise.exerciseId.name}
                </Typography>
                {exercise.sets.map((set, setIndex) => (
                  <Typography key={setIndex} variant="body1" color="white">
                    Set {setIndex + 1}: {set.reps} reps x {set.weight} kg
                    <Button onClick={async ()=>{
                      const response = await axios.delete(`${BASE_URL}/user/deleteSet`,{
                        headers:{
                          Authorization:"Bearer "+ localStorage.getItem("token")
                        },
                        data:{
                            date:selectedDate.toISOString().split('T')[0],
                            exerciseId:exercise.exerciseId._id,
                            index:setIndex
                        }
                      });
                      setExercises(response.data.log);
                      alert(response.data.msg)
                    }}>Delete</Button>
                  </Typography>
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant="body1" color="gray">
            No exercises logged on this date
          </Typography>
        )}
      </Card>
    </Box>
    </> );
}
