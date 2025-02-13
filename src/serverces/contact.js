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
export const updateContact = async (contactId, playload, options = {}) => {
  const rawResults = await contactsCollection.findOneAndUpdate(
    { _id: contactId },
    playload,
    { new: true, includeResultMetadata: true, ...options },
  );

  if (!rawResults || !rawResults.value) return null;

  return {
    student: rawResults.value,
    isNew: Boolean(rawResults?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId) => {
  const contact = await contactsCollection.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await contactsCollection.create(payload);
  return contact;
};
