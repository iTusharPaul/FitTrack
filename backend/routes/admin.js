const mongoose = require('mongoose');
const express = require('express');
const {User,Admin,MuscleGroup,Exercise,ExerciseLog,HabitTracker} = require("../db");
const jwt = require("jsonwebtoken");
const {authenticateJwt, SECRET} = require("../middleware/auth")

const router = express.Router();

//routes for admin auth:

router.post('/signup', async (req,res)=>{
    const {username, password} = req.body;
    const admin = await Admin.findOne({username});
     if(admin){
        res.statusCode(403).json({msg:"Admin Already exists"});
     }
     else{
        const obj ={username, password};
        const newAdmin = new Admin(obj);
        newAdmin.save();

        const token = jwt.sign({username, role:"admin"}, SECRET, {expiresIn:"1h"});
        res.json({msg:"Admin created successfully. ",
            token:token});
     }
});

router.post("/login", async(req,res)=>{
    const {username, password} = req.headers;
    const admin = await Admin.findOne({username,password});
    if(admin){
        const token = jwt.sign({username, role:"admin"}, SECRET,{expiresIn:"1h"});
        res.json({msg:"Logged in successfully", token:token})
    }
    else{
        res.status(403).json({msg:"Invalid username or password"});
    }
});

//routes for muscle group :

router.post("/addMuscleGroup",authenticateJwt,async(req,res)=>{
    const muscleGroup = new MuscleGroup(req.body);
    await muscleGroup.save();
    res.json({msg:"Muscle Group added successfully"});
});

router.get("/muscleGroups",authenticateJwt,async(req,res)=>{
    const muscleGroups = await MuscleGroup.find({});
    if(muscleGroups){
    res.json({muscleGroups});
    }
    else{
        res.status(404).json({msg:"no muscle group found"});
    }
});

router.get("/muscleGroups/:muscleGroupId", authenticateJwt, async (req,res)=>{
    const muscleGroup = await MuscleGroup.findOne({_id:req.params.muscleGroupId});
    if(muscleGroup){
    res.json({muscleGroup});
    }
    else{
        res.status(404).json({msg:"Muscle group not found"});
    }
});

router.put("/muscleGroup/:muscleGroupId", authenticateJwt, async(req,res)=>{
    const muscleGroup = await MuscleGroup.findByIdAndUpdate(req.params.muscleGroupId,req.body, {new:true});
    if(muscleGroup){
        res.json({msg:"muscle Group updated successfully"});
    }
    else{
        res.status(404).json("muscle Group not found");
    }
});



//routes for exercises
router.post("/addExercise",authenticateJwt,async (req,res)=>{
    const {muscleGroup,name,url} = req.body;
    const muscleGroupObj = await MuscleGroup.findOne({name:muscleGroup});// return the muscle obj from the collection 
    if(muscleGroup){ 
    const newExercise = new Exercise({muscleGroup:muscleGroupObj.id, name,url});
    await newExercise.save();
    res.json({msg:"Exercise added successfully", exerciseId: newExercise.id});
    }
    else{
        res.status(404).json({msg:"Muscle Group not found"})
    }
});

router.get("/exercises",authenticateJwt,async(req,res)=>{
    const exercises = await Exercise.find({});
    res.json({exercises});
});


router.get("/exercises/:exerciseId", authenticateJwt, async (req,res)=>{
    try{const exerciseId = req.params.exerciseId;
    const exercise = await Exercise.findById(exerciseId);
    res.json({exercise});
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
});

router.put("/exercises/:exerciseId",authenticateJwt,async(req,res)=>{
    const exerciseId = req.params.exerciseId;
    const exercise = await Exercise.findByIdAndUpdate(exerciseId,req.body,{new:true});
    if(exercise){
        res.json({msg:"exercise updated successfully"});
    }
    else{
        res.status(404).json({msg:"exercise not found"});
    }
});

module.exports = router