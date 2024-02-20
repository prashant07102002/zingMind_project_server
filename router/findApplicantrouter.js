const express = require("express");
const { findApplicant } = require("../controller/findApplicantController");
const Router = express.Router();
Router.get("/findApplicant", findApplicant);
module.exports = Router;
