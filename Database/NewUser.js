const User = require("../Schema/User");

const AddUser = async (data) => {
  let newUser = new User(data);
  try {
    await newUser.save();
    return { status: "Saved Successfully", data: data, error: null };
  } catch (error) {
    return { status: "Could not Save", data: data, error: error };
  }
};
module.exports.AddUser = AddUser;