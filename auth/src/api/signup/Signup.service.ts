import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

import { ApplicationError } from '../../middlewares/errors';
import prisma from '../../utils/prisma';

interface User {
	firstName: string;
	lastName: string;
	userName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export const signupService = async (user: User) => {
	const hashedPassword = await bcrypt.hash(user.password, 10);
	try {
		await prisma.user.create({
			data: {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				password: hashedPassword,
			}
		});
	} catch (error) {
		if (error instanceof  Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				throw new ApplicationError('Email already in use!', 404);
			}
		}
		throw error;
	}
};