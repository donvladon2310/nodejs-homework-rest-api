const express = require("express");

const controller = require("../../controllers/auth-controllers");

const { authenticate, upload } = require("../../middlewares");

const { validateBody } = require("../../utils");

const { schemas } = require("../../utils/authValidationSchemas");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), controller.register);

router.post("/login", validateBody(schemas.loginSchema), controller.login);

router.get("/current", authenticate, controller.getCurrent);

router.post("/logout", authenticate, controller.logout);

router.patch("/users", authenticate, validateBody(schemas.subscriptionSchema), controller.updateUserSubscription);

router.patch("/users/avatars", authenticate, upload.single("avatar"), controller.updateAvatar)

module.exports = router;