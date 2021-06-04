const User = require("../Schema/User");

const FindUser = (email) => {
  return new Promise((resolve, reject) => {
    let query = User.find({ Email: email }).select({
      _id: 0,
      __v: 0,
    });
    query.exec((err, user) => {
      if (err) {
        return reject({
          status: "Find User query could not be performed",
          error: err,
          data: null,
        });
      }
      return resolve({ status: "Find user query performed", data: user[0] });
    });
  });
};
const AddUser = async (data) => {
  let newUser = new User(data);
  try {
    await newUser.save();
    return { status: "Saved Successfully", data: data, error: null };
  } catch (error) {
    return { status: "Could not Save", data: data, error: error };
  }
};
const UpdateUser = async (Email, Password) => {
  console.log("Data to be updated= ", Email, Password);
  User.findOneAndUpdate(
    { Email: Email },
    { $set: { Password: Password } },
    { useFindAndModify: false, new: true },
    (err, data) => {
      console.log("error= ", err, "data= ", data);
      if (err) {
        return { status: "Could not Save", data: data, error: err };
      } else {
        return { status: "Saved Successfully", data: data, error: null };
      }
    }
  );
};
module.exports = {
  FindUser: FindUser,
  AddUser: AddUser,
  ResetPassword: UpdateUser,
};
