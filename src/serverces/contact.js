import { contactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async (
  { page, perPage, sortOrder = SORT_ORDER.ASC, sortBy = '_id' },
  userId,
) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactsCollection.find({ userId });

  const contactsCount = await contactsCollection
    .find({ userId })
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);
  return { data: contacts, ...paginationData };
};

export const findContactById = async (userId, contactId) => {
  console.log('I am in serveses');
  const contact = await contactsCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const updateContact = async (
  userId,
  contactId,
  playload,
  options = {},
) => {
  const rawResults = await contactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    { $set: playload },
    { new: true, includeResultMetadata: true, ...options },
  );

  if (!rawResults || !rawResults.value) return null;

  
  return {
    contact: rawResults.value,
    isNew: Boolean(rawResults?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId, userId) => {
  const contact = await contactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};

export const createContact = async (playload) => {
  const contact = await contactsCollection.create(playload);
  return contact;
};
