import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [stats, setStats] = useState({ employees: 0, departments: 0, pendingLeaves: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, deptRes, leaveRes] = await Promise.all([
          axios.get('/api/employees', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get('/api/departments', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get('/api/leaves?status=pending', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        ]);
        setStats({
          employees: empRes.data.totalPages * 10,
          departments: deptRes.data.totalPages * 10,
          pendingLeaves: leaveRes.data.totalPages * 10,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="text-lg">Total Employees</h3>
          <p className="text-2xl">{stats.employees}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="text-lg">Total Departments</h3>
          <p className="text-2xl">{stats.departments}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="text-lg">Pending Leaves</h3>
          <p className="text-2xl">{stats.pendingLeaves}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;