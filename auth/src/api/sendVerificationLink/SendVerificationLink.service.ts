import { NotFoundError } from '@prisma/client/runtime';
import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';

import { ApplicationError } from '../../middlewares/errors';
import prisma from '../../utils/prisma';

export const sendVerificationLinkService = async (email: string) => {
	try {
		const user = await prisma.user.findUniqueOrThrow({ where: {
			email
		}});

		if (!user.emailVerifiedAt) {
			const SQS = new AWS.SQS();
			try {
				const sendSQSParams = {
					MessageBody: JSON.stringify(email),
					QueueUrl: process.env.AWS_QUEUE_URL ?? ''
				};
				const token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET as string, {
					expiresIn: '1800s',
				});

				await SQS.sendMessage(sendSQSParams).promise();


				const emailParams = {
					Source: process.env.AWS_EMAIL_SOURCE ?? '',
					Destination: {
						ToAddresses: [user.email]
					},
					Message: {
						Subject: {
							Charset: 'UTF-8',
							Data: 'Ohh Wee email verification link!'
						},
						Body: {
							Html: {
								Charset: 'UTF-8',
								Data: `<div><h1>Click on the <a href='http://localhost:3000/verification/${token}'>link</a> to verify account</h1></div>`
							}
						},
					},
				};

				const awsSESConfig = {
					accessKeyId: process.env.AWS_ACCESS_KEY_ID,
					secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
					region: process.env.AWS_REGION,
				};

				const SES = new AWS.SES(awsSESConfig);
				await SES.sendEmail(emailParams).promise();

			} catch (error) {
				throw new ApplicationError('We had problems sending your email verification link, please try again.', 404);
			}
		} else {
			throw new ApplicationError('This email is already verified', 400);
		}
		
		return {
			success: true
		};
	}catch (error) {
		if (error instanceof NotFoundError) {
			throw new ApplicationError('This email is not found!', 404);
		} else {
			throw new ApplicationError('Something went wrong', 500);
		}
	}
};
