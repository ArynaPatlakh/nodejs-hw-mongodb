import { contactsCollection } from '../db/models/contacts.js';
import {
  getAllContacts,
  findContactById,
  updateContact,
  deleteContact,
  createContact,
} from '../serverces/contact.js';
import createHttpError from 'http-errors';
import {
  createContactSchema,
  updateCotactSchame,
} from '../validation/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';


export const getContacts = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
  });

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
  const { name, phoneNumber, contactType } = await createContact(req.body);

  const newContact = new contactsCollection({ name, phoneNumber, contactType });
  const validateResults = createContactSchema.validate(newContact);
  if (validateResults.error) {
    throw createHttpError(400, `${validateResults.error.message}`);
  }
  await newContact.save();

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  console.log(req.body);
  const result = await updateContact(contactId, req.body);
  const validateResults = updateCotactSchame.validate(result);
  if (validateResults.error) {
    throw createHttpError(400, `${validateResults.error.message}`);
  }
  if (!result) {
    throw createHttpError(404, `Contact with id ${contactId} was not found`);
  }

  res.status(200).json({
    status: 200,
    massage: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactbyId = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(400, 'Contact not found');
  }

  res.status(204).send();
};
