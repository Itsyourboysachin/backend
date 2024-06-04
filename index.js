express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./src/config/db.config.js");

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));

// routes
require("./src/api/routes/users.route.js")(app);
require("./src/api/routes/tickets.route.js")(app);
require("./src/api/routes/changePassword.route.js")(app);

let port = process.env.PORT || 7007;
app.listen(port, () => {
  console.log(`server app listening on port http://localhost:${port}`);
});
