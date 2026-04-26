const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edupulse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  status: { type: String, required: true, enum: ['present', 'absent', 'late'] },
  date: { type: Date, required: true },
  classLevel: { type: String, required: true },
  school_name: { type: String, required: true },
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

// Routes
app.post('/api/admin/attendance', async (req, res) => {
  try {
    const { attendance } = req.body;
    if (!Array.isArray(attendance)) {
      return res.status(400).json({ message: 'Attendance must be an array' });
    }

    // Delete existing attendance for the date and class
    const { date, classLevel, school_name } = attendance[0];
    await Attendance.deleteMany({ date, classLevel, school_name });

    // Insert new attendance
    const savedAttendance = await Attendance.insertMany(attendance);
    res.status(201).json({ message: 'Attendance saved successfully', attendance: savedAttendance });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save attendance', error: error.message });
  }
});

app.get('/api/admin/attendance/:school_name', async (req, res) => {
  try {
    const { school_name } = req.params;
    const { date, class } = req.query;
    const query = { school_name };
    if (date) query.date = new Date(date);
    if (class) query.classLevel = class;

    const attendance = await Attendance.find(query);
    res.json({ attendance });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance', error: error.message });
  }
});

// Placeholder for students route (assuming it exists)
app.get('/api/admin/students/:school_name', async (req, res) => {
  // This would need a Student model, but for now, return mock data
  res.json({ students: [] });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});