import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';

import { ApplicationError } from '../../middlewares/errors';
import prisma from '../../utils/prisma';

export const sendVerificationLinkService = async (email: string) => {
	try {
		const awsConfig = {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: process.env.AWS_REGION,
		};
		
		const user = await prisma.user.findUniqueOrThrow({ where: {
			email
		}});

		const token = jwt.sign({ email }, process.env.TOKEN_SECRET as string, {
			expiresIn: '1800s',
		});
		
		if (user) {
			const SES = new AWS.SES(awsConfig);

			const params = {
				Source: process.env.AWS_EMAIL_SOURCE,
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
					}
				}
			};

			try {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				await SES.sendEmail(params).promise();

				return {
					success: true
				};
			} catch (innerError) {
				throw new ApplicationError('Something went wrong', 500);
			}
		}
	}catch (error) {
		throw new ApplicationError('Verification link is sent to email address', 404);
	}
};
