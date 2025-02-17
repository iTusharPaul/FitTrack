import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Fab, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination } from "swiper/modules";
import ExerciseLogger from "./ExerciseLogger";
import axios from "axios";
import { BASE_URL } from "../config";

export default function BackList() {
  const [BackWorkouts, setBackWorkouts] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/exercises/Back`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setBackWorkouts(response.data);
      } catch (e) {
        console.log("Back exercises could not be fetched " + e.message);
      }
    };

    fetchExercises();
  }, []);

  function openPopupHandler(workout) {
    setSelectedWorkout(workout);
  }

  function closePopupHandler() {
    setSelectedWorkout(null);
  }

  return (
    <>
      <div
        style={{
          backgroundColor: "#121212",
          padding: "20px 0",
          minHeight: "100vh",
        }}
      >
        {selectedWorkout && (
          <ExerciseLogger
            workout={selectedWorkout}
            closePopupHandler={closePopupHandler}
          />
        )}

        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination]}
          className="mySwiper"
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px 0",
          }}
        >
          {BackWorkouts &&
            BackWorkouts.map((item, index) => (
              <SwiperSlide
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  width: "300px",
                  height: "400px",
                  background: "#1E1E1E",
                  borderRadius: "15px",
                  boxShadow: "0 4px 15px rgba(228, 79, 38, 0.6)",
                  transition: "box-shadow 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(228, 79, 38, 1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(228, 79, 38, 0.6)";
                }}
              >
                <img
                  src={item.url}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "15px",
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    color: "white",
                    fontWeight: "700",
                    mt: 1,
                    textTransform: "uppercase",
                    fontFamily: "Poppins, sans-serif",
                    padding: "5px",
                  }}
                >
                  {item.name}
                </Typography>
                <Fab
                  size="small"
                  sx={{
                    mt: 1,
                    backgroundColor: "#E44F26",
                    color: "white",
                    transition: "background 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#ff5722";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#E44F26";
                  }}
                  aria-label="add"
                  onClick={() => {
                    openPopupHandler(item);
                  }}
                >
                  <AddIcon />
                </Fab>
              </SwiperSlide>
            ))}
        </Swiper>

        {/* Footer Text with White Border */}
        <Typography
          variant="h5"
          align="center"
          sx={{
            mt: 3,
            color: "#E44F26",
            fontWeight: "bold",
            textTransform: "uppercase",
            fontFamily: "Poppins, sans-serif",
            padding: "5px",
          }}
        >
          Unleash your strength—Log your back workout now!
        </Typography>
      </div>
    </>
  );
}
