const updatePassword = require("../controllers/changePassword.controller");
module.exports = function (app) {
  app.post("/api/users/updatePassword", updatePassword);
};
