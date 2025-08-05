# 🛠️ SiteOps Manager

SiteOps Manager is a centralized full-stack web platform designed to manage and maintain multiple client websites efficiently. It provides role-based access control, ticket tracking, site and credential management, and file uploads — making it ideal for internal IT teams, dev agencies, and SaaS infrastructure monitoring.

---

## 📌 Table of Contents

- [🔍 Project Overview](#-project-overview)
- [🚀 Features Implemented](#-features-implemented)
- [📦 Tech Stack](#-tech-stack)
- [🧑‍💻 User Roles](#-user-roles)
- [📸 UI Screenshots](#-ui-screenshots)
- [⚙️ Setup Instructions](#-setup-instructions)
- [🌐 API Endpoints Overview](#-api-endpoints-overview)
- [🔒 Authentication & Cookies](#-authentication--cookies)
- [📁 Project Structure](#-project-structure)
- [🧩 Future Enhancements](#-future-enhancements)

---

## 🔍 Project Overview

SiteOps Manager helps development and support teams track the health, credentials, and tasks associated with multiple client websites. It's built for internal use with a clear separation of roles and functionality.

Key domains:

- 📍 Site Management
- 🎫 Ticket Tracking
- 🔐 Secure Credential Storage
- 📁 File Uploads (PDFs, backups, SSL certs)
- 🧑‍🤝‍🧑 Role-Based User Access
- 📊 Dashboard Metrics

---

## 🚀 Features Implemented

✅ **Authentication**  
- JWT-based login  
- Role-aware context using `AuthContext`  
- Persistent auth using localStorage  
- Employee ID stored via cookie (`empID`)

✅ **User Management**  
- Admin-only access to user list  
- Role switching: Client / Developer / Admin  
- User deletion (by Admin)

✅ **Site Management**  
- CRUD for websites: location, client, status  
- Status badge (Active, Maintenance, Down)  
- Used in dropdowns across app (File uploads, Tickets)

✅ **Ticket Management**  
- Admin-only ticket creation  
- Each ticket is linked to a site (via dropdown)  
- View, delete tickets  
- Dynamic table for existing tickets

✅ **File Uploads**  
- Upload files using FilePond  
- Files linked to sites  
- Download and delete supported  
- File listing table below uploader

✅ **Dashboard**  
- Total Sites  
- Total Tickets  
- Total Users  
- Total Files  
- Personalized greeting (name from user context)

---

## 📦 Tech Stack

### 🔹 Frontend
- React.js (with Vite)
- Tailwind CSS
- Axios
- FilePond

### 🔹 Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- Bcrypt (password hashing)
- JWT (authentication)
- Multer (file uploads)
- Cookie-parser

---

## 🧑‍💻 User Roles

| Role        | Capabilities                                           |
|-------------|--------------------------------------------------------|
| **Admin**   | Manage sites, users, tickets, files                    |
| **Developer** | View only dashboards and site/ticket status           |
| **Client**  | Read-only for assigned sites                           |
| **Super Admin** (Future) | Full audit logs, credentials, monitoring   |

---

## 📸 UI Screenshots

> _Screenshots will be added after design finalization._

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/siteops-manager.git
cd siteops-manager
2. Install backend
bash
Copy
Edit
cd backend
npm install
3. Install frontend
bash
Copy
Edit
cd ../frontend
npm install
4. Configure .env in /backend
env
Copy
Edit
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/siteops?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
5. Start servers
bash
Copy
Edit
# Backend
cd backend
npm run dev

# Frontend (in new terminal)
cd frontend
npm run dev
🌐 API Endpoints Overview
Method	Endpoint	Description
POST	/api/auth/login	Authenticate user, return token
POST	/api/auth/register	Register new user
GET	/api/sites	Get all sites
POST	/api/sites	Add new site
PUT	/api/sites/:id	Update site
DELETE	/api/sites/:id	Delete site
GET	/api/tickets	Fetch tickets
POST	/api/tickets	Create ticket
DELETE	/api/tickets/:id	Delete ticket
GET	/api/users	Admin: get all users
PUT	/api/users/:id	Admin: update role
DELETE	/api/users/:id	Admin: delete user
POST	/upload	Upload file
GET	/api/files	List all files
DELETE	/api/files/:id	Delete file

🔒 Authentication & Cookies
On login, a token is stored in localStorage.

Employee ID (empID) is stored in a browser cookie (optional).

Role and user info stored in AuthContext.

Use js-cookie to read cookie if needed:

js
Copy
Edit
import Cookies from "js-cookie";
const empId = Cookies.get("empID");
📁 Project Structure
bash
Copy
Edit
siteops-manager/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── uploads/ (Multer files)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.jsx
│
└── README.md
🧩 Future Enhancements
✅ SSL/hosting expiry tracking

✅ Site status alerts

🔔 Email notifications for ticket assignments

🌐 Site uptime monitoring (ping/cron)

📌 Credential encryption using AES

👀 Admin audit logs

🧪 Unit & integration tests

📞 Contact
Developed by Chaitanya Rai
For queries or deployment support:
📧 chaitanyarai.work@gmail.com
🌐 LinkedIn

📝 License
This project is open source under MIT License.

yaml
Copy
Edit

---

Let me know if you'd like:
- GitHub Actions for deployment
- Swagger/OpenAPI docs
- MongoDB seed scripts
- Email invite feature for Admins

Would you like me to export this `README.md` as a file?