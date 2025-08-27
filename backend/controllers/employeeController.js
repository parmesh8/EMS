const Employee = require('../models/Employee');
const User = require('../models/User');
const Salary = require('../models/Salary');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');

exports.getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'name', search = '', department = '' } = req.query;
    const query = {};
    if (search) query['user.name'] = { $regex: search, $options: 'i' };
    if (department) query.department = department;

    const employees = await Employee.find(query)
      .populate('user', 'name email')
      .populate('department', 'name')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Employee.countDocuments(query);
    res.json({ employees, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, department, position, joinDate, phone, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: 'employee', department });
    await user.save();

    const employee = new Employee({ user: user._id, department, position, joinDate, phone, address });
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('user', 'name email')
      .populate('department', 'name');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await Salary.deleteMany({ employee: req.params.id });
    await Leave.deleteMany({ employee: req.params.id });
    await Attendance.deleteMany({ employee: req.params.id });
    await User.findByIdAndDelete(employee.user);
    await employee.remove();
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};