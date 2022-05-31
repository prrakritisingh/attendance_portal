const router = require("express").Router();
const userController = require("../controllers/user");

router.get("/", userController.handleHome);
router.get("/login", userController.getLogin);
router.get("/dashboard", userController.getDashboard);

// protected
router.get("/attendance", userController.getMarkAttendance);

// api
router.post("/api/v1/attendance", userController.postAttendancev1);
router.post("/api/v1/register", userController.postRegisterv1);

module.exports = router;