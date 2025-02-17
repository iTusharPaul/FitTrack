const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRouter = require("./routes/admin")
const userRouter = require("./routes/user")

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin",adminRouter)
app.use("/user", userRouter)

mongoose.connect("mongodb+srv://tusharstudy143:privacy%401234@cluster0.b9dad.mongodb.net/fitTrack",{ useNewUrlParser: true, useUnifiedTopology: true, dbName: "fitTrack" });

app.listen(3000,()=>{console.log("server running on port 3000")})


