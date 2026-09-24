# 🎓 Neural Academy — AI-Powered Education System

An intelligent, full-stack education platform powered by **Google Gemini AI**. Students can learn through interactive courses, track progress, manage tasks, and chat with an AI tutor — all in one place.

---

## ✨ Features

- 🤖 **AI Chat Tutor** — Ask questions, get explanations powered by Google Gemini
- 📚 **Course & Track Management** — Browse learning tracks and enroll in courses
- ✅ **Task Manager** — Create, update, and delete personal study tasks
- 📅 **Schedule & Calendar** — Visual monthly calendar with todo progress tracking
- 👤 **Profile & Avatar Upload** — Personalize your account with an uploaded photo
- 🌙 **Dark / Light Theme** — Toggle theme with persistent preference
- 🔐 **Admin Panel** — Manage users, contacts, and platform content
- 📩 **Contact Form** — Email notifications via Nodemailer

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| AI | Google Gemini API |
| File Uploads | Cloudinary |
| Email | Nodemailer (SMTP) |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Render.com |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/PraveenRaii/AI-Education-System.git
cd AI-Education-System

# 2. Install all dependencies (root + backend + frontend)
npm install

# 3. Copy environment file and fill in your values
cp .env.example .env
```

Open `.env` and fill in all required values (see table below).

```bash
# 4. Start both frontend and backend together
npm run dev:full
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 🔑 Environment Variables

Create a `.env` file in the project root with these variables:

| Variable | Description | Required |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ Yes |
| `JWT_SECRET` | Any long random secret string | ✅ Yes |
| `ADMIN_EMAIL` | Admin login email | ✅ Yes |
| `ADMIN_PASSWORD` | Admin login password | ✅ Yes |
| `GEMINI_API_KEY` | Google AI Studio API key | ✅ Yes |
| `CLIENT_ORIGIN` | Frontend URL (for CORS) | ✅ Yes |
| `NODE_ENV` | Set to `production` on Render | ✅ Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ⚠️ For uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ⚠️ For uploads |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ⚠️ For uploads |
| `SMTP_HOST` | Email SMTP host | ⚠️ For email |
| `SMTP_PORT` | Email SMTP port | ⚠️ For email |
| `SMTP_USER` | Email SMTP username | ⚠️ For email |
| `SMTP_PASS` | Email SMTP password | ⚠️ For email |

---

## ☁️ Render Deployment Guide (Step-by-Step)

This app deploys as a **single Web Service** on Render — Express serves both the API and the React frontend build.

---

### Step 1 — Prepare MongoDB Atlas

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Open your cluster → **Network Access** → click **Add IP Address**
3. Enter `0.0.0.0/0` and click **Confirm** *(allows Render's dynamic IPs)*
4. Go to **Database Access** → create a database user with a strong password
5. Click **Connect** → **Drivers** → copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/neural-academy?retryWrites=true&w=majority
   ```

---

### Step 2 — Create Web Service on Render

1. Go to [https://render.com](https://render.com) and sign in
2. Click **New +** → **Web Service**
3. Connect your GitHub account if not already connected
4. Search for and select the repo: **`PraveenRaii/AI-Education-System`**
5. Click **Connect**

---

### Step 3 — Configure Build & Start Settings

Fill in these settings on the Render service page:

| Setting | Value |
|---|---|
| **Name** | `neural-academy` (or any name you like) |
| **Region** | Singapore / Oregon (whichever is closest) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | Free (or Starter for production) |

---

### Step 4 — Add Environment Variables

On the Render service page, scroll down to **Environment** → click **Add Environment Variable** for each:

| Key | Value |
|---|---|
| `MONGODB_URI` | Your Atlas connection string from Step 1 |
| `JWT_SECRET` | Any long random string e.g. `mysecretkey123abc456xyz` |
| `ADMIN_EMAIL` | Your admin email e.g. `coder4986@gmail.com` |
| `ADMIN_PASSWORD` | Strong admin password |
| `GEMINI_API_KEY` | Get from https://aistudio.google.com/app/apikey |
| `NODE_ENV` | `production` |
| `CLIENT_ORIGIN` | *(leave blank for now — fill after first deploy)* |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `SMTP_HOST` | e.g. `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASS` | Gmail App Password (not regular password) |

---

### Step 5 — Deploy

1. Click **Create Web Service**
2. Render will start building — watch the logs in the **Logs** tab
3. Build takes ~3–5 minutes for the first deploy
4. When you see `==> Your service is live 🎉`, your app is deployed!
5. Copy your live URL — it looks like: `https://neural-academy.onrender.com`

---

### Step 6 — Set CLIENT_ORIGIN (Important!)

After your first deploy:

1. Go back to **Environment** tab on Render
2. Find `CLIENT_ORIGIN` → set its value to your live Render URL:
   ```
   https://neural-academy.onrender.com
   ```
3. Click **Save Changes** → Render will auto-redeploy
4. This fixes CORS — your frontend and backend will communicate correctly

---

### Step 7 — Test Your Live App

1. Open your live URL in the browser
2. Click **Login** → use your `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. Test:
   - ✅ Login / Register
   - ✅ AI Chat Tutor
   - ✅ Courses & Tracks
   - ✅ Task Manager
   - ✅ Schedule Calendar
   - ✅ Profile & Avatar Upload
   - ✅ Admin Panel (if logged in as admin)

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| MongoDB connection error | Check `MONGODB_URI` is correct and IP `0.0.0.0/0` is whitelisted in Atlas |
| Build fails on Render | Check Node version — set `NODE_VERSION=18` in Render env vars |
| CORS errors in browser | Make sure `CLIENT_ORIGIN` matches your exact Render URL (no trailing slash) |
| AI chat not working | Check `GEMINI_API_KEY` is valid — get one from https://aistudio.google.com/app/apikey |
| Avatar upload fails | Check all three Cloudinary env vars are set correctly |
| Emails not sending | Use Gmail App Password (not regular password) with 2FA enabled |
| App shows blank page | Run `npm run build` locally first to check for build errors |

---

## 📁 Project Structure

```
AI-Education-System/
├── backend/
│   ├── index.js          # Main Express server
│   ├── models/           # Mongoose models (User, Task, Contact)
│   └── middleware/       # Auth middleware (JWT)
├── frontend/
│   ├── src/
│   │   ├── pages/        # React pages (Dashboard, Schedule, etc.)
│   │   ├── components/   # Reusable components
│   │   └── shared/       # API helper, static data
│   └── vite.config.js    # Vite config (builds to ../dist)
├── dist/                 # Production build output (auto-generated)
├── render.yaml           # Render Blueprint config
├── package.json          # Root scripts (build, start, dev:full)
└── .env.example          # Template for environment variables
```

---

## 📜 License

MIT — free to use, modify, and distribute.

---

*Built with ❤️ by [PraveenRaii](https://github.com/PraveenRaii)*
