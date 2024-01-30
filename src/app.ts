import express from 'express';
import weatherController from './weather/controller.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use('/weather', weatherController);

export default app;
