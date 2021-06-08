var axios = require('axios');
var data = JSON.stringify({
  "mobile": "8617882389"
});

var config = {
  method: 'post',
  url: 'https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP',
  headers: { 
    'Content-Type': 'application/json'
  },
  mode: "no-cors",
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
