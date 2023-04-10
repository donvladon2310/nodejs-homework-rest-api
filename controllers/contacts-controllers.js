const { Contact } = require('../models/contact')
const HttpError = require("../helpers/HttpError");

const { controllerWrapper } = require("../utils");


const getAllContacts = async (req, res) => {
    const result = await Contact.find();
    res.json(result);
};

const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
        throw new HttpError(404, 'Not found')
    }
    res.json(result);
};

const addContact = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
}

const deleteContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
        throw new HttpError(404, 'Not found')
    }
    res.json({
        message: "contact deleted"
    })
};

const updateContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
    if (!result) {
        throw new HttpError(404, 'Not found')
    }
    res.json(result);
};

const updateStatusContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
    if (!result) {
        throw new HttpError(404, 'Not found')
    }
    res.json(result);
};


module.exports = {
    getAllContacts: controllerWrapper(getAllContacts),
    getContactById: controllerWrapper(getContactById),
    addContact: controllerWrapper(addContact),
    deleteContactById: controllerWrapper(deleteContactById),
    updateContactById: controllerWrapper(updateContactById),
    updateStatusContact: controllerWrapper(updateStatusContact),
}