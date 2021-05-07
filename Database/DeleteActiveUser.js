const ActiveUser = require("../Schema/Activeuser");

const DeleteUser = (email) => {
  return new Promise((resolve, reject) => {
    ActiveUser.remove({ Email: email }, (err, user) => {
      if (err) {
        return reject({
          status: "User Session could not be deleted from DB",
          error: err,
        });
      }
      return resolve({ status: "User Logged out", data: user });
    });
  });
};
module.exports.DeleteUser = DeleteUser;
