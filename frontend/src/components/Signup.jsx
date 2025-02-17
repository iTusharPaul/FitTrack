import { Card, Typography, TextField, Button, Box, useMediaQuery,Select,MenuItem,InputLabel,FormControl, Alert} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/user";
import { useState } from "react";
import { BASE_URL } from "../config";
import { useTheme } from "@mui/material/styles";
import { useActionState } from "react";

function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [gender, setGender] = useState("");
    const [error, setError] = useState("");
    const [isSignedOut,setIsSignedOut]=useState(false);
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);

    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md")); // Checks if screen is medium or larger
    function setSignedout(){
        setIsSignedOut(true);
    }

    function setSignedIn(){
        setIsSignedOut(false);
    }

    return (
        <>
        {isSignedOut && <Alert severity="warning">User Already Exists</Alert>}
        <Box
            sx={{
                width: "100vw",
                minHeight: "100vh",
                display: "flex",
                justifyContent: isLargeScreen ? "flex-end" : "center",
                alignItems: "center",
                backgroundImage: isLargeScreen
                    ? "url(https://img.freepik.com/premium-photo/stylish-male-silhouette-highlighted-by-neon-glow_1259441-1093.jpg?w=360)"
                    : "url(https://img.freepik.com/premium-photo/stylish-male-silhouette-highlighted-by-neon-glow_1259441-1093.jpg?w=720)",
                backgroundSize: isLargeScreen ? "30%" : "cover",
                backgroundPosition: isLargeScreen ? "left" : "center",
                backgroundRepeat: "no-repeat",
                padding: "10px",
            }}
        >
            <Card
                sx={{
                    padding: 4,
                    width: { xs: "90%", sm: "400px" },
                    backgroundColor: "#121212",
                    boxShadow: "0 4px 10px rgba(228, 79, 38, 0.5)",
                    borderRadius: 2,
                    color: "white",
                    textAlign: "center",
                    marginRight: isLargeScreen ? "5%" : "0", // Moves the card slightly right on large screens
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="#E44F26"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.5rem", md: "1.8rem" } }}
                >
                    Start Your Fitness Journey
                </Typography>
                <Typography
                    variant="body1"
                    color="white"
                    gutterBottom
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                    Sign up to track your progress and reach your fitness goals.
                </Typography>
                <TextField
                    onChange={(e) => setUsername(e.target.value)}
                    label="Username"
                    type="email"
                    error={username !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)} // Error if not a valid email
                    helperText={
                      username !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)
                        ? "Enter a valid email address"
                        : ""
                    }
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ style: { color: "#bbb" } }}
                    InputProps={{
                        style: { color: "white", backgroundColor: "#333", borderRadius: 8 },
                    }}
                    sx={{ mt: 2 }}
                />
                <TextField
                    onChange={(e) => {
                        const value = e.target.value;
                        setPassword(value);
    
                        // Inline Validation using Regex
                        setError(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/.test(value)
                                ? "" // if  Valid password
                                : "Must have 1 uppercase, 1 lowercase, 1 special char & 8+ chars" //else error msg
                        );
                    }}
                    error={!!error}
                    helperText={error}
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ style: { color: "#bbb" } }}
                    InputProps={{
                        style: { color: "white", backgroundColor: "#333", borderRadius: 8 },
                    }}
                    sx={{ mt: 2 }}
                />
                <TextField
                    onChange={(e) => setHeight(e.target.value)}
                    label="Height(cms)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ style: { color: "#bbb" } }}
                    InputProps={{
                        style: { color: "white", backgroundColor: "#333", borderRadius: 8 },
                    }}
                    sx={{ mt: 2 }}
                />
                <TextField
                    onChange={(e) => setWeight(e.target.value)}
                    label="Weight(kgs)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ style: { color: "#bbb" } }}
                    InputProps={{
                        style: { color: "white", backgroundColor: "#333", borderRadius: 8 },
                    }}
                    sx={{ mt: 2 }}
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
  <InputLabel sx={{ color: "#bbb" }}>Gender</InputLabel>
  <Select
    value={gender}
    onChange={(e) => setGender(e.target.value)}
    label="Gender" // Ensure label is provided here
    variant="outlined"
    sx={{
      color: "E44F26",
      backgroundColor: "#333",
      borderRadius: 1,
      ".MuiOutlinedInput-notchedOutline": { borderColor: "#bbb" }, // Border color
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" }, // Hover effect
    }}
  >
    <MenuItem value="Male">Male</MenuItem>
    <MenuItem value="Female">Female</MenuItem>
    <MenuItem value="Other">Other</MenuItem>
  </Select>
</FormControl>


                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        mt: 3,
                        backgroundColor: "#E44F26",
                        color: "white",
                        borderRadius: 8,
                        fontWeight: "bold",
                        fontSize: { xs: "1rem", md: "1.2rem" },
                        padding: { xs: "10px", md: "12px" },
                        "&:hover": { backgroundColor: "#FF7043" },
                    }}
                    onClick={async () => {
                        try {
                            const response = await axios.post(`${BASE_URL}/user/signup`, {
                                username: username,
                                password: password,
                                height:Number(height),
                                weight:Number(weight),
                                gender:gender
                            });
                            const token = response.data.token;
                            localStorage.setItem("token", token);
                            setUser({ isLoading: false, userEmail: username });
                            setIsSignedOut(false);
                            navigate("/");
                        } catch (error) {
                            if (error.response && error.response.status === 403) {
                                setIsSignedOut(true);
                            } else {
                                console.error("Signin error:", error);
                            }
                        }
                    }}
                >
                    Sign Up
                </Button>
            </Card>
        </Box>
   </> );
}

export default Signup;
