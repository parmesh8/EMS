const Leave = require('../models/Leave');

exports.getLeaves = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'startDate', employee = '', status = '' } = req.query;
    const query = {};
    if (employee) query.employee = employee;
    if (status) query.status = status;

    const leaves = await Leave.find(query)
      .populate('employee', 'user')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Leave.countDocuments(query);
    res.json({ leaves, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createLeave = async (req, res) => {
  try {
    const leave = new Leave({ ...req.body, employee: req.user.id });
    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    res.json({ message: 'Leave deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};