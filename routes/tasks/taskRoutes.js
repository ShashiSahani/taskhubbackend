const express=require('express');


const {getTasks,createTask,updateTask,deleteTask,getTasksById}=require('../../controllers/tasks/taksController');

const router=express.Router();


router.get("/",getTasks);
router.get("/:id",getTasksById);
router.post("/",createTask);
router.put("/:id",updateTask);
router.delete("/:id",deleteTask);



/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Fetch all tasks from the database.
 *     responses:
 *       200:
 *         description: Successfully fetched tasks.
 */
router.get("/", getTasks);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Add a new task
 *     description: Creates a new task with the provided text.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Learn Swagger"
 *     responses:
 *       201:
 *         description: Task added successfully.
 */
router.post("/", addTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Modify an existing task.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Updated Task"
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Task updated successfully.
 */
router.put("/:id", updateTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Removes a task by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 */
router.delete("/:id", deleteTask);

module.exports = router;
