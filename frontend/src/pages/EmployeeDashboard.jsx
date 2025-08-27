import { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeDashboard() {
  const [stats, setStats] = useState({ salaries: 0, leaves: 0, attendance: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [salaryRes, leaveRes, attendanceRes] = await Promise.all([
          axios.get('/api/salaries', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get('/api/leaves', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get('/api/attendance', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        ]);
        setStats({
          salaries: salaryRes.data.totalPages * 10,
          leaves: leaveRes.data.totalPages * 10,
          attendance: attendanceRes.data.totalPages * 10,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Employee Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="text-lg">Salaries</h3>
          <p className="text-2xl">{stats.salaries}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="text-lg">Leaves</h3>
          <p className="text-2xl">{stats.leaves}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="text-lg">Attendance Records</h3>
          <p className="text-2xl">{stats.attendance}</p>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;