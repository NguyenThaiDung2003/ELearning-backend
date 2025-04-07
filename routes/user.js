const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");
const router = require("express").Router();

router.get("/profile", middlewareController.verifyToken, userController.getUserProfile);

module.exports = router;
