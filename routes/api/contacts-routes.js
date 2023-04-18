const express = require('express');
const controller = require("../../controllers/contacts-controllers");
const router = express.Router();
const { isValidId, authenticate } = require("../../middlewares");
const { validateBody } = require("../../utils");
const { schemas } = require("../../models/contact");

router.get('/', authenticate, controller.getAllContacts);

router.get('/:contactId', authenticate, isValidId, controller.getContactById);

router.post('/', authenticate, validateBody(schemas.addSchema), controller.addContact);

router.patch('/:contactId/favorite', authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), controller.updateStatusContact);

router.delete('/:contactId', authenticate, isValidId, controller.deleteContactById);

router.put("/:contactId", authenticate, isValidId, validateBody(schemas.addSchema), controller.updateContactById);

module.exports = router;
