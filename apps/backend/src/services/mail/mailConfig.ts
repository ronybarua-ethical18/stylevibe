import { ResendTransport } from '@documenso/nodemailer-resend';
import { createTransport } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

import config from '../../config';

import handlebarOptions from './viewEngine';

// Create Resend transport
const transporter = createTransport(
  ResendTransport.makeTransport({
    apiKey: config.resend_api_key || '',
  }),
);

// Use compile instead of use for setting up handlebars
transporter.use('compile', hbs(handlebarOptions));

export default transporter;
