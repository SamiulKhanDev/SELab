const express = require("express");
const router = express.Router();
const validateUniqueId = require("../middleware/validateUniqueId");
const authenticationContoller = require("../Controller/AuthentiationAdmin-controller");
const validateAdmin = require("../middleware/validateAdmin");
const bookController = require("../Controller/Book-controller");

router.post("/signup", validateUniqueId, authenticationContoller.signUp);
router.post("/signin", authenticationContoller.signIn);
router.post("/addbook", validateAdmin, bookController.uploadBook);
router.post("/deletebook", validateAdmin, bookController.deleteBook);
router.post("/returnbook", validateAdmin, bookController.returnBook);
router.get("/logout", validateAdmin, authenticationContoller.logout);

module.exports = router;
