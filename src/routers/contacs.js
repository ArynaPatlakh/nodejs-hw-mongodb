import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContacts,
  getContactById,
  patchContactController,
  deleteContactbyId,
  createNewContact,
} from '../controllers/contact.js';
import { validationBody } from '../middlewares/validation.js';
import {
  createContactSchema,
  updateCotactSchame,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidID.js';
const router = Router();

router.get('/contacts', ctrlWrapper(getContacts));

router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactById));

router.post(
  '/contacts',
  validationBody(createContactSchema),
  ctrlWrapper(createNewContact),
);

router.patch(
  '/contacts/:contactId',
  isValidId,
  validationBody(updateCotactSchame),
  ctrlWrapper(patchContactController),
);

router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactbyId),
);
export default router;
