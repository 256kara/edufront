import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../api";

const useClasses = () => {
  const { user } = useContext(AuthContext);
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchClassesData = useCallback(async () => {
    if (!user?.school_name) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest.get(
        `/api/admin/students/${user.school_name}?page=1&limit=1000`,
      );
      const students = res.data.students || [];
      const classCounts = {};
      students.forEach((student) => {
        const cls = student.classLevel || student.class;
        if (cls) {
          classCounts[cls] = (classCounts[cls] || 0) + 1;
        }
      });
      const classes = Object.keys(classCounts)
        .sort()
        .map((cls) => ({ name: cls, studentCount: classCounts[cls] }));
      setClassesData(classes);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch classes data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchClassesData();
  }, [fetchClassesData]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    classesData,
    loading,
    error,
    setError,
  };
};

export default useClasses;
