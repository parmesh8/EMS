import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Form from '../components/Form';
import { ToastContainer, toast } from 'react-toastify';

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDepartments();
  }, [page]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`/api/departments?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setDepartments(res.data.departments);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error('Error fetching departments');
    }
  };

  const handleSubmit = async data => {
    try {
      if (formData) {
        await axios.put(`/api/departments/${formData._id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.post('/api/departments', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      fetchDepartments();
      setFormData(null);
      toast.success('Department saved');
    } catch (error) {
      toast.error('Error saving department');
    }
  };

  const handleEdit = department => setFormData(department);
  const handleDelete = async id => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/departments/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        fetchDepartments();
        toast.success('Department deleted');
      } catch (error) {
        toast.error('Error deleting department');
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
  ];

  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Departments</h2>
      <Form fields={fields} onSubmit={handleSubmit} defaultValues={formData} />
      <Table data={departments} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
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

export default DepartmentList;