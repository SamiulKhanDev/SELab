const express = require("express");
const router = express.Router();
const validateSuperUser = require("./middleware/validateSuperUser");

router.use(
  "/superuser/:id",
  validateSuperUser,
  require("./RouterHelper/superUserRouter")
);

router.use("/admin", require("./RouterHelper/adminRouter"));
router.use("/user", require("./RouterHelper/userRouter"));

module.exports = router;
