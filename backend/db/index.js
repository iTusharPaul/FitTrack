const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type:String, required:true},
    password: {type:String, required:true},
    createdAt: {type:Date, default:Date.now},
    habitTargets:{
        waterIntake: {type:Number, default:2000},//in ml
        sleep:{type:Number, default:8 }, //in hrs
        stepCount:{type:Number, default:10000}, // no.of steps
        workoutDuration:{type:Number, default:60} //mins
    },
    height:{type:Number,required:true},
    weight:{type:Number,required:true},
    gender: { 
        type: String, 
        enum: ["Male", "Female", "Other"], // Restrict values
        required: true 
      }
});

const adminSchema = new mongoose.Schema({
    username: {type:String, required:true},
    password:{type:String,required:true},
    createdAt:{type:Date, default:Date.now}
});

const muscleGroupSchema = new mongoose.Schema({
    name:{type:String, required:true},
    url:{type:String, required:true}
});

const exerciseSchema = new mongoose.Schema({
    muscleGroup: {type:mongoose.Schema.Types.ObjectId, ref:"MuscleGroup", required:true},
    name:{type:String, required:true},
    url:{type:String, required:false}
});

const exerciseLogSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    date:{type:Date, required:true},
    exercises:[
        {
            exerciseId: {type: mongoose.Schema.Types.ObjectId, ref:"Exercise", required:true},
            sets:[
                {
                reps:{type:Number, required:true},
                weight:{type:Number, required:true}
                }
            ]
        }
    ]
});

const habitTrackerSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    date:{type:Date, required:true},
    waterIntake: {type:Number, default:0},
    sleep: {type:Number, default:0},
    stepCount: {type:Number, default:0},
    workoutDuration: {type:Number, default:0},

});

const User = mongoose.model("User",userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const MuscleGroup = mongoose.model("MuscleGroup", muscleGroupSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);
const ExerciseLog = mongoose.model("ExerciseLog", exerciseLogSchema);
const HabitTracker = mongoose.model("HabitTracker", habitTrackerSchema);

module.exports = {User,Admin,MuscleGroup,Exercise,ExerciseLog,HabitTracker};