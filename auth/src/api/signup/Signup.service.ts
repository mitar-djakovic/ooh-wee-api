import prisma from '../../utils/prisma';

export const signupService = async (user: any) => {
	try {
		const response = await prisma.user.create({
			data: {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				password: user.password,
				confirmPassword: user.confirmPassword
			}
		});
		console.log('response2', response);
	} catch (error) {
		console.log('error', error);
	}
};