import express from "express";
const app = express();
import connectDB from "./Loaders/db";
import Users from "./models/Users";
const schedule = require("node-schedule");
const admin = require('firebase-admin');
const rule = new schedule.RecurrenceRule();

let serviceAccount = require('../bium-sever-firebase-adminsdk-y6tzj-9f976cbf9b.json'); 
rule.tz = "Asia/Seoul";
rule.hour = 20;
rule.minute = 47;
rule.second = 10;

// Connect Database
connectDB();

app.use(express.json());

// Define Routes
app.use("/users", require("./api/users"));
app.use("/categories", require("./api/categories"));
app.use("/writings", require("./api/writings"));
app.use("/rewards", require("./api/rewards"));
app.use("/presents", require("./api/presents"));
app.use("/pushtokens",require("./api/pushtokens"));






// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app // [5]
  .listen(5000, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: 5000 🛡️
    ################################################
  `);
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
