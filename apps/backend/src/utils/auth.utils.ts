/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../config';
import sendEmail from '../services/mail/sendMail';

export const sendMailWithToken = (
  user: any,
  subject: string,
  emailType: string,
  emailTemplate: string,
  token: string
) => {
  sendEmail(
    [user.email],
    {
      subject: subject,
      data: {
        name: user.firstName + ' ' + user.lastName,
        role: user.role,
        token: config.client_port + '' + `/${emailType}?token=${token}`,
      },
    },
    emailTemplate
  );
};
