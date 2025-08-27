import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function AttendanceList() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAttendance();
  }, [page]);

  const fetchAttendance = async () => {
    try {
      const url = user.role === 'employee' ? `/api/attendance?employee=${user.id}` : `/api/attendance?page=${page}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAttendance(res.data.attendance);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error('Error fetching attendance');
    }
  };

  const markAttendance = async status => {
    try {
      await axios.post('/api/attendance', {
        status,
        checkInTime: status !== 'absent' ? new Date() : null,
        checkOutTime: status === 'present' ? new Date() : null,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchAttendance();
      toast.success('Attendance marked');
    } catch (error) {
      toast.error('Error marking attendance');
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/attendance/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        fetchAttendance();
        toast.success('Attendance deleted');
      } catch (error) {
        toast.error('Error deleting attendance');
      }
    }
  };

  const columns = [
    { key: 'employee.user.name', label: 'Employee' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'checkInTime', label: 'Check-In' },
    { key: 'checkOutTime', label: 'Check-Out' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Attendance</h2>
      {user.role === 'employee' && (
        <div className="mb-4">
          <button
            onClick={() => markAttendance('present')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
          >
            Check In
          </button>
          <button
            onClick={() => markAttendance('present')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Check Out
          </button>
          <button
            onClick={() => markAttendance('absent')}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Mark Absent
          </button>
        </div>
      )}
      <Table data={attendance} columns={columns} onEdit={null} onDelete={user.role === 'admin' ? handleDelete : null} />
      <div className="mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 mx-1 ${page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default AttendanceList;