# Neural Academy ✦ AI-Powered Education System

Neural Academy is a modern, full-stack adaptive learning platform featuring personalized student tracks, an intelligent AI tutor powered by Google Gemini, real-time schedule and task management, an administrative console with full MongoDB CRUD, and dynamic light/dark theming.

---

## 🚀 Features

- **Personalized Learning Tracks**: Curriculum paths for Class 1–8, Class 8–10, Class 11–12, and Graduation.
- **AI Tutor (Gemini Integration)**: Instant homework help and conceptual explanations with student-friendly guidance.
- **Interactive Schedule & Calendar**: Monthly calendar navigation, daily progress percentage tracking, and to-do management with task deletion.
- **Admin Management Console**:
  - Task CRUD operations with real-time MongoDB ID tracking and date validation.
  - Contact inbox for visitor inquiries with status updates (`new`, `read`, `resolved`).
  - Live user overview and metrics.
- **Profile & Settings**:
  - Image upload with fallback base64 and Cloudinary support.
  - Social media link integration and notification preference controls.
- **Theme Support**: Seamless Dark and Light mode across all public pages and the dashboard.
- **Unified Full-Stack Architecture**: Single deployment model where Express serves the production React build out-of-the-box.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Vanilla CSS design system
- **Backend**: Node.js, Express 4, Mongoose 8
- **Database**: MongoDB Atlas
- **AI**: Google Generative AI SDK (`@google/generative-ai`)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Media & Email**: Cloudinary (optional) & Nodemailer (SMTP)

---

## 💻 Local Setup & Development

### 1. Clone the repository
```bash
git clone https://github.com/PraveenRaii/AI-Education-System.git
cd AI-Education-System
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (use `.env.example` as a template):
```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/Education?retryWrites=true&w=majority
JWT_SECRET=your-random-jwt-secret-key
ADMIN_EMAIL=coder4986@gmail.com
ADMIN_PASSWORD=your-secure-admin-password

# AI Tutor (Gemini)
GEMINI_API_KEY=your-google-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash

# Cloudinary (Optional - for avatar uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (Optional - for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=
SMTP_PASSWORD=
CONTACT_RECEIVER_EMAIL=coder4986@gmail.com
```

### 4. Run Locally
- **Run Fullstack (Frontend + Backend concurrently)**:
  ```bash
  npm run dev:full
  ```
- **Run Frontend only**:
  ```bash
  npm run dev
  ```
- **Run Backend only**:
  ```bash
  npm run server
  ```
- **Build Frontend**:
  ```bash
  npm run build
  ```

---

## 🌐 Render Deployment Guide (Step-by-Step)

The project is configured so that you can deploy the complete full-stack app on **a single Render Web Service (Free Tier)**.

### Step 1: Prepare MongoDB Atlas
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Under **Security** > **Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere** (`0.0.0.0/0`) since Render uses dynamic outbound IPs.
3. Under **Database**, click **Connect** > **Drivers** to copy your connection string (e.g. `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/Education?retryWrites=true&w=majority`).

---

### Step 2: Create a Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and sign in with GitHub.
2. Click **New +** > **Web Service**.
3. Select and connect your repository: `PraveenRaii/AI-Education-System`.

---

### Step 3: Configure Service Details

Fill in the settings as follows:

| Field | Recommended Value | Notes |
| :--- | :--- | :--- |
| **Name** | `neural-academy` | Or any unique service name |
| **Region** | Singapore / Frankfurt / Oregon | Choose the closest region to your users |
| **Branch** | `main` | Production branch |
| **Root Directory** | *(Leave blank)* | Uses project root |
| **Runtime** | `Node` | Node.js environment |
| **Build Command** | `npm install && npm run build` | Installs dependencies and builds the Vite frontend into `dist/` |
| **Start Command** | `npm start` | Starts Express backend which serves API and frontend |
| **Instance Type** | `Free` | Free tier tier |

---

### Step 4: Add Environment Variables

In the **Environment Variables** section on Render, add the following key-value pairs:

| Variable | Description / Example | Required |
| :--- | :--- | :---: |
| `MONGODB_URI` | Your MongoDB connection string (`mongodb+srv://...`) | **Yes** |
| `JWT_SECRET` | A secure random string for signing user tokens | **Yes** |
| `ADMIN_EMAIL` | Administrator login email (e.g. `coder4986@gmail.com`) | **Yes** |
| `ADMIN_PASSWORD` | Administrator login password | **Yes** |
| `GEMINI_API_KEY` | Google AI Studio Gemini API Key | Recommended |
| `GEMINI_MODEL` | `gemini-1.5-flash` | Optional |
| `NODE_ENV` | `production` | Optional |
| `PORT` | `10000` *(Render sets this automatically)* | Optional |
| `CLIENT_ORIGIN` | Your Render app URL (e.g. `https://neural-academy.onrender.com`) | Optional |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Optional |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Optional |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Optional |
| `SMTP_HOST` | SMTP server host (e.g. `smtp.gmail.com`) | Optional |
| `SMTP_PORT` | `465` | Optional |
| `SMTP_SECURE` | `true` | Optional |
| `SMTP_USER` | Email address sending notifications | Optional |
| `SMTP_PASSWORD` | App password for SMTP account | Optional |
| `CONTACT_RECEIVER_EMAIL` | Destination email for contact submissions | Optional |

---

### Step 5: Deploy & Launch
1. Click **Create Web Service** at the bottom of the page.
2. Render will trigger the build pipeline:
   - `npm install` installs both frontend and backend dependencies.
   - `npm run build` compiles Vite assets to `dist/`.
   - `npm start` launches `backend/index.js`, serving API endpoints under `/api` and the React app for all other routes.
3. Once the build finishes and shows **Live**, open your public Render URL (e.g. `https://neural-academy.onrender.com`).
4. Click **Admin sign in** at the top right and log in using your `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

---

## ⚡ Alternative: Blueprint Deployment (`render.yaml`)

This repository also includes a [`render.yaml`](./render.yaml) file. You can deploy directly with Render Blueprints:
1. Go to **Render Dashboard** > **Blueprints** > **New Blueprint Instance**.
2. Connect this repository.
3. Fill in the prompted secrets (`MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `GEMINI_API_KEY`).
4. Click **Apply** to automatically provision and launch the service.

---

## 📁 Repository Structure

```text
├── backend/
│   ├── middleware/
│   │   └── auth.js            # JWT auth and admin permission middlewares
│   ├── models/
│   │   ├── Contact.js         # Contact requests Mongoose schema
│   │   ├── Task.js            # Tasks Mongoose schema
│   │   └── User.js            # User profile Mongoose schema
│   └── index.js               # Express API and production static server
├── frontend/
│   ├── src/
│   │   ├── components/        # Dashboard, Sidebar, TutorChat, Brand, Icon
│   │   ├── pages/             # HomePage, AuthPage, AdminPage, SchedulePage, CoursesPage, etc.
│   │   ├── shared/            # api.js client, tracks and course data
│   │   ├── App.jsx            # Main app controller with route and theme state
│   │   └── styles.css         # Global styles and theme tokens
│   ├── index.html             # HTML entry point
│   └── vite.config.js         # Vite configuration with /api proxy
├── .env.example               # Template environment configuration
├── package.json               # Full-stack dependencies and deployment scripts
└── render.yaml                # Render Blueprint deployment definition
```

---

## 📄 License

ISC License. Built for Neural Academy.
