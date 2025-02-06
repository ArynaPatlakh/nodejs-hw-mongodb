import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContacts,
  getContactById,
  patchContactController,
  deleteContactbyId,
  createNewContact,
} from '../controllers/contact.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContacts));

router.get('/contacts/:contactId', ctrlWrapper(getContactById));

router.post('/contacts', ctrlWrapper(createNewContact));

router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactbyId));
export default router;
