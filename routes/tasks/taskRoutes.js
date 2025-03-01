const express=require('express');


const {getTasks,createTask,updateTask,deleteTask,getTasksById}=require('../../controllers/tasks/taksController');

const router=express.Router();


router.get("/",getTasks);
router.get("/:id",getTasksById);
router.post("/",createTask);
router.put("/:id",updateTask);
router.delete("/:id",deleteTask);

module.exports=router;
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: List of tasks
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Add a new task
 *     parameters:
 *       - in: body
 *         name: task
 *         description: Task data
 *         schema:
 *           type: object
 *           required:
 *             - text
 *           properties:
 *             text:
 *               type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 */

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 */

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
