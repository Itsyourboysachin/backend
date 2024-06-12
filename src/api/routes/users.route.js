const controller = require("../controllers/users.controller");
const multer = require("multer");

const upload = multer({ dest: "./uploads/" });
module.exports = function (app) {
  app.post("/api/users/signup", controller.signup);
  app.post("/api/users/signin", controller.signin);
  app.put(
    "/api/users/update",
    upload.single("profilePhoto"),
    controller.update
  );
  app.get("/api/users/find-by-id", controller.findById);
  app.delete("/api/users/delete-by-id", controller.deleteById);
  app.get("/api/users/find-all", controller.findAll);
  app.post("/api/users/reset_password", controller.reset_password);
  app.post("/api/users/forgotPassword", controller.forgotPassword);
  app.get("/verify", controller.verifymail);
};
