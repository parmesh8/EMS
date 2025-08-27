import { useState, useEffect } from 'react';
import axios from 'axios';
import Form from '../components/Form';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/employees?employee=${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfile(res.data.employees[0]);
      } catch (error) {
        toast.error('Error fetching profile');
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async data => {
    try {
      await axios.put(`/api/employees/${profile._id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProfile({ ...profile, ...data });
      toast.success('Profile updated');
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Profile</h2>
      <Form fields={fields} onSubmit={handleSubmit} defaultValues={profile} />
      <ToastContainer />
    </div>
  );
}

export default Profile;