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
import { authenticate } from '../middlewares/authenticate.js';
const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContacts));

router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post(
  '/',
  validationBody(createContactSchema),
  ctrlWrapper(createNewContact),
);

router.patch(
  '/:contactId',
  isValidId,
  validationBody(updateCotactSchame),
  ctrlWrapper(patchContactController),
);

router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactbyId),
);

export default router;
