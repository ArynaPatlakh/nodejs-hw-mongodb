import { contactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await contactsCollection.find();
  console.log(contacts);
  return contacts;
};
export const findContactById = async (contactId) => {
  const contact = await contactsCollection.findById(contactId);
  return contact;
};
