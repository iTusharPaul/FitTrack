import { Button, Typography, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/userEmail";
import { isUserLoading } from "../store/selectors/isUserLoading";
import LandingBanner1 from "./LandingBanner1";
import LandingBanner2 from "./LandingBanner2";

function Landing() {
    const navigate = useNavigate();
    const userEmail = useRecoilValue(userEmailState);
    const UserLoading = useRecoilValue(isUserLoading);

    if (UserLoading || !userEmail) {
        return (
            <Container
                maxWidth={false}
                disableGutters
                sx={{
                    width: "100vw",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#00ADB5",
                    backgroundImage: "url('https://i.pinimg.com/736x/eb/4c/ef/eb4cefe0c24c3e3010394ae4bfd3c9b8.jpg')",
                    backgroundSize: { xs: "contain", md: "40%" },
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    overflow: "hidden",
                    fontFamily: "Poppins, sans-serif",
                    padding: 2,
                }}
            >
                <Grid container spacing={4} alignItems="center" justifyContent="center">
                    <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                            <Typography
                                variant="h2"
                                fontWeight="bold"
                                color="#E44F26"
                                sx={{ fontSize: { xs: "2rem", md: "3rem" }, marginRight: 1 }}
                            >
                                Welcome
                            </Typography>
                            <Typography
                                variant="h2"
                                fontWeight="bold"
                                color="#dddddd"
                                sx={{ fontSize: { xs: "2rem", md: "3rem" }, marginRight: 1 }}
                            >
                                to
                            </Typography>
                            <Typography
                                variant="h2"
                                fontWeight="bold"
                                color="#E44F26"
                                sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
                            >
                                FitTrack
                            </Typography>
                        </div>
                        <Typography variant="h6" sx={{ mt: 2, color: "white", fontSize: { xs: "1rem", md: "1.5rem" } }}>
                            Track your fitness goals and progress
                        </Typography>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                marginTop: 16,
                            }}
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    width: { xs: "80%", md: "auto" },
                                    backgroundColor: "#E44F26",
                                    "&:hover": { backgroundColor: "white", color: "#D4A48A" },
                                    fontSize: { xs: "1rem", md: "1.2rem" },
                                }}
                                onClick={() => navigate("/signup")}
                            >
                                Signup
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    mt: 2,
                                    width: { xs: "80%", md: "auto" },
                                    color: "#E44F26",
                                    borderColor: "#E44F26",
                                    "&:hover": { borderColor: "#D4A48A", color: "white" },
                                    fontSize: { xs: "1rem", md: "1.2rem" },
                                }}
                                onClick={() => navigate("/signin")}
                            >
                                Signin
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: "#121212",
                minHeight: "100vh",
                color: "#00ADB5",
                backgroundImage:
                    "url('https://img.freepik.com/free-photo/old-painted-textured-surface-backdrop_114579-40052.jpg?t=st=1739011626~exp=1739015226~hmac=956efe9bacc344fc68bb3eab7121c2238ff742110ac14fba54267f577592eda0&w=996')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                fontFamily: "Poppins, sans-serif",
                padding: "1rem",
            }}
        >
            <LandingBanner1 />
            <Typography
  variant="h2"
  align="center"
  sx={{
    mt: 5,
    fontWeight: "bold",
    fontSize: { xs: "2rem", md: "3rem" },
    textTransform: "uppercase",
    background: "linear-gradient(90deg, #C0392B, #E44F26)", // Deeper red-orange tones
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent", // Keeps the gradient effect
    textShadow: "2px 2px 8px rgba(255, 100, 50, 0.6)", // Stronger orange glow
    letterSpacing: "2px",
    padding: "10px",
  }}
>
  WORKOUTS
</Typography>


            <LandingBanner2 />
        </div>
    );
}

export default Landing;
