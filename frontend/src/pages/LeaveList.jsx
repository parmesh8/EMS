import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Form from '../components/Form';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function LeaveList() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeaves();
  }, [page]);

  const fetchLeaves = async () => {
    try {
      const url = user.role === 'employee' ? `/api/leaves?employee=${user.id}` : `/api/leaves?page=${page}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setLeaves(res.data.leaves);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error('Error fetching leaves');
    }
  };

  const handleSubmit = async data => {
    try {
      if (formData) {
        await axios.put(`/api/leaves/${formData._id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.post('/api/leaves', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      fetchLeaves();
      setFormData(null);
      toast.success('Leave saved');
    } catch (error) {
      toast.error('Error saving leave');
    }
  };

  const handleEdit = leave => setFormData(leave);
  const handleDelete = async id => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/leaves/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        fetchLeaves();
        toast.success('Leave deleted');
      } catch (error) {
        toast.error('Error deleting leave');
      }
    }
  };

  const columns = [
    { key: 'employee.user.name', label: 'Employee' },
    { key: 'type', label: 'Type' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'status', label: 'Status' },
    { key: 'reason', label: 'Reason' },
  ];

  const fields = [
    { name: 'type', label: 'Type', type: 'select', required: true, options: [
      { value: 'sick', label: 'Sick' },
      { value: 'vacation', label: 'Vacation' },
      { value: 'other', label: 'Other' },
    ]},
    { name: 'startDate', label: 'Start Date', type: 'date', required: true },
    { name: 'endDate', label: 'End Date', type: 'date', required: true },
    { name: 'reason', label: 'Reason', type: 'text' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Leaves</h2>
      {user.role === 'employee' && <Form fields={fields} onSubmit={handleSubmit} defaultValues={formData} />}
      <Table data={leaves} columns={columns} onEdit={user.role === 'admin' ? handleEdit : null} onDelete={user.role === 'admin' ? handleDelete : null} />
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

export default LeaveList;