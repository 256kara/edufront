import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api";

const useAttendance = (user) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedClass, setSelectedClass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attendanceData, setAttendanceData] = useState({});

  const fetchStudents = useCallback(async () => {
    if (!user?.school_name || !selectedClass) return;

    try {
      const res = await apiRequest.get(
        `http://localhost:5000/api/admin/students/${user.school_name}?class=${selectedClass}&page=1&limit=1000`,
      );
      setStudents(res.data.students || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch students");
    }
  }, [user?.school_name, selectedClass]);

  const fetchAttendanceRecords = useCallback(async () => {
    if (!user?.school_name || !selectedClass) return;

    try {
      const res = await apiRequest.get(
        `http://localhost:5000/api/admin/attendance/${user.school_name}?date=${selectedDate}&class=${selectedClass}`,
      );
      setAttendanceRecords(res.data.attendance || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch attendance records",
      );
    }
  }, [user?.school_name, selectedDate, selectedClass]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass, fetchStudents]);

  useEffect(() => {
    if (selectedDate && selectedClass) {
      fetchAttendanceRecords();
    }
  }, [selectedDate, selectedClass, fetchAttendanceRecords]);

  useEffect(() => {
    if (students.length > 0) {
      const initialAttendance = {};
      students.forEach((student) => {
        const existingRecord = attendanceRecords.find(
          (record) => record.studentId === student._id,
        );
        initialAttendance[student._id] = existingRecord
          ? existingRecord.status
          : "present";
      });
      setAttendanceData(initialAttendance);
    }
  }, [students, attendanceRecords]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      const attendanceArray = Object.entries(attendanceData).map(
        ([studentId, status]) => ({
          studentId,
          status,
          date: selectedDate,
          classLevel: selectedClass,
          school_name: user?.school_name,
        }),
      );

      await apiRequest.post("http://localhost:5000/api/admin/attendance", {
        attendance: attendanceArray,
      });

      setSuccess("Attendance saved successfully!");
      fetchAttendanceRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save attendance");
    }
  };

  return {
    attendanceRecords,
    students,
    selectedDate,
    setSelectedDate,
    selectedClass,
    setSelectedClass,
    error,
    setError,
    success,
    setSuccess,
    attendanceData,
    handleAttendanceChange,
    handleSaveAttendance,
  };
};

export default useAttendance;
