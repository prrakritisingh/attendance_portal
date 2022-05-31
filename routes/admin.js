const router = require("express").Router();
const adminController = require("../controllers/admin");
const authorization = require("../middlewares/authorization");

router.get("/login", adminController.getLogin);

router.get("/", authorization, adminController.handleHome);
router.get("/dashboard", authorization, adminController.getDashboard);

// api
router.get("/api/v1/logout", adminController.getLogoutv1);
router.post("/api/v1/login", adminController.postLoginv1);

router.get("/api/v1/members", authorization, adminController.getMembersv1);
router.get("/api/v1/attendance/:date", authorization, adminController.getAttendancev1);
router.get("/api/v2/attendance/:name", authorization, adminController.getAttendancev2);
router.get("/api/v1/download/:date", authorization, adminController.getDownloadv1);

module.exports = router;