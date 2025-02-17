import { useEffect, useState } from "react";
import { Typography, Card, Box, CircularProgress, Divider, Chip } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../config"; 
import { useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/userEmail";
import { isUserLoading } from "../store/selectors/isUserLoading";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userEmail = useRecoilValue(userEmailState);
  const UserLoading = useRecoilValue(isUserLoading);
  const navigate = useNavigate();
 

  useEffect(()=>{
    if (UserLoading || !userEmail) {
      navigate("/");
    }
  }, [UserLoading, userEmail, navigate])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/me`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        setUser(response.data);
      } catch (e) {
        console.error("Error fetching user data:", e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const calculateBMI = () => {
    if (user?.weight && user?.height) {
      return (user.weight / (user.height / 100) ** 2);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return { label: "N/A", color: "gray" };
    if (bmi < 18.5) return { label: "Underweight", color: "blue" };
    if (bmi < 24.9) return { label: "Normal", color: "green" };
    if (bmi < 29.9) return { label: "Overweight", color: "orange" };
    return { label: "Obese", color: "red" };
  };

  const bmiValue = calculateBMI();
  const bmiCategory = getBMICategory(bmiValue);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#1e1e1e",
        p: 3,
      }}
    >
      <Card
        sx={{
          backgroundColor: "#2c2c2c",
          p: 4,
          borderRadius: "12px",
          textAlign: "center",
          width: "90%",
          maxWidth: 400,
          boxShadow: "0px 4px 10px rgba(228, 79, 38, 0.3)",
        }}
      >
        <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
          Profile
        </Typography>

        {loading ? (
          <CircularProgress sx={{ color: "#E44F26", mt: 3 }} />
        ) : user ? (
          <>
            <Typography variant="h6" sx={{ mt: 2, color: "white", fontWeight: "bold" }}>
              {user.username}
            </Typography>
            <Divider sx={{ my: 2, backgroundColor: "#444" }} />

            <Typography variant="body1" sx={{ color: "white" }}>
              <strong>Gender:</strong> {user.gender || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "white" }}>
              <strong>Weight:</strong> {user.weight ? `${user.weight} kg` : "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "white" }}>
              <strong>Height:</strong> {user.height ? `${user.height} cm` : "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "white" }}>
              <strong>BMI:</strong> {bmiValue || "N/A"}
            </Typography>
            
            {/* BMI Category with Color Coding */}
            <Chip
              label={bmiCategory.label}
              sx={{
                backgroundColor: bmiCategory.color,
                color: "white",
                mt: 1,
                fontWeight: "bold",
              }}
            />

            <Divider sx={{ my: 2, backgroundColor: "#444" }} />
            <Typography variant="body2" sx={{ color: "gray" }}>
              Joined: {user.joinedOn ? new Date(user.joinedOn).toLocaleDateString() : "N/A"}
            </Typography>
          </>
        ) : (
          <Typography sx={{ color: "red", mt: 2 }}>Error loading profile</Typography>
        )}
      </Card>
    </Box>
  );
}
