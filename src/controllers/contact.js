import { contactsCollection } from '../db/models/contacts.js';
import {
  getAllContacts,
  findContactById,
  updateContact,
  deleteContact,
  createContact,
} from '../serverces/contact.js';
import createHttpError from 'http-errors';

export const getContacts = async (req, res, next) => {
  const contacts = await getAllContacts();
  //   console.log(`Contact from DB: ${contacts}`);
  res.status(200).json({
    status: 200,
    message: 'Successfully found all contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await findContactById(contactId);

  if (!contact) {
    throw createHttpError(400, 'Contact not found!');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createNewContact = async (req, res) => {
  const {name, phoneNumber, contactType} = await createContact(req.body);
  if (!name || !phoneNumber || !contactType) {
    return res.status(400).json({ message: 'Name,phoneNumber and contactType are required' });
  }
  const newContact = new contactsCollection({name, phoneNumber, contactType});
  await newContact.save();

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { studentId } = req.params;
  console.log(req.body);
  const result = await updateContact(studentId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    massage: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactbyId = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
