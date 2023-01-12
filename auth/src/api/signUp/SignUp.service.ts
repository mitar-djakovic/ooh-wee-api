import { Prisma } from '@prisma/client';
import AWS from 'aws-sdk';
import bcrypt from 'bcrypt';

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

const getSQSParams = {
	QueueUrl: process.env.AWS_QUEUE_URL,
	MaxNumberOfMessages: 10,
	VisibilityTimeout: 30,
	WaitTimeSeconds: 20
};

const handleVerificationLink = async (messages: any, user: any, SES: any, SQS: any) => {
	for (const message of messages) {
		const emailParams = {
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
						Data: '<div><h1>Click on the <a href=\'http://localhost:3000/verification/blablalba}\'>link</a> to verify account</h1></div>'
					}
				},
			},
		};

		try {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			await SES.sendEmail(emailParams).promise();

			const deleteParams = {
				QueueUrl: process.env.AWS_QUEUE_URL,
				ReceiptHandle: message.ReceiptHandle
			};
			const delted = await SQS.deleteMessage(deleteParams).promise();
			console.log('delted', delted)
		} catch (error) {
			console.error(error);
		}

	}
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
			QueueUrl: process.env.AWS_QUEUE_URL
		};

		try {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const data = await SQS.sendMessage(sendSQSParams).promise();
			console.log('Email added to queue with ID : ', data.MessageId);
			console.log('data', data);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const { Messages }  = await SQS.receiveMessage(getSQSParams).promise();
			
			if (Messages) {
				const response = handleVerificationLink(Messages, user, SES, SQS);
				console.log('response', response);
			}

		} catch (error) {
			console.error('Error while adding email to queue: ', error);
		}

	} catch (error) {
		if (error instanceof  Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				console.log('error', error.meta?.target);
				throw new ApplicationError('Email already in use!', 404);
			}
		}
		throw error;
	}
};
