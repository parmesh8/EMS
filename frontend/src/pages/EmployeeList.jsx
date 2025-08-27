import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Form from '../components/Form';
import { ToastContainer, toast } from 'react-toastify';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, [page]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/api/departments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setDepartments(res.data.departments);
    } catch (error) {
      toast.error('Error fetching departments');
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`/api/employees?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEmployees(res.data.employees);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error('Error fetching employees');
    }
  };

  const handleSubmit = async data => {
    try {
      if (formData) {
        await axios.put(`/api/employees/${formData._id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.post('/api/employees', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      fetchEmployees();
      setFormData(null);
      toast.success('Employee saved');
    } catch (error) {
      toast.error('Error saving employee');
    }
  };

  const handleEdit = employee => setFormData(employee);
  const handleDelete = async id => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        fetchEmployees();
        toast.success('Employee deleted');
      } catch (error) {
        toast.error('Error deleting employee');
      }
    }
  };

  const columns = [
    { key: 'user.name', label: 'Name' },
    { key: 'user.email', label: 'Email' },
    { key: 'department.name', label: 'Department' },
    { key: 'position', label: 'Position' },
    { key: 'joinDate', label: 'Join Date' },
    { key: 'phone', label: 'Phone' },
  ];

  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: !formData },
    { name: 'department', label: 'Department', type: 'select', required: true, options: departments.map(d => ({ value: d._id, label: d.name })) },
    { name: 'position', label: 'Position', type: 'text', required: true },
    { name: 'joinDate', label: 'Join Date', type: 'date', required: true },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Employees</h2>
      <Form fields={fields} onSubmit={handleSubmit} defaultValues={formData} />
      <Table data={employees} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
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

export default EmployeeList;