const mongoose = require('mongoose');
const express = require('express');
const {User,Admin,MuscleGroup,Exercise,ExerciseLog,HabitTracker} = require("../db");
const jwt = require("jsonwebtoken");
const {authenticateJwt, SECRET} = require("../middleware/auth")

const router = express.Router();

//login & signup routes for user:

router.post("/signup",async(req,res)=>{
    try{
    const {username, password,height,weight,gender} = req.body;
    const user = await User.findOne({username,password});
    if(user){
        res.status(403).json({msg:"Admin already exists"});
    }
    else{
        const newUser = new User({username, password,height,weight,gender});
        await newUser.save();

        const token = jwt.sign({username, role:"user"},SECRET, {expiresIn:"1h"});
        res.json({msg:"User created successfully", token});
    }
}catch(error){
    res.status(500).json({error:error.message});
}
});

router.post("/login", async(req,res)=>{
    const {username, password} = req.headers
    const user = await User.findOne({username, password});
    if(user){
        const token = jwt.sign({username,role:"user"},SECRET,{expiresIn:"1h"});
        res.json({msg:"Logged in Successfully", token});
    } 
    else{
        res.status(403).json({msg:"Invalid username or Password"});
    }
});

router.get("/me",authenticateJwt,async(req,res)=>{
    const username = req.user.username;
    const user = await User.findOne({username:username})
    const habitTargets= user.habitTargets;
    const height = user.height;
    const weight = user.weight;
    const gender =user.gender;
    const joinedOn = user.createdAt.toISOString().split("T")[0];
    res.json({username:username,habitTargets:habitTargets,height,weight,gender,joinedOn});
});



router.put("/setTargets",authenticateJwt,async(req,res)=>{
    const user= await User.findOne({username:req.user.username});
    if(!user){
        res.status(404).json({msg:"user not found"});
    }
    const userId  = user._id;
    const updatedUser = await User.findByIdAndUpdate(userId,{habitTargets:req.body}, {new:true});
    if(updatedUser){
        res.json({msg:"Targets set for the habits successfully"});
    }
    else{
        res.status(401).json({msg:"Couldnot update targets"})
    }
});

//routes for setting exercise logs and getting log for a given date:

router.post("/logExercise",authenticateJwt,async(req,res)=>{
    try{const {exerciseId, sets} = req.body;
    const user = await User.findOne({username:req.user.username});
    const userId = user._id;
    const date = new Date().toISOString().split('T')[0];
    
    const log = await ExerciseLog.findOne({userId,date});
    if(log){ // if already one exercie logged by that user on that day
        log.exercises.push({exerciseId,sets});
        await log.save();
        res.json({msg:"Exercise logged successfully"})
    }
    else{
        const newLog = new ExerciseLog({userId,date,exercises:[{exerciseId,sets}]});
        await newLog.save();
        res.json({msg:"First exercise of the day logged successfully"});
    }

}catch(error){
    res.status(500).json({msg:error.message});
}
});


router.get("/getExeriseLog",authenticateJwt,async(req,res)=>{
    try{const user = await User.findOne({username:req.user.username});
    const userId = user._id
    const {date} = req.query;
    console.log(date);
    const log = await ExerciseLog.findOne({userId,date});
    if(log){
        await log.populate("exercises.exerciseId", "name");
        res.json({logs: log.exercises});
    }
    else{
        res.json({logs:null})
    }
}catch(error){
    res.status(500).json({msg:error.message});
}
});

router.delete('/deleteSet', authenticateJwt, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const userId = user._id;
        const { date, exerciseId, index } = req.body;

        if (!date || !exerciseId || index === undefined) {
            return res.status(400).json({ msg: "Missing required fields in request body" });
        }

        const log = await ExerciseLog.findOne({ userId, date });
        if (!log) return res.status(404).json({ msg: "No log found" });

        // Find the exercise
        const exerciseIndex = log.exercises.findIndex(ex => ex.exerciseId.toString() === exerciseId);
        if (exerciseIndex === -1) return res.status(404).json({ msg: "Exercise not found" });

        // Remove the set from the exercise
        log.exercises[exerciseIndex].sets.splice(index, 1);

        // If no sets remain, remove the entire exercise
        if (log.exercises[exerciseIndex].sets.length === 0) {
            log.exercises.splice(exerciseIndex, 1);
        }

        // If no exercises remain, delete the entire log
        if (log.exercises.length === 0) {
            await ExerciseLog.deleteOne({ _id: log._id });
            return res.json({ msg: "All sets deleted, exercise log removed" });
        }

        await log.save();
        await log.populate("exercises.exerciseId", "name");

        res.json({ msg: "Set deleted successfully", log: log.exercises });
    } catch (e) {
        res.status(500).json({ msg: "Error deleting set: " + e.message });
    }
});

//routes for getting all muscle groups and all exercises for a 
// muscle group for displaying in landing page.

router.get("/muscleGroups",authenticateJwt,async(req,res)=>{
    const muscleGroups = await MuscleGroup.find();
    if(muscleGroups){
    res.json({muscleGroups});
    }else{
        res.status(404).json({msg:"No muscle group found"});
    }

});

router.get("/exercises/:muscleGroup",authenticateJwt,async(req,res)=>{
    try{
    const muscleGroup = await MuscleGroup.findOne({name:req.params.muscleGroup})
    if(!muscleGroup){
        res.status(404).json({msg:"Muscle group not found"});
    }
    const muscleGroupId = muscleGroup._id;
    const exercises = await Exercise.find({muscleGroup:muscleGroupId});
    if(!exercises){
        res.status(404).json({msg:"No Exercise found for this muscle group"});
    }else{
        res.json(exercises);
    }
}catch(e){
    res.status(500).json({msg:`Couldnot fetch exercises + ${e.error.message}`})
}
});

router.post("/logHabit",authenticateJwt,async(req,res)=>{

    try{
    const user = await User.findOne({username:req.user.username});
    const userId = user._id;
    const date = new Date().toISOString().split('T')[0];
    const {waterIntake,sleep,stepCount,workoutDuration} = req.body;

    const log = await HabitTracker.findOne({userId,date});
    if(log){ //if a log already exists then we need to add to existing values 
        

        await HabitTracker.findOneAndUpdate({userId,date},
            {$inc:
            {waterIntake,
                sleep,
                stepCount,
                workoutDuration
            }
        })
        res.json({msg:"Habit updated successfully for "+date});
    }

    else{
        const newHabitLog = new HabitTracker({userId,date,waterIntake,sleep,stepCount,workoutDuration});
        await newHabitLog.save();
        res.json({msg:"Habit logged successfully for "+date})
    }
}catch(e){
    res.status(500).json({msg:"Couldnot log habits "+e.message});
}


});

router.get("/getHabitLog/:date",authenticateJwt,async(req,res)=>{
    const user = await User.findOne({username:req.user.username});
    const userId = user.id;
    const {date} = req.params;
    const habitLog = await HabitTracker.findOne({userId,date});
    if(habitLog){
        res.json({habitLog})
    }
    else{
        res.status(404).json({msg:"No habit log found for the day"})
    }

});

router.get("/weeklyHabit/:habit", authenticateJwt, async (req, res) => {
    const habit = req.params.habit;
    const user = await User.findOne({username:req.user.username});
    const userId = user._id 
    
  
    if (!(habit === "sleep" || habit === "waterIntake" || habit === "stepCount" || habit === "workoutDuration")) {
      return res.status(400).json({ msg: "Invalid habit" });
    }
  
    try {
      // Use UTC-based date calculations
      const now = new Date();
      const currentDay = now.getUTCDay(); // 0 (Sun) to 6 (Sat) in UTC
      // If Sunday (0), treat it as 7 to calculate Monday correctly
      const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
      const monday = new Date(now);
      monday.setUTCDate(now.getUTCDate() - diffToMonday);
      monday.setUTCHours(0, 0, 0, 0);
  
      const sunday = new Date(monday);
      sunday.setUTCDate(monday.getUTCDate() + 6);
      sunday.setUTCHours(23, 59, 59, 999);
  
      // Fetch habit logs between monday and sunday (UTC)
      const habitData = await HabitTracker.find({
        userId: userId,
        date: { $gte: monday, $lte: sunday }
      }).sort({ date: 1 });

      
  
      const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
      const weeklyData = weekDays.map((day, index) => {
        // Calculate the date for the current index using UTC
        const currentDate = new Date(monday);
        currentDate.setUTCDate(monday.getUTCDate() + index);
        
  
        // Compare using the YYYY-MM-DD part in UTC
        const currentDateStr = currentDate.toISOString().split("T")[0];
        const log = habitData.find(entry => {
          const entryDateStr = new Date(entry.date).toISOString().split("T")[0];
          return entryDateStr === currentDateStr;
        });
        
  
        return {
          day,
          [habit]: log ? log[habit] : 0
        };
      });
  
      res.json(weeklyData);
      console.log(weeklyData);
    } catch (error) {
      res.status(500).json({ msg: "Error fetching weekly habit data: " + error.message });
    }
  });
  
module.exports = router