import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import DepartmentList from './pages/DepartmentList';
import EmployeeList from './pages/EmployeeList';
import SalaryList from './pages/SalaryList';
import LeaveList from './pages/LeaveList';
import AttendanceList from './pages/AttendanceList';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="flex">
        {user && <Sidebar />}
        <div className="flex-1">
          {user && <Navbar />}
          <Switch>
            <Route exact path="/login" component={Login} />
            {user?.role === 'admin' ? (
              <>
                <Route exact path="/admin-dashboard" component={AdminDashboard} />
                <Route exact path="/departments" component={DepartmentList} />
                <Route exact path="/employees" component={EmployeeList} />
                <Route exact path="/salaries" component={SalaryList} />
                <Route exact path="/leaves" component={LeaveList} />
                <Route exact path="/attendance" component={AttendanceList} />
                <Route exact path="/profile" component={Profile} />
                <Redirect to="/admin-dashboard" />
              </>
            ) : user?.role === 'employee' ? (
              <>
                <Route exact path="/employee-dashboard" component={EmployeeDashboard} />
                <Route exact path="/salaries" component={SalaryList} />
                <Route exact path="/leaves" component={LeaveList} />
                <Route exact path="/attendance" component={AttendanceList} />
                <Route exact path="/profile" component={Profile} />
                <Redirect to="/employee-dashboard" />
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;