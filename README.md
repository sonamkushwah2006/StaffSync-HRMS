# StaffSync HRMS

A full-stack Human Resource Management System (HRMS) built to simplify employee management through a clean, modern interface and a database-backed REST API.

## 🚀 Project Overview

StaffSync HRMS is a web application designed to manage employee information efficiently. It provides an interface for adding, viewing, and updating employee records, with data stored in MongoDB.

## ✨ Features

- **Dashboard:** Overview of employee information and HR statistics.
- **Employee Management:** Add, view, and update employee records.
- **Employee Details:** Store employee ID, name, email, department, position, employment type, status, and joining date.
- **Database Integration:** Store employee records in MongoDB Atlas.
- **REST API:** Backend endpoints for creating, retrieving, updating, and deleting employee records.
- **CSV Export:** Export employee data for reporting.
- **Responsive UI:** Modern interface built with React and Tailwind CSS.

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- TypeScript
- Mongoose

**Database**
- MongoDB Atlas

**Tools**
- Git and GitHub
- Visual Studio Code

## 📁 Project Structure

```text
MERN STACK PROJECT/
├── client/              # React frontend
│   └── src/
│       └── App.tsx
├── server/              # Express backend
│   └── src/
│       ├── models/
│       ├── routes/
│       └── server.ts
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:
- Node.js and npm
- MongoDB Atlas account or a MongoDB instance
- Git

### 1. Clone the repository

```bash
git clone https://github.com/sonamkushwah2006/StaffSync-HRMS.git
cd StaffSync-HRMS
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

Configure the frontend environment variables if required by your application.

### 3. Install backend dependencies

Open another terminal from the project root:

```bash
cd server
npm install
```

Create a `server/.env` file and configure the MongoDB connection string and other environment variables required by the backend. Never upload real credentials or secrets to GitHub.

Example:

```env
PORT=5000
CLIENT_URL=http://localhost:5174
```

Add your MongoDB connection variable using the exact name expected by your backend configuration.

### 4. Start the backend

From the `server` directory, run:

```bash
npm run dev
```

The backend runs on:

`http://localhost:5000`

### 5. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Open the local URL displayed in your terminal. If your Vite configuration uses port 5174, the URL will be:

`http://localhost:5174`

## 🔌 Employee API Endpoints

Base URL: `http://localhost:5000/api/employees`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Retrieve all employees |
| GET | `/:id` | Retrieve one employee |
| POST | `/` | Create an employee |
| PATCH | `/:id` | Update an employee |
| DELETE | `/:id` | Delete an employee |

## 🔮 Future Improvements

- Complete attendance management
- Leave request and approval workflows
- Payroll management
- Employee performance tracking
- Training management
- Reports and analytics
- Authentication and role-based access control
- Production deployment

## 🔒 Security

- Keep `.env` files and database credentials private.
- Do not commit API keys, passwords, or other secrets.
- Configure production environment variables before deployment.

## 👩‍💻 Author

**Sonam Kushwah**

B.Tech Computer Science and Engineering

## 📄 License

This project was developed for educational and portfolio purposes. Add a license file if you intend to distribute it under a specific open-source license.
