"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _methodOverride = require("method-override");

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());
app.use((0, _cors2.default)());
app.use((0, _methodOverride2.default)());

var router = _express2.default.Router();

router.get('/', function (req, res) {
  res.send("Mauro Lord comandante!");
});

app.use(router);

app.listen(3000, function () {
  console.log("Node server running on http://localhost:3000");
});