# **Express.js Task Management API**

## **Features**

- **Create tasks**
- **Read tasks**
- **Update tasks**
- **Delete tasks**
- **CORS support for cross-origin requests**

## **Prerequisites**

Ensure you have the following installed:

- **Node.js** (v14 or later)
- **MongoDB** (local or cloud-based MongoDB Atlas)

## **Installation and Setup**

### **1. Clone the Repository**

```sh
git clone <repository_url>
cd <project_directory>
```

### **2. Install Dependencies**

```sh
npm install
```

### **3. Configure Environment Variables**

Create a `.env` file in the root directory and add the following:

```env
PORT=4848
MONGO_URI=<your_mongodb_connection_string>
```

### **4. Start MongoDB (if using locally)**

Ensure MongoDB is running on your machine:

```sh
mongod
```

### **5. Run the Server**

Start the Express.js server:

```sh
npm start
```

The server will run on **[http://localhost:3000/](http://localhost:3000/)**.

## **API Endpoints**

### **1. Root Endpoint**

- **GET /**
  - Returns a welcome message.
  - Example Response:
    ```json
    {
      "message": "Hello, welcome to my API!"
    }
    ```

### **2. Task Endpoints**

- **GET /tasks** – Fetch all tasks.
- **POST /tasks** – Create a new task.
- **PUT /tasks/:id** – Update a task by ID.
- **DELETE /tasks/:id** – Delete a task by ID.

## **Technologies Used**

- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **dotenv** - Environment variable management
- **CORS** - Cross-Origin Resource Sharing support

## **How to Contribute**

1. **Fork the repository.**
2. **Create a new branch (`feature-branch`).**
3. **Commit your changes.**
4. **Push to the branch.**
5. **Open a Pull Request.**

