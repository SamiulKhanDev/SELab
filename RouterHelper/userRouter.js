const express = require("express");
const router = express.Router();
const authenticationContoller = require("../Controller/AuthenticationUser-controller");
// const validateAdmin = require("../middleware/validateAdmin");
const validateUser = require("../middleware/validateUser");
const bookController = require("../Controller/Book-controller");
router.post("/signup", authenticationContoller.signUp);
router.post("/signin", authenticationContoller.signIn);
router.post("/getbook", validateUser, bookController.getBook);
router.post("/logout", authenticationContoller.logout);

module.exports = router;
