import { getAllContacts, findContactById } from '../serverces/contact.js';
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
