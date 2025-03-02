// import { contactsCollection } from '../db/models/contacts.js';
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
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { CLOUDINARY } from '../constants/index.js';

export const getContacts = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const contacts = await getAllContacts(
    {
      page,
      perPage,
      sortBy,
      sortOrder,
    },
    req.user._id,
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully found all contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  if (!req.user || !req.user._id) {
    throw createHttpError(401, 'Unauthorized');
  }
  const contact = await findContactById(req.user._id, contactId);

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
  const { name, phoneNumber, contactType } = req.body;
  const photo = req.file;

  let photoUrl;
  if (photo) {
    if (getEnvVar(CLOUDINARY.ENABLE_CLOUDINARY) === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  if (!req.user || !req.user._id) {
    throw createHttpError(401, 'Unauthorized');
  }
  const newContact = {
    userId: req.user._id,
    name,
    phoneNumber,
    contactType,
    photo: photoUrl,
  };

  console.log('📌 newContact перед валидацией:', newContact);
  const validateResults = createContactSchema.validate(newContact);
  if (validateResults.error) {
    throw createHttpError(400, `${validateResults.error.message}`);
  }

  console.log('✅ Валидация прошла, создаем контакт...');
  const savedContact = await createContact(newContact);

  await savedContact.save();

  console.log('✅ Контакт создан:', savedContact);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: savedContact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photos = req.file;
  let photoUrl;

  if (!req.user || !req.user._id) {
    throw createHttpError(401, 'Unauthorized');
  }

  if (photos) {
    if (getEnvVar(CLOUDINARY.ENABLE_CLOUDINARY) === 'true') {
      photoUrl = await saveFileToCloudinary(photos);
    } else {
      photoUrl = await saveFileToUploadDir(photos);
    }
  }
  const updatedData = { ...req.body };
  if (photoUrl) {
    updatedData.photo = photoUrl;
  }

  const result = await updateContact(req.user._id, contactId, updatedData);
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
  if (!req.user || !req.user._id) {
    throw createHttpError(401, 'Unauthorized');
  }

  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(400, 'Contact not found');
  }

  res.status(204).send();
};
