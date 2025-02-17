import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Typography } from "@mui/material";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import { muscleGroupsState } from "../store/atoms/musclegroup";
import { useSetRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { BASE_URL } from "../config";

export default function LandingBanner2() {
  const navigate = useNavigate();
  const setMuscleGroup = useSetRecoilState(muscleGroupsState);
  const MuscleGroupsValue = useRecoilValue(muscleGroupsState);

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/muscleGroups`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        const muscles = response.data.muscleGroups;
        setMuscleGroup({
          isLoading: false,
          muscleGroups: muscles,
        });
      } catch (e) {
        console.log(
          "Muscle groups could not be fetched from backend, error occurred: " +
            e.message
        );
      }
    };
    fetchMuscleGroups();
  }, []);

  return (
    <div>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        autoplay={{
          delay: 3000,
          disableOnInteraction: true,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 30 },
          1024: { slidesPerView: 4, spaceBetween: 40 },
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {MuscleGroupsValue.muscleGroups &&
          !MuscleGroupsValue.isLoading &&
          MuscleGroupsValue.muscleGroups.map((muscle) => {
            return (
              <SwiperSlide
                key={muscle.name}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#121212",
                  borderRadius: 10,
                  boxShadow: "0 0 10px rgba(228, 79, 38, 0.6)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    backgroundImage: `url(${muscle.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    height: "300px",
                    width: "100%",
                    maxWidth: "350px",
                    position: "relative",
                    boxShadow: "inset 0 0 15px rgba(0,0,0,0.7)",
                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(228, 79, 38, 1)";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "inset 0 0 15px rgba(0,0,0,0.7)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <div
                    style={{
                      borderRadius: "0 0 10px 10px",
                      textAlign: "center",
                      width: "100%",
                      background: "rgba(0, 0, 0, 0.5)",
                      backdropFilter: "blur(5px)",
                      padding: "15px",
                    }}
                  >
                    <Typography variant="h4" style={{ color: "white" }}>
                      {muscle.name}
                    </Typography>
                    <Fab
                      size="small"
                      style={{
                        backgroundColor: "#E44F26",
                        color: "white",
                        transition: "background 0.3s ease-in-out, transform 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#ff5722";
                        e.currentTarget.style.transform = "scale(1.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#E44F26";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      aria-label="add"
                      onClick={() => {
                        navigate(`${muscle.name}List`);
                      }}
                    >
                      <AddIcon />
                    </Fab>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
}
