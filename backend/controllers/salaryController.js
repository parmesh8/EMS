const Salary = require('../models/Salary');

exports.getSalaries = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'paymentDate', employee = '' } = req.query;
    const query = employee ? { employee } : {};
    const salaries = await Salary.find(query)
      .populate('employee', 'user')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Salary.countDocuments(query);
    res.json({ salaries, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createSalary = async (req, res) => {
  try {
    const salary = new Salary(req.body);
    await salary.save();
    res.status(201).json(salary);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSalary = async (req, res) => {
  try {
    const salary = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!salary) return res.status(404).json({ message: 'Salary not found' });
    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findByIdAndDelete(req.params.id);
    if (!salary) return res.status(404).json({ message: 'Salary not found' });
    res.json({ message: 'Salary deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};