const {
  createTicket,
  getAllTickets,
  getSingleTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/tickets.controller");
const multer = require("multer");
const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|mov|avi)$/)) {
      return cb(new Error("Only image and video files are allowed!"));
    }
    cb(null, true);
  },
});
module.exports = function (app) {
  app.post(
    "/api/users/create-ticket",
    upload.array("attachments", 10),
    createTicket
  );
  app.post(
    "/api/users/update-ticket",
    upload.array("attachments", 10),
    updateTicket
  );
};
