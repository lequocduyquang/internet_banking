const { BadRequestError } = require('@sgjobfit/common');
const models = require('../models');

const { Employee } = models;

const getAllEmployee = async (req, res, next) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).send({
      employees,
    });
  } catch (error) {
    next(new BadRequestError(`${error.message}`));
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const deleted = await Employee.destroy({
      where: { id: employeeId },
    });
    if (deleted) {
      res.status(204).send('Post deleted');
    }
  } catch (error) {
    next(new BadRequestError(`${error.message}`));
  }
};

module.exports = {
  getAllEmployee,
  deleteEmployee,
};
