const healthCentre = require("../Schema/HealthCentre");

const addCenter = async (data) => {
  // let newCentre = new healthCentre(data);
  const centre = await healthCentre.findOneAndUpdate(
    { uid: data.uid },
    { $set: data },
    { upsert: true, new: true, useFindAndModify: false }
  );
  return centre;
};

const getNearbyCentres = (location, radius, sortBy) => {
  return new Promise(function (resolve, reject) {
    let query = healthCentre
      .find({
        "Address.Location": {
          $near: {
            $geometry: location,
            $maxDistance: parseInt(radius) * 1000,
            $minDistance: 0,
          },
        },
      })
      .select({ _id: 0, __v: 0 });
    switch (sortBy) {
      case "Oxygen":
        query.sort({ Oxygen: -1 }).exec(function (err, HealthCentres) {
          if (err) {
            return reject({ err: "Error while fetching centres" });
          }
          return resolve(HealthCentres);
        });
        break;
      case "Doctor":
        query.sort({ Doctors: -1 }).exec(function (err, HealthCentres) {
          if (err) {
            return reject({ err: "Error while fetching centres" });
          }
          return resolve(HealthCentres);
        });
        break;
      case "Normal Bed":
        query.sort({ "Beds.Normal": -1 }).exec(function (err, HealthCentres) {
          if (err) {
            return reject({ err: "Error while fetching centres" });
          }
          return resolve(HealthCentres);
        });
        break;
      case "ICU Bed":
        query.sort({ "Beds.ICU": -1 }).exec(function (err, HealthCentres) {
          if (err) {
            return reject({ err: "Error while fetching centres" });
          }
          return resolve(HealthCentres);
        });
        break;
      case "Vaccine":
        query
          .sort({ "CovidVaccines.Quantity": -1 })
          .exec(function (err, HealthCentres) {
            if (err) {
              return reject({ err: "Error while fetching centres" });
            }
            return resolve(HealthCentres);
          });
        break;
      default:
        query.exec(function (err, HealthCentres) {
          if (err) {
            return reject({ err: "Error while fetching centres" });
          }
          return resolve(HealthCentres);
        });
    }
  });
};

const checkforExistingFacility = (loc) => {
  // Check if a facility exists in the given
  return new Promise((resolve, reject) => {
    healthCentre.find({ "Address.Location": loc }).exec((err, facility) => {
      // If some error occoured
      if (err)
        reject({
          status: "Finding existing health centre query cannot be performed",
          facility: null,
          error: err,
        });
      else {
        // If no facility was found in the given location
        if (facility.length === 0) {
          return resolve({
            status: "New Facility can be Added in this location",
            facility: null,
            error: null,
          });
        } else {
          // If an existing facility was found
          return reject({
            status: "An existing facility was found in this location",
            facility: facility,
            error: null,
          });
        }
      }
    });
  });
};

module.exports = {
  AddCenter: addCenter,
  GetNearbyCenter: getNearbyCentres,
  checkExisting: checkforExistingFacility,
};
