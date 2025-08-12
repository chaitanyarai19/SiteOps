# 🚀 SiteOps

**_A centralized platform to manage and maintain multiple client websites efficiently!_**  
Built for internal IT teams, dev agencies, and SaaS infrastructure monitoring — with role-based access, ticket tracking, and site management.

---

## 📖 Table of Contents
- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [👥 User Roles](#-user-roles)
- [🖼 Screenshots](#-screenshots)
- [⚙️ Setup & Installation](#️-setup--installation)
- [🌐 API Endpoints](#-api-endpoints)
- [🔒 Authentication & Cookies](#-authentication--cookies)
- [📂 Project Structure](#-project-structure)
- [🚀 Future Enhancements](#-future-enhancements)
- [📞 Contact](#-contact)

---

## 🌟 Overview
**SiteOps Manager** helps dev and support teams track the **health, credentials, and tasks** for multiple websites.  
Everything is accessible from a single dashboard — with clear **role-based permissions**.

**Core Modules:**
- 📍 Site Management
- 🎫 Ticket Tracking
- 🔐 Secure Credential Storage
- 📁 File Uploads (PDFs, backups, SSL certs)
- 📊 Dashboard Metrics

---

## ✨ Features
✅ **JWT Authentication** – secure login/logout  
✅ **Role-based Access** – different views for Admin, Developer, Client, Superadmin  
✅ **CRUD Operations** – for Sites, Tickets, Risks, Files  
✅ **File Uploads** – with preview & delete support  
✅ **Responsive UI** – built with Tailwind CSS  
✅ **Dashboard Metrics** – real-time counts for all modules  

---

## 🛠 Tech Stack

**Frontend**  
- ⚛ React.js (Vite)  
- 🎨 Tailwind CSS  
- 📡 Axios  
- 📂 FilePond (file uploads)

**Backend**  
- 🟢 Node.js + Express  
- 🗄 MongoDB Atlas + Mongoose  
- 🔐 JWT + Bcrypt  
- 📦 Multer (file handling)  
- 🍪 Cookie-parser  

---

## 👥 User Roles

| Role         | Capabilities |
|--------------|-------------|
| **Superadmin** | Access everything, manage admins |
| **Admin**     | Manage sites, users, tickets, files |
| **Developer** | View data assigned by admin |
| **Client**    | Read-only for assigned sites |

---

## 🖼 Screenshots
📷 _UI screenshots coming soon_

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository

* clone repository

```bash
cd siteops
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```

### 4️⃣ Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account & sign in
3. Create a **New Project**
4. Deploy a **Free Cluster**
5. Create a **Database User** (username & password)
6. Go to **Database → Connect → Connect your application**
7. Copy the **Connection String** (replace `<password>` with your DB password)

Example:  
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/siteops?retryWrites=true&w=majority
```

### 5️⃣ Configure `.env` in `/backend`
```env
PORT=5000
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret
```

### 6️⃣ Start Backend
```bash
cd backend
npm run dev
```

### 7️⃣ Start Frontend
```bash
cd frontend
npm run dev
```

---

## 🌐 API Endpoints

| Method | Endpoint              | Description |
|--------|----------------------|-------------|
| POST   | /api/auth/login       | Login user |
| POST   | /api/auth/register    | Register user |
| GET    | /api/sites            | Get all sites |
| POST   | /api/sites            | Create site |
| PUT    | /api/sites/:id        | Update site |
| DELETE | /api/sites/:id        | Delete site |
| GET    | /api/tickets          | Get tickets |
| POST   | /api/tickets          | Create ticket |
| DELETE | /api/tickets/:id      | Delete ticket |
| GET    | /api/files            | List files |
| DELETE | /api/files/:id        | Delete file |

---

## 🔒 Authentication & Cookies
- Token stored in `localStorage`
- Employee ID (`empID`) stored in cookies
- Role & user info stored in `AuthContext`

---

## 📂 Project Structure
```
siteops-manager/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── uploads/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.jsx
│
└── README.md
```

---

## 🚀 Future Enhancements
- ✅ SSL/Hosting expiry tracking  
- 🔔 Email notifications for tickets  
- 🌐 Site uptime monitoring  
- 🔐 AES-based credential encryption  
- 📜 Admin activity logs  

---

## 📞 Contact
👨‍💻 **Chaitanya Rai**  
📧 [Email Me](mailto:chaitanyarai.work@gmail.com)  
🌐 [LinkedIn Profile](https://www.linkedin.com)

---
_This project is licensed under the MIT License._
