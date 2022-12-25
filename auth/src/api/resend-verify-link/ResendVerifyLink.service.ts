import AWS from 'aws-sdk';

import prisma from '../../utils/prisma';

export const resendVerifyLinkService = async (email: string) => {
	console.log('email', email);
	try {
		const user = await prisma.user.findUniqueOrThrow({ where: {
			email
		}});

		const awsConfig = {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: process.env.AWS_REGION,
		};

		const SES = new AWS.SES(awsConfig);

		const params = {
			Source: 'mitar-djakovic2401993@hotmail.com',
			Destination: {
				ToAddresses: ['roker.93@hotmail.com']
			},
			Message: {
				Subject: {
					Charset: 'UTF-8',
					Data: 'Your code is blabla truc'
				},
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: '<div><h1>Some text</h1></div>'
					}
				}
			}
		};

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const emailSent = await SES.sendEmail(params).promise();
		console.log('emailSent', emailSent);
		// emailSent.then((res) => {
		// 	console.log('res', res);
		// }).catch((error: any) => {
		// 	console.log('error', error);
		// });
		console.log('user', user);
	}catch (error) {
		console.log('error1', error);
	}
};
