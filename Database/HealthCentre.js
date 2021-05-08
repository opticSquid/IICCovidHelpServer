const healthCentre = require("../Schema/HealthCentre");

const addCenter = (data) =>{
    return new Promise((resolve,reject)=>{
        let newCentre = new healthCentre(data);
        newCentre.save((err) => {
            if (err) {
              return reject({ status: "New health Centre could not be added", error: err });
            }
            return resolve({
              status: "New Health Centre added Successfully",
              data: data,
              error: null,
            });
          });
    })
}
module.exports.AddCenter = addCenter; 