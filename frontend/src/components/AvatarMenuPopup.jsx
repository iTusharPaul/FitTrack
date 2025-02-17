import { Button, Typography, Box, Divider } from "@mui/material";
import { FaRegWindowClose } from "react-icons/fa";
import { MdPerson, MdLogout } from "react-icons/md";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/user";
import { useNavigate } from "react-router-dom";

export default function AvatarMenuPopup({ setIsAvatarMenuOpen }) {
    const user = useRecoilValue(userState);
    const username = user.userEmail;
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);

    return (
        <Box
            sx={{
                width: "250px",
                height: "100vh",
                backgroundColor: "#121212", // Dark theme background
                color: "white",
                boxShadow: "4px 0 10px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                padding: 2,
            }}
        >
            {/* Header Section */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="#E44F26">
                    {username ? `Hello, ${username.split("@")[0]}` : "Hello, Sign In"}
                </Typography>
                <Button size="small" color="error" onClick={() => setIsAvatarMenuOpen(false)}>
                    <FaRegWindowClose size={22} />
                </Button>
            </Box>

            <Divider sx={{ backgroundColor: "#333", mb: 2 }} />

            {/* Profile Button */}
            <Button
                variant="contained"
                fullWidth
                sx={menuButtonStyles}
                startIcon={<MdPerson />}
                onClick={() => {
                    navigate("/profile");
                    setIsAvatarMenuOpen(false);
                }}
            >
                Profile
            </Button>

            {/* Logout Button */}
            <Button
                variant="contained"
                fullWidth
                sx={logoutButtonStyles}
                startIcon={<MdLogout />}
                onClick={() => {
                    localStorage.setItem("token", null);
                    setUser({ isLoading: false, userEmail: null });
                    setIsAvatarMenuOpen(false);
                }}
            >
                Logout
            </Button>
        </Box>
    );
}

/* Styles for buttons */
const menuButtonStyles = {
    mt: 1.5,
    backgroundColor: "#E44F26",
    color: "white",
    fontWeight: "bold",
    borderRadius: 8,
    "&:hover": { backgroundColor: "#FF7043" },
};

const logoutButtonStyles = {
    mt: 1.5,
    backgroundColor: "#d32f2f",
    color: "white",
    fontWeight: "bold",
    borderRadius: 8,
    "&:hover": { backgroundColor: "#b71c1c" },
};
