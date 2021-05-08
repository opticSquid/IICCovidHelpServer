const activeUser = require("../Schema/Activeuser");
const FindSession = (email) => {
    return new Promise((resolve, reject) => {
      let query = activeUser.find({ Email: email }).select({
        _id: 0,
        __v: 0,
        Refresh_Token: 0,
      });
      query.exec((err, user) => {
        if (err) {
          return reject({ status: "Find active Session query could not be performed", error: err });
        }
        return resolve({ status: "Find active session query performed", data: user[0] });
      });
    });
  };
  module.exports.FindSession = FindSession;
  