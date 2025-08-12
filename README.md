Always show details

Copy
# Let's save the provided README content into a README.md file

readme_content = """# SiteOps Manager — README

**SiteOps Manager** is a centralized full-stack web app for managing client websites: sites, tickets, file uploads, users & role-based access. This README gives a clear, step-by-step guide to get the project running locally and how to connect to MongoDB Atlas (including the exact steps to get `MONGO_URI` into your `.env`).

---

# Table of contents
1. Project overview  
2. Quick start (dev)  
3. Detailed setup  
   - Backend `.env` and required variables  
   - Frontend config (Vite)  
4. MongoDB Atlas — create account, cluster & copy connection string  
5. Start servers (backend + frontend)  
6. Creating initial admin / superadmin user (seed)  
7. How auth, cookies and `empID` work (frontend & backend)  
8. API quick reference & examples (login, register, sites, tickets, files, risks)  
9. Common troubleshooting (CORS, Mongo SRV errors, 403 “No token provided”)  
10. Notes & recommended production changes

---

# 1 — Project overview
SiteOps Manager helps teams manage many client sites. It includes:
- Site CRUD (status, location, client)
- Ticket creation/listing
- File uploads (FilePond + Multer), view & delete
- Risks (create / edit / delete / list)
- Role-based access: `superadmin`, `admin`, `developer`, `client`
- Dashboard aggregated counts (scoped by employee id / role)
- JWT authentication and `empID` cookie (used as a per-user scope key)

---

# 2 — Quick start (dev)
```bash
# clone
git clone https://github.com/yourusername/siteops-manager.git
cd siteops-manager

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Add .env in backend (see next sections)

# Start backend
# in one terminal:
cd backend
npm run dev

# Start frontend (Vite)
# in another terminal:
cd frontend
npm run dev
3 — Detailed setup
Backend .env (create backend/.env)
Example:

ini
Always show details

Copy
PORT=5000
MONGO_URI=mongodb+srv://<DB_USER>:<DB_PASSWORD>@<CLUSTER_HOST>/<DB_NAME>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
Important: Replace <DB_USER>, <DB_PASSWORD>, <CLUSTER_HOST> and <DB_NAME> with values from Atlas. If your password contains special characters, URL-encode it (or wrap properly).

Frontend config (Vite)
If you want a base API URL, create frontend/.env (or .env.local) and add:

ini
Always show details

Copy
VITE_API_URL=http://localhost:5000
In code you can use import.meta.env.VITE_API_URL or keep hardcoded http://localhost:5000 if you prefer.

4 — MongoDB Atlas — create account & get MONGO_URI
Go to https://www.mongodb.com/cloud/atlas and sign up / log in.

Create a Project (if prompted).

Click Build a Cluster → choose Free Shared Cluster (M0) for dev. Pick cloud provider & region, create cluster.

After cluster is created, go to Database Access → Add New Database User. Create username (e.g., siteopsAdmin) and password. Save credentials.

Go to Network Access → IP Access List → add your IP (for development you can add 0.0.0.0/0 to allow from anywhere — not recommended for production).

Go to Clusters → Connect → Connect your application → select Node.js. Copy the connection string it gives, which looks like:

php-template
Always show details

Copy
mongodb+srv://<username>:<password>@cluster0.abcdxyz.mongodb.net/<dbname>?retryWrites=true&w=majority
Replace <username>, <password> and <dbname> with your values and paste it into backend/.env as MONGO_URI. Example:

bash
Always show details

Copy
MONGO_URI=mongodb+srv://siteopsAdmin:StrongPassword123@cluster0.jldetrl.mongodb.net/siteops?retryWrites=true&w=majority
If DNS SRV errors occur (see troubleshooting), you can create a standard connection string (non-srv) on Atlas Connect UI.

5 — Start servers (more details)
Backend
bash
Always show details

Copy
cd backend
# Make sure uploads folder exists
mkdir -p uploads

# Start dev server (needs nodemon set in package.json)
npm run dev
# or
node server.js
Server listens on PORT (default 5000). Backend should log MongoDB connected.

Frontend
bash
Always show details

Copy
cd frontend
npm run dev
# open whatever URL Vite prints (usually http://localhost:5173)
6 — Create initial admin / superadmin user
You can register via the UI /register if allowed, or use Postman / curl.

Example curl to register a superadmin (run once):

bash
Always show details

Copy
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Super Admin",
    "email":"super@siteops.local",
    "password":"YourStrongPass1!",
    "role":"superadmin",
    "employeeId":"1000000"
  }'
If your register route requires an empID header for createdBy, you can either seed directly into DB or temporarily allow the endpoint for initial setup. Another option: create the user directly in MongoDB Atlas UI (Collections → insert document) and ensure password is hashed or create a small seed script that uses bcrypt to hash.

7 — Auth, cookies and empID in brief
Login (POST /api/auth/login) returns a user (and you should also be returning a token). Example flow in frontend:

On success: localStorage.setItem('token', token) and localStorage.setItem('user', JSON.stringify(user)).

Backend also sets a cookie empID using res.cookie('empID', user.employeeId, {...}). For local dev you might use httpOnly: false to read with JS (not recommended in prod). Use js-cookie or document.cookie to read cookie in frontend.

Frontend snippet (read cookie):

js
Always show details

Copy
import Cookies from 'js-cookie';
const empID = Cookies.get('empID') || localStorage.getItem('empID');
How empID is used

Many backend endpoints expect empID header on requests to scope data:

GET /api/sites -> reads req.headers.empid to filter sites for given employee/creator.

GET /api/tickets -> filters by empID.

GET /api/files -> filters by empID.

GET /api/risks -> filters by empID.
Where you make requests from frontend, include headers:

js
Always show details

Copy
const token = localStorage.getItem('token');
const empID = localStorage.getItem('empID') || Cookies.get('empID');
axios.get('/api/sites', { headers: { Authorization: `Bearer ${token}`, empID } });
8 — API quick reference & examples
Auth

POST /api/auth/login

Body: { email, password }

Response: { user, token } and cookie empID set by backend.

POST /api/auth/register

Body: { name, email, password, role, employeeId }

Header optional: empID to set createdBy parent.

Sites

GET /api/sites — requires Authorization: Bearer <token> and header empID.

POST /api/sites — create site: body { location, name, description, status }. Include empID in body (or backend can derive createdBy from header).

PUT /api/sites/:id

DELETE /api/sites/:id

Tickets

GET /api/tickets — header empID to scope

POST /api/tickets — body includes empID (or backend derives)

DELETE /api/tickets/:id

Files

POST /upload — Multer endpoint. FormData fields: file, sitename (site id), empID

GET /api/files — header empID

DELETE /api/files/:id — file removed from DB and uploads/ folder.

Risks

GET /api/risks, POST /api/risks, PUT /api/risks/:id, DELETE /api/risks/:id

Header empID to scope

9 — Common troubleshooting
1) querySrv ENOTFOUND _mongodb._tcp.* (SRV/ DNS error)
Make sure the connection string you copied is correct and cluster is running.

Make sure your network allows DNS resolution for SRV records (some networks block). Try adding your IP in Atlas Network Access.

If SRV doesn't work, try the standard connection string (non +srv) via Atlas → “Connect” → “Drivers” → choose standard connection string.

2) 403 / 401 / “No token provided”
Ensure frontend sends Authorization: Bearer <token> header on protected endpoints.

Make sure the token you store in localStorage is the one returned on login.

3) Cookies not accessible in frontend
If backend sets cookie with httpOnly: true, browser JS cannot read it (good for security). For dev, you might set httpOnly: false temporarily.

When using cookies cross-origin, ensure CORS credentials: true both in backend and frontend fetch/axios requests.

4) Uploads not appearing or file not found after delete
Ensure the uploads/ folder exists in backend/ and Express serves it statically:

js
Always show details

Copy
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
Deletion endpoint should fs.unlink the file in uploads/ and remove the DB row.

10 — Production notes & security
Use HTTPS in production and set cookie secure: true and sameSite: 'None' if cross-site.

Set JWT_SECRET to a strong random string and store it in a secret manager.

Limit the IP access list in Atlas (do NOT use 0.0.0.0/0 in production).

Enable server-side input validation (express-validator) and sanitize inputs.

Hash passwords with bcrypt (current code uses bcrypt).

Consider rate limiting and audit logging for admin-sensitive actions.

Helpful snippets
Example login (frontend)
js
Always show details

Copy
const res = await axios.post('http://localhost:5000/api/auth/login', { email, password }, { withCredentials: true });
localStorage.setItem('token', res.data.token);
localStorage.setItem('user', JSON.stringify(res.data.user));
localStorage.setItem('empID', res.data.user.employeeId); // if backend returns empID in body
Example fetch with empID header
js
Always show details

Copy
const token = localStorage.getItem('token');
const empID = localStorage.getItem('empID') || Cookies.get('empID');

const res = await axios.get('http://localhost:5000/api/sites', {
  headers: { Authorization: `Bearer ${token}`, empID }
});
Create uploads folder
bash
Always show details

Copy
cd backend
mkdir -p uploads
Contact & support
Project maintained by Chaitanya Rai
Email: chaitanyarai.work@gmail.com
"""

Save to README.md
with open("/mnt/data/README.md", "w", encoding="utf-8") as f:
f.write(readme_content)

"/mnt/data/README.md"