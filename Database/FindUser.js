const User = require("../Schema/User");

const FindUser = (email) => {
  return new Promise((resolve, reject) => {
    let query = User.find({ Email: email }).select({
      _id: 0,
      __v: 0,
      Email: 0,
    });
    query.exec((err, user) => {
      if (err) {
        return reject({ status: "Find User query could not be performed", error: err });
      }
      return resolve({ status: "Find user query performed", data: user[0] });
    });
  });
};
module.exports.FindUser = FindUser;
