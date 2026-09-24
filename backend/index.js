import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';
import User from './models/User.js';
import Task from './models/Task.js';
import Contact from './models/Contact.js';
import { requireAdmin, requireAuth } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Please configure your .env file using .env.example as a template.');
  process.exit(1);
}

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',').map((s) => s.trim()) : [])
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const email = process.env.ADMIN_EMAIL.toLowerCase();
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await User.findOneAndUpdate(
        { email },
        { $set: { name: 'Neural Academy Admin', email, passwordHash, role: 'admin' } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`Administrator account ready for ${email}`);
    }
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, track: user.track, role: user.role, avatarUrl: user.avatarUrl, bio: user.bio, phone: user.phone, socials: user.socials, preferences: user.preferences };
}

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'neural-academy-api' }));

app.post('/api/contact', async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required.' });
    }
    const contact = await Contact.create({ name, email, phone, subject, message });
    const smtpReady = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD;
    let emailSent = false;
    if (smtpReady) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 465),
          secure: process.env.SMTP_SECURE !== 'false',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        });
        await transporter.sendMail({
          from: `"Neural Academy contact form" <${process.env.SMTP_USER}>`,
          to: process.env.CONTACT_RECEIVER_EMAIL || 'coder4986@gmail.com',
          replyTo: email,
          subject: `[Neural Academy] ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\n${message}`
        });
        emailSent = true;
      } catch (emailError) {
        console.error('Contact email delivery failed:', emailError.message);
      }
    }
    return res.status(201).json({
      message: emailSent ? 'Your message was sent successfully.' : 'Your message was saved and is visible in the admin inbox. Email delivery needs SMTP setup.',
      id: contact.id,
      emailSent
    });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/signup', async (req, res, next) => {
  try {
    const { name, email, password, track } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      track
    });
    return res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    return res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/auth/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.put('/api/auth/profile', requireAuth, async (req, res, next) => {
  try {
    const { name, phone, bio, track, socials, preferences } = req.body;
    const updates = {
      ...(name !== undefined ? { name: String(name).trim().slice(0, 80) } : {}),
      ...(phone !== undefined ? { phone: String(phone).trim().slice(0, 30) } : {}),
      ...(bio !== undefined ? { bio: String(bio).trim().slice(0, 240) } : {}),
      ...(track !== undefined ? { track } : {}),
      ...(socials !== undefined ? { socials } : {}),
      ...(preferences !== undefined ? { preferences } : {})
    };
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/uploads/avatar', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image file is required.' });
    if (!req.file.mimetype.startsWith('image/')) return res.status(400).json({ message: 'Only image files are supported.' });
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      if (req.file.size > 1024 * 1024) return res.status(400).json({ message: 'Image must be 1MB or smaller when Cloudinary is not configured.' });
      const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      await User.findByIdAndUpdate(req.user.id, { avatarUrl: dataUrl });
      return res.json({ url: dataUrl, storage: 'mongodb-fallback' });
    }
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'neural-academy/avatars', resource_type: 'image' }, (error, value) => (error ? reject(error) : resolve(value)));
      stream.end(req.file.buffer);
    });

    await User.findByIdAndUpdate(req.user.id, { avatarUrl: result.secure_url });
    return res.json({ url: result.secure_url });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/admin/users', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/admin/contacts', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    return res.json({ contacts });
  } catch (error) {
    return next(error);
  }
});

app.put('/api/admin/contacts/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (status && !['new', 'read', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Status must be "new", "read", or "resolved".' });
    }
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!contact) return res.status(404).json({ message: 'Contact request not found.' });
    return res.json({ contact });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/admin/tasks', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email').populate('createdBy', 'name email').sort({ createdAt: -1 }).lean();
    return res.json({ tasks });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/admin/tasks', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { title, description, status, dueDate, assignedTo } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Task title is required.' });
    const task = await Task.create({
      title: title.trim(),
      description: description ? String(description).trim().slice(0, 500) : '',
      status: status || 'todo',
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedTo: assignedTo || null,
      createdBy: req.user.id
    });
    return res.status(201).json({ task });
  } catch (error) {
    return next(error);
  }
});

app.put('/api/admin/tasks/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { title, description, status, dueDate, assignedTo } = req.body;
    const updates = {
      ...(title !== undefined ? { title: String(title).trim().slice(0, 120) } : {}),
      ...(description !== undefined ? { description: String(description).trim().slice(0, 500) } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
      ...(assignedTo !== undefined ? { assignedTo: assignedTo || null } : {})
    };
    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    return res.json({ task });
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/admin/tasks/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    return res.json({ message: 'Task deleted.', id: task.id });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/ai/chat', requireAuth, async (req, res) => {
  try {
    if (!genAI) return res.status(503).json({ message: 'Gemini is not configured. Please set GEMINI_API_KEY in .env.' });
    const prompt = String(req.body.message || '').trim();
    if (!prompt || prompt.length > 2000) return res.status(400).json({ message: 'Message must be between 1 and 2000 characters.' });
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(`You are Neural Academy's friendly AI tutor. Explain clearly for a student. Do not invent sources. Student question: ${prompt}`);
    return res.json({ reply: result.response.text() });
  } catch (error) {
    console.error('Gemini AI chat error:', error.message);
    return res.status(502).json({ message: 'The AI tutor is currently unavailable. Please try again shortly.' });
  }
});

app.get('/api/admin/stats', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const totalLearners = await User.countDocuments({ role: 'student' });
    return res.json({ totalLearners, activeCourses: 248, completionRate: 78.6, supportTickets: 24 });
  } catch (error) {
    return next(error);
  }
});

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body must be valid JSON.' });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ message: `Invalid identifier format for ${error.path || 'record'}.` });
  }
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors || {})
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({ message: message || 'Validation failed.' });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: 'A record with this identifier already exists.' });
  }
  return res.status(500).json({ message: 'Unexpected server error.' });
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`Neural Academy API listening on port ${port}`));
