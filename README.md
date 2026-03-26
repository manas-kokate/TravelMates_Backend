# 🚀 TravelMates Backend (MERN)

## 📌 Overview

The **TravelMates Backend** powers a location-based travel community platform where users can share travel experiences, discover travelers at the same destination, and connect with potential companions.

Built using the **MERN stack**, this backend provides REST APIs for authentication, blogs, traveler discovery, and community interactions.

---

## 🧠 Core Features

### 👤 Authentication & Users

* JWT-based authentication
* Secure login & signup
* User profiles (name, avatar, travel interests)
* Session handling

### 📝 Travel Blogs & Posts

* Create, read, update, delete (CRUD) blog posts
* Posts include:

  * Location 📍
  * Content 📝
  * Intent (e.g., *Looking for companions*, *Travel tips*)
* Fetch posts by location (key feature)

### 🤝 Companion Finder

* Find travelers based on:

  * Destination
  * Travel preferences
* View active travelers in a location

### 💬 Replies & Interaction

* Comment/reply on posts
* Enable conversations between travelers

### 🌍 Location-Based Discovery

* Search posts by place
* Discover travelers currently in a location
* Foundation for real-time matching

---

## 🏗️ Tech Stack

* **Node.js** – Runtime environment
* **Express.js** – Backend framework
* **MongoDB** – NoSQL database
* **Mongoose** – ODM for MongoDB
* **JWT** – Authentication
* **bcrypt.js** – Password hashing
* **dotenv** – Environment config

---

## 📂 Project Structure

```
backend/
│── controllers/
│   ├── authController.js
│   ├── postController.js
│   ├── userController.js
│
│── models/
│   ├── User.js
│   ├── Post.js
│   ├── Comment.js
│
│── routes/
│   ├── authRoutes.js
│   ├── postRoutes.js
│   ├── userRoutes.js
│
│── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│
│── config/
│   ├── db.js
│
│── .env
│── server.js
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/travelmates.git
cd backend
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the server

```
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## 🔗 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |

---

### 👤 User Routes

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| GET    | /api/users/profile | Get user profile |
| PUT    | /api/users/profile | Update profile   |

---

### 📝 Post Routes

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| POST   | /api/posts                 | Create post           |
| GET    | /api/posts                 | Get all posts         |
| GET    | /api/posts/:id             | Get single post       |
| GET    | /api/posts/location/:place | Get posts by location |
| PUT    | /api/posts/:id             | Update post           |
| DELETE | /api/posts/:id             | Delete post           |

---

### 💬 Comment Routes

| Method | Endpoint                | Description  |
| ------ | ----------------------- | ------------ |
| POST   | /api/posts/:id/comment  | Add comment  |
| GET    | /api/posts/:id/comments | Get comments |

---

## 🔐 Authentication Flow

1. User registers/logs in
2. Server returns JWT token
3. Token stored on client
4. Protected routes accessed using:

```
Authorization: Bearer <token>
```

---

## 🧩 Data Models (Simplified)

### User

```
name
email
password
avatar
interests
currentLocation
```

### Post

```
userId
location
content
intent
createdAt
```

### Comment

```
postId
userId
text
createdAt
```

---

## 🚀 Future Enhancements

* 🌐 Real-time chat (Socket.io)
* 📍 Geo-location based matching
* 🔔 Notifications system
* 🧠 AI travel assistant (Tripio)
* ⭐ Ratings & trust system

---

## 🧑‍💻 Author

Developed by **Manas Kokate**

---

## ⭐ Contribution

Contributions are welcome!
Feel free to fork the repo and submit a PR.

---

## 📜 License

This project is licensed under the MIT License.
