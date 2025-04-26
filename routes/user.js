const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");
const router = require("express").Router();

router.get("/profile", middlewareController.verifyToken, userController.getUserProfile);
router.put("/profile", middlewareController.verifyToken, userController.updateUserProfile);

module.exports = router;
