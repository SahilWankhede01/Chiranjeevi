# SHREE CHIRANJEEVI Ayurveda & Panchakarma Clinic

A modern, full-stack MERN application for the Ayurvedic clinic **SHREE CHIRANJEEVI Ayurveda & Panchakarma Clinic** under the expert care of **Dr. Yatesh Naresh Gahukar** (B.A.M.S., MD (Ayu)).

Features dynamic multilingual support (English, Marathi, Hindi), dark/light mode toggle, role-based dashboards (Doctor/Admin & Patient), real-time database alerts, email notification integration (Nodemailer), static uploads support (Multer), and a fixed floating WhatsApp quick contact button.

---

## Technical Stack

- **Frontend**: React + Vite (Fast HMR, built-in proxies)
- **Backend**: Node.js + Express.js (REST API, structured routing)
- **Database**: MongoDB (Mongoose models: Users, Appointments, Notifications)
- **Styling**: Tailwind CSS (Custom themes: Ayurvedic Green + Saffron + Light/Dark toggles)
- **Authentication**: JWT (Stored in local storage, verified by backend guard middleware)
- **State Management**: React Context API (Auth, Theme, Translations, Custom Toast Alerts)

---

## Folder Structure

```text
p2/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── translations/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## Environment Variables Configuration

Create a `.env` file in the `backend/` directory (see [backend/.env.example](file:///C:/Users/Sahil%20Wankhede/OneDrive/Desktop/p2/backend/.env.example)):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chiranjeevi-ayurveda
JWT_SECRET=supersecretkeyforchiranjeeviayurveda123

# Nodemailer setup (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
DOCTOR_EMAIL=yateshgahukar@gmail.com
```

*Note: For testing email dispatch, configure Gmail App Passwords. Otherwise, the system logs email outputs to the terminal instead of failing, to prevent booking crashes.*

---

## Local Installation Steps

### Prerequisites
- Node.js installed (v16+)
- Local MongoDB running (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

> [!WARNING]
> **Windows PowerShell Script Block Error:**
> If you get the error: *`npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled...`*, you can bypass this in one of three ways:
> 1. **Use Command Prompt (CMD)**: Open a Command Prompt (cmd) instead of PowerShell. CMD does not block npm scripts.
> 2. **Use `.cmd` in PowerShell**: Run `npm.cmd install` and `npm.cmd run dev` instead of plain `npm`.
> 3. **Bypass Session Policy**: Run this command inside your PowerShell session to allow running scripts temporarily:
>    ```powershell
>    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
>    ```

### Step 1: Install Backend Dependencies
```bash
cd backend
# In CMD, or using the PowerShell bypass:
npm install
# Or explicitly in PowerShell:
npm.cmd install
```

### Step 2: Install Frontend Dependencies
```bash
cd ../frontend
# In CMD, or using the PowerShell bypass:
npm install
# Or explicitly in PowerShell:
npm.cmd install
```

---

## Running the Application Locally

Run the development servers:

1. **Start Backend Server**:
   ```bash
   cd backend
   # In CMD:
   npm run dev
   # In PowerShell:
   npm.cmd run dev
   ```
   *Runs on `http://localhost:5000`*

2. **Start Frontend Client**:
   ```bash
   cd frontend
   # In CMD:
   npm run dev
   # In PowerShell:
   npm.cmd run dev
   ```
   *Runs on `http://localhost:3000` (automatically proxies API requests to port 5000)*
   *Runs on `http://localhost:3000` (automatically proxies API requests to port 5000)*

---

## Evaluation / Testing Guideline

1. **Role-Based Testing**:
   - For easy evaluation, the registration form (`/register`) includes a **Role Selector** dropdown.
   - You can sign up as a **Patient** or a **Doctor**.
   - If you register a user with the doctor's email specified in `.env` (default: `yateshgahukar@gmail.com`), the backend will automatically upgrade it to the `doctor` role.

2. **Multilingual Verification**:
   - Select English, मराठी, or हिन्दी in the Navbar dropdown. All static landing text, disease cards, form fields, and dashboard interfaces will update instantly.

3. **Responsive Viewports**:
   - Open browser developer tools and toggle device views (Mobile/Tablet/Desktop). The grid systems, lists, and drawers collapse cleanly.

4. **Floating WhatsApp Chat**:
   - Click the pulsing green button in the bottom right. It redirects to WhatsApp Web/App, opening a chat targeting `+919145331731` pre-filled with the message template.

---

## Deployment Guide (Render + MongoDB Atlas)

This application is fully deployment-ready. By utilizing the root-level `package.json`, both the frontend and backend compile and run together as a single unified service. This makes hosting on free-tier platforms (like Render) seamless.

### Step 1: Create a Free MongoDB Atlas Database (Cloud DB)
Since local MongoDB is not accessible on the internet, you need a free cloud database:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new project and build a **Free M0 Cluster**.
3. Under **Security Quickstart**:
   - Set a Database Username and Password (save these).
   - Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) so your cloud host can connect.
4. Go to **Database** -> click **Connect** on your cluster -> choose **Drivers** (Node.js).
5. Copy your connection string. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority`
   *(Replace `<username>` and `<password>` with the credentials you created).*

### Step 2: Push Your Code to GitHub
Render deploys directly from GitHub:
1. Create a repository on your GitHub account.
2. Initialize Git in this project directory, commit, and push it to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initialize project"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### Step 3: Deploy on Render (Free App Hosting)
1. Go to [Render](https://render.com/) and sign up (connect with your GitHub account).
2. Click **New +** -> select **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Name**: `chiranjeevi-ayurveda-clinic` (or any name you prefer)
   - **Region**: Select the one closest to you (e.g., Singapore or US East)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build` (This runs the root build script, installing all frontend/backend dependencies and compiling React)
   - **Start Command**: `npm start` (This starts the unified Express backend on the assigned PORT)
   - **Instance Type**: Select **Free**
5. Click **Advanced** and add these Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = `YOUR_MONGODB_ATLAS_CONNECTION_STRING`
   - `JWT_SECRET` = `ANY_RANDOM_LONG_SECRET_KEY`
   - `DOCTOR_EMAILS` = `yateshgahukar@gmail.com,sahilwankhade0204@gmail.com`
   - `EMAIL_SERVICE` = `gmail` (Optional, for notifications)
   - `EMAIL_USER` = `your-email@gmail.com` (Optional)
   - `EMAIL_PASS` = `your-app-password` (Optional)
6. Click **Deploy Web Service**.

Once Render finishes building, you will get a live URL (e.g., `https://chiranjeevi-ayurveda-clinic.onrender.com`) where the clinic application will be active for anyone on the internet!

