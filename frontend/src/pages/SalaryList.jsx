import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Form from '../components/Form';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function SalaryList() {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEmployees();
    fetchSalaries();
  }, [page]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/employees', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEmployees(res.data.employees);
    } catch (error) {
      toast.error('Error fetching employees');
    }
  };

  const fetchSalaries = async () => {
    try {
      const url = user.role === 'employee' ? `/api/salaries?employee=${user.id}` : `/api/salaries?page=${page}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSalaries(res.data.salaries);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error('Error fetching salaries');
    }
  };

  const handleSubmit = async data => {
    try {
      if (formData) {
        await axios.put(`/api/salaries/${formData._id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.post('/api/salaries', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      fetchSalaries();
      setFormData(null);
      toast.success('Salary saved');
    } catch (error) {
      toast.error('Error saving salary');
    }
  };

  const handleEdit = salary => setFormData(salary);
  const handleDelete = async id => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/salaries/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        fetchSalaries();
        toast.success('Salary deleted');
      } catch (error) {
        toast.error('Error deleting salary');
      }
    }
  };

  const columns = [
    { key: 'employee.user.name', label: 'Employee' },
    { key: 'amount', label: 'Amount' },
    { key: 'paymentDate', label: 'Payment Date' },
    { key: 'bonus', label: 'Bonus' },
    { key: 'deductions', label: 'Deductions' },
  ];

  const fields = [
    { name: 'employee', label: 'Employee', type: 'select', required: true, options: employees.map(e => ({ value: e._id, label: e.user.name })) },
    { name: 'amount', label: 'Amount', type: 'number', required: true },
    { name: 'paymentDate', label: 'Payment Date', type: 'date', required: true },
    { name: 'bonus', label: 'Bonus', type: 'number' },
    { name: 'deductions', label: 'Deductions', type: 'number' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Salaries</h2>
      {user.role === 'admin' && <Form fields={fields} onSubmit={handleSubmit} defaultValues={formData} />}
      <Table data={salaries} columns={columns} onEdit={user.role === 'admin' ? handleEdit : null} onDelete={user.role === 'admin' ? handleDelete : null} />
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

export default SalaryList;