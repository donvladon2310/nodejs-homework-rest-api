const express = require("express");

const controller = require("../../controllers/auth-controllers");

const { authenticate } = require("../../middlewares");

const { validateBody } = require("../../utils");
const { schemas } = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), controller.register);

router.post("/login", validateBody(schemas.loginSchema), controller.login);

router.get("/current", authenticate, controller.getCurrent);

router.post("/logout", authenticate, controller.logout);

router.patch("/users", authenticate, controller.updateUserSubscription)

module.exports = router;