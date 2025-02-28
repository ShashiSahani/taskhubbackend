const Task = require("../../models/tasks/taskModels");
const mongoose = require("mongoose");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { text } = req.body;
    const newTask = new Task({ text });
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateTask=async(req,res)=>{
    try {
        const {id }=req.params;
        const {text,completed}=req.body;
        const updatedTask=await Task.findByIdAndUpdate(id,{text,completed},{new:true})
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}


exports.deleteTask=async(req,res)=>{
    try {
        const {id}=req.params;
        await Task.findByIdAndDelete(id);
        res.json({message:"Task deleted"});
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


exports.getTasksById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received ID:", id); 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Invalid ObjectId format");
            return res.status(400).json({ message: "Invalid task ID format" });
        }

        const task = await Task.findById(id);
        if (!task) {
            console.log("Task not found in database");
            return res.status(404).json({ message: "Task not found" });
        }

        console.log("Task found:", task);
        res.status(200).json(task);
    } catch (error) {
        console.error("Error fetching task by ID:", error.stack); 
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
