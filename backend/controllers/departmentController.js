const Department = require('../models/Department');
const Employee = require('../models/Employee');

exports.getDepartments = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'name', search = '' } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const departments = await Department.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Department.countDocuments(query);
    res.json({ departments, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    await Employee.updateMany({ department: req.params.id }, { $unset: { department: 1 } });
    await department.remove();
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};