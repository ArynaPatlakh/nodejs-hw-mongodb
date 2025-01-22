// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import { findContactById, getAllContacts } from './serverces/contact.js';

const PORT = Number(getEnvVar('PORT', 3000));

const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello',
    });
  });

  app.get('/contacts', async (req, res, next) => {
    try {
      const contacts = await getAllContacts();
      console.log(`Contact from DB: ${contacts}`);
      res.status(200).json({
        status: 200,
        message: 'Successfully found all contacts!',
        data: contacts,
      });
      next();
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch contacts',
        error: err.message,
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await findContactById(contactId);

      if (!contact) {
        res.status(400).json({
          message: 'Contact not found',
        });
      }
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch contacts',
        error: err.message,
      });
    }
  });

  app.use((err, req, res, next) => {
    res.status(400).json({
      message: 'Not found',
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
