const express = require('express');
const bodyParser = require('body-parser');
const profileController = require('./controllers/profile');

const app = express();
const port = process.env.port || 3000;
const router = express.Router();

app.use(express.bodyParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use("/", router);

router.route('/')
      .post(profileController.postProfile);

router.route('/profile')
      .get(profileController.getProfile)
      .post(profileController.postProfile);

module.exports = app;
//app.listen(port);

console.log("server started...");