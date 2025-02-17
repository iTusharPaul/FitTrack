import { Card, Typography, TextField, Button, Box, useMediaQuery } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/user";
import { useState } from "react";
import { BASE_URL } from "../config";
import { useTheme } from "@mui/material/styles";
import Alert from '@mui/material/Alert';

function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSignedOut, setIsSignedOut] = useState(false);
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

    return (<>
      
        {isSignedOut && <Alert severity="error">Wrong Username Or Password</Alert>}

        <Box
            sx={{
                width: "100vw",
                minHeight: "100vh",
                display: "flex",
                justifyContent: isLargeScreen ? "flex-end" : "center",
                alignItems: "center",
                backgroundImage: "url(https://img.freepik.com/free-photo/muscular-man-doing-weightlifting-fitness-center_1163-3551.jpg?t=st=1738952491~exp=1738956091~hmac=3d4fb38ca503a8befd9d50722e5e6e1343c325d9b85d742c96d482c06e79bed6&w=360)",
                backgroundSize: isLargeScreen ? "30%" : "contain%", // Zoomed out for mobile
                backgroundPosition: isLargeScreen ? "left" : "center",
                backgroundRepeat: "no-repeat",
                backdropFilter: "blur(5px)", // Adds a subtle blur effect
                padding: "10px",
            }}
        >
            <Card
                sx={{
                    padding: 4,
                    width: { xs: "90%", sm: "400px" },
                    backgroundColor: "rgba(18, 18, 18, 0.9)", // Slight transparency
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
                    Welcome Back
                </Typography>
                <Typography
                    variant="body1"
                    color="white"
                    gutterBottom
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                    Sign in to continue your fitness journey.
                </Typography>
                <TextField
                    onChange={(e) => setUsername(e.target.value)}
                    label="Username"
                    variant="outlined"
                    fullWidth
                    error={username !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)} // Error if not a valid email
                    helperText={
                      username !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)
                        ? "Enter a valid email address"
                        : ""
                    }
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
                            const response = await axios.post(`${BASE_URL}/user/login`, {}, {
                                headers: {
                                    username: username,
                                    password: password,
                                },
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
                    Sign In
                </Button>
            </Card>
        </Box>
    </>);
}

export default Signin;
