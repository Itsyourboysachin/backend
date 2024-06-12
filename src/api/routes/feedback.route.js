const ticketFeedback = require("../controllers/feeback.controller");
module.exports = function (app) {
  app.post("/api/ticket/feedback", ticketFeedback);
};
