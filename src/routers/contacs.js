import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getContacts, getContactById } from '../controllers/contact.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContacts));

router.get('/contacts/:contactId', ctrlWrapper(getContactById));

export default router;
