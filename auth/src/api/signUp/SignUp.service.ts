import { Prisma } from '@prisma/client';
import AWS from 'aws-sdk';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { ApplicationError } from '../../middlewares/errors';
import prisma from '../../utils/prisma';

interface User {
	email: string;
	password: string;
	confirmPassword: string;
}

const awsSESConfig = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
};

export const signUpService = async (user: User) => {
	const hashedPassword = await bcrypt.hash(user.password, 10);
	try {
		await prisma.user.create({
			data: {
				email: user.email,
				password: hashedPassword,
				emailVerifiedAt: null
			}
		});

		const SQS = new AWS.SQS();
		const SES = new AWS.SES(awsSESConfig);

		const email = {
			to: user.email,
			from: process.env.AWS_EMAIL_SOURCE,
			subject: 'test email',
			body: 'this is a test email'
		};

		const sendSQSParams = {
			MessageBody: JSON.stringify(email),
			QueueUrl: process.env.AWS_QUEUE_URL ?? ''
		};

		try {
			await SQS.sendMessage(sendSQSParams).promise();

			const token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET as string, {
				expiresIn: '1800s',
			});

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

			await SES.sendEmail(emailParams).promise();
		} catch (error) {
			throw new ApplicationError('Account is created, but something went wrong while trying to send verification email!', 404);
		}

	} catch (error) {
		if (error instanceof  Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				throw new ApplicationError('Email already in use!', 404);
			}
		} else if (error instanceof ApplicationError) {
			throw new ApplicationError(error.message, 404);
		} else {
			throw new ApplicationError('Something went wrong!', 500);
		}
	}
};


