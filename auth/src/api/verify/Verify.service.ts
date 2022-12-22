import prisma from '../../utils/prisma';

export const verifyService = async (email: string) => {
	console.log('email', email);
	try {
		const user = await prisma.user.findUniqueOrThrow({ where: {
			email
		}});
		console.log('user', user);
	}catch (error) {
		console.log('error1', error);
	}
};
