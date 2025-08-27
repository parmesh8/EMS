import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const history = useHistory();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-xl">Employee Management System</h1>
      {user && (
        <div>
          <span className="mr-4">Welcome, {user.role}</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;