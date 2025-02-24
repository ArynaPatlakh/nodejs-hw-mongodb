import { contactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';
export const getAllContacts = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactsCollection.find();

  const contactsCount = await contactsCollection
    .find()
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

export const findContactById = async (contactId) => {
  console.log("I am in serveses");
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
    contact: rawResults.value,
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
