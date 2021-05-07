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

module.exports.AddSession = addSession;
