import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-900 text-white w-64 h-screen p-4">
      <h2 className="text-lg mb-4">Menu</h2>
      <ul>
        {user.role === 'admin' ? (
          <>
            <li><Link to="/admin-dashboard" className="block py-2 hover:bg-gray-700">Dashboard</Link></li>
            <li><Link to="/departments" className="block py-2 hover:bg-gray-700">Departments</Link></li>
            <li><Link to="/employees" className="block py-2 hover:bg-gray-700">Employees</Link></li>
            <li><Link to="/salaries" className="block py-2 hover:bg-gray-700">Salaries</Link></li>
            <li><Link to="/leaves" className="block py-2 hover:bg-gray-700">Leaves</Link></li>
            <li><Link to="/attendance" className="block py-2 hover:bg-gray-700">Attendance</Link></li>
            <li><Link to="/profile" className="block py-2 hover:bg-gray-700">Profile</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/employee-dashboard" className="block py-2 hover:bg-gray-700">Dashboard</Link></li>
            <li><Link to="/salaries" className="block py-2 hover:bg-gray-700">Salaries</Link></li>
            <li><Link to="/leaves" className="block py-2 hover:bg-gray-700">Leaves</Link></li>
            <li><Link to="/attendance" className="block py-2 hover:bg-gray-700">Attendance</Link></li>
            <li><Link to="/profile" className="block py-2 hover:bg-gray-700">Profile</Link></li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;