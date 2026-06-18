# Jobster - Full Stack Job Tracking Application

Jobster is a full-stack job tracking web application that helps users organize and monitor their job applications efficiently. Users can register securely, log in using JWT-based authentication, create and manage job applications, update their profile information, and track their application progress through different stages such as Pending, Interview, and Declined.

The application is built using the MERN stack with a React frontend and a Node.js + Express backend running in ES Modules mode. MongoDB is used as the database with Mongoose ODM for schema management and data modeling.

Key Features:

* Secure user registration and login using JWT authentication
* Password hashing with bcryptjs
* Protected API routes using authentication middleware
* Create, read, update, and delete (CRUD) job applications
* Search, filter, sort, and paginate jobs
* Update user profile information
* Dashboard statistics using MongoDB Aggregation Pipelines
* Monthly job application analytics and status-based statistics
* Rate limiting and security middleware using Helmet
* Responsive React frontend with Redux Toolkit for state management
* RESTful API architecture with MongoDB Atlas integration

Tech Stack:

Frontend:

* React 18
* Redux Toolkit
* React Router DOM
* Axios
* Styled Components
* Recharts

Backend:

* Node.js
* Express 5
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Helmet
* Express Rate Limit

Database:

* MongoDB Atlas

This project demonstrates full-stack development concepts including authentication, authorization, REST APIs, database design, aggregation pipelines, state management, security best practices, and deployment-ready architecture.
