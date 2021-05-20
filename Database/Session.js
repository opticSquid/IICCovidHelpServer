const activeUser = require("../Schema/Activeuser");

const addSession = (data) => {
  return new Promise((resolve, reject) => {
    let newSession = new activeUser(data);
    newSession.save((err) => {
      if (err) {
        return reject({ status: "Session coluld not be started", error: err });
      }
      return resolve({
        status: "Session started Successfully",
        data: data,
        error: null,
      });
    });
  });
};

const FindSession = (email) => {
  return new Promise((resolve, reject) => {
    let query = activeUser.find({ Email: email }).select({
      _id: 0,
      __v: 0,
      Refresh_Token: 0,
    });
    query.exec((err, user) => {
      if (err) {
        return reject({
          status: "Find active Session query could not be performed",
          error: err,
        });
      }
      return resolve({
        status: "Find active session query performed",
        data: user[0],
      });
    });
  });
};

const DeleteUser = (email) => {
  return new Promise((resolve, reject) => {
    activeUser.deleteOne({ Email: email }, (err, user) => {
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

module.exports = {
  AddSession: addSession,
  FindSession: FindSession,
  DeleteUser: DeleteUser,
};
