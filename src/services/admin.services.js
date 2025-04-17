const { Admin } = require("../db/models/admin.models");

const createUser = async (userData) => {
  return await Admin.create(userData);
};

const emailExistsAll = async (email) => {
  return await Admin.findOne({
    email,
  });
};

const getUserById = async (id) => {
  return await Admin.findById(id);
};

const updateUserById = async (id, updateData) => {
  return await Admin.update(updateData, { where: { id } });
};

const deleteUserById = async (id) => {
  return await Admin.destroy({ where: { id } });
};

const getUserByEmail = async (email) => {
  return await Admin.findOne({ where: { email } });
};

module.exports = {
  createUser,
  emailExistsAll,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByEmail,
};
