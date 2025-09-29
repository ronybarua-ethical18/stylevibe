import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

import config from '../../config';

import handlebarOptions from './viewEngine';

// mail sender
const transporterOptions = {
  host: config.smtp_host,
  port: Number(config.smtp_port),
  auth: {
    user: config.smtp_user,
    pass: config.smtp_password,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 20000,
};

const transporter: nodemailer.Transporter =
  nodemailer.createTransport(transporterOptions);

// Use compile instead of use for setting up handlebars
transporter.use('compile', hbs(handlebarOptions));

export default transporter;
