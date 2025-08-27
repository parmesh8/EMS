const Attendance = require('../models/Attendance');

exports.getAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'date', employee = '', date = '' } = req.query;
    const query = {};
    if (employee) query.employee = employee;
    if (date) query.date = new Date(date);

    const attendance = await Attendance.find(query)
      .populate('employee', 'user')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Attendance.countDocuments(query);
    res.json({ attendance, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { status, checkInTime, checkOutTime } = req.body;
    const attendance = new Attendance({
      employee: req.user.id,
      date: new Date(),
      status,
      checkInTime: status === 'present' || status === 'late' ? checkInTime : null,
      checkOutTime: status === 'present' ? checkOutTime : null,
    });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
    res.json({ message: 'Attendance deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};