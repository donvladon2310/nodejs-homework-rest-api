const express = require('express');
const controller = require("../../controllers/contacts-controllers");
const router = express.Router();
const { validateBody } = require("../../utils");
const { schemas } = require("../../models/contact");

router.get('/', controller.getAllContacts);

router.get('/:contactId', controller.getContactById);

router.post('/', validateBody(schemas.addSchema), controller.addContact);

router.patch('/:contactId/favorite', validateBody(schemas.updateFavoriteSchema), controller.updateStatusContact);

router.delete('/:contactId', controller.deleteContactById);

router.put("/:contactId", validateBody(schemas.addSchema), controller.updateContactById);

module.exports = router;
