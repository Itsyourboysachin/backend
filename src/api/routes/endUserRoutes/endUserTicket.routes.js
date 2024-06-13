const {
  createTicket,
  getAllTickets,
  getSingleTicket,
  UpdateTicket,
  deleteTicket,
  searchTickets,
  ticketFeedback,
} = require("../../controllers/endUserTickets");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: "attachments",
    };
  },
});

const upload = multer({ storage });

module.exports = function (app) {
  app.post(
    "/api/end-user/submit-ticket",
    upload.array("attachments", 10),
    createTicket
  );
  app.post(
    "/api/end-users/submit-ticket/draft",
    upload.array("attachments", 10),
    createTicket
  );
  app.get("/api/end-user/get-single-ticket", getSingleTicket);
  app.get("/api/end-user/get-all-ticket", getAllTickets);
  app.get("/api/end-user/get-searched-ticket", searchTickets);
  app.post(
    "/api/end-user/update-ticket",
    upload.array("attachments", 10),
    UpdateTicket
  );
  app.put("/api/end-user/submit-feedback", ticketFeedback);
  app.delete("/api/end-user/delete-ticket", deleteTicket);
};
