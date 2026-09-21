import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    track: {
      type: String,
      enum: ['school', 'secondary', 'senior', 'college'],
      default: 'secondary'
    },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 240 },
    phone: { type: String, default: '' },
    socials: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      leetcode: { type: String, default: '' },
      instagram: { type: String, default: '' },
      whatsapp: { type: String, default: '' }
    },
    preferences: {
      emailUpdates: { type: Boolean, default: true },
      lessonReminders: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
