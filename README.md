# SHREE CHIRANJEEVI Ayurveda & Panchakarma Clinic

Live link  -->  https://shree-chiranjeevi.onrender.com/

Full-stack MERN application for Ayurvedic clinic management under **Dr. Yatesh Naresh Gahukar** (B.A.M.S., MD (Ayu)).

## ✨ Key Features

- 🌐 **Multilingual**: English, Marathi, Hindi
- 🌓 **Dark/Light Mode**
- 👥 **Role-Based Dashboards**: Doctor & Patient
- 🔔 **Real-Time Notifications**
- 📧 **Email Integration** (Nodemailer)
- 💬 **WhatsApp Quick Contact**
- 📁 **File Uploads** (Multer)

## 🛠️ Tech Stack

**Frontend**: React + Vite | **Backend**: Node.js + Express | **Database**: MongoDB | **Styling**: Tailwind CSS | **Auth**: JWT | **State**: Context API

## 📁 Quick Structure

```
p2/
├── backend/
│   ├── controllers/    # Auth & Appointments
│   ├── models/         # User, Appointment, Notification
│   ├── routes/         # API endpoints
│   └── server.js
└── frontend/
    ├── src/
    │   ├── pages/      # Home, Login, Dashboards
    │   ├── components/ # Navbar, Footer, WhatsApp
    │   └── context/    # Auth, Theme, Language
    └── main.jsx
```

## 📦 Installation

```bash
git clone <your-repo-url>
cd p2/backend && npm install
cd ../frontend && npm install
```

## 🏃 Run Locally

```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 3000)
cd frontend && npm run dev
```

## 🧪 Testing

- Register as **Patient** or **Doctor**
- **Doctor Email**: `yateshgahukar4@gmail.com` (auto-upgraded)

## ☁️ Deployment (Render + MongoDB Atlas)

1. **Database**: Create free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Hosting**: Deploy on [Render](https://render.com/)
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Add env variables (MONGO_URI, JWT_SECRET, etc.)

## 👨‍⚕️ Contact

**Dr. Yatesh Naresh Gahukar**  
WhatsApp: +919145331731 | Email: yateshgahukar4@gmail.com

## 📝 License

Proprietary & Confidential

---

**Made with ❤️ for SHREE CHIRANJEEVI Ayurveda & Panchakarma Clinic**
