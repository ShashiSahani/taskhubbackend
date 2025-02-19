const Task = require("../../models/tasks/taskModels");

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