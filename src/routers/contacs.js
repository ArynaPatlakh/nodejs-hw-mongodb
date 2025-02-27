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
const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContacts));

contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContactById));

contactsRouter.post(
  '/',
  validationBody(createContactSchema),
  ctrlWrapper(createNewContact),
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  validationBody(updateCotactSchame),
  ctrlWrapper(patchContactController),
);

contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContactbyId));

export default contactsRouter;
