import bcrypt from 'bcrypt';

import { ApplicationError } from '../../middlewares/errors';
import prisma from '../../utils/prisma';

interface Credentials {
	email: string;
	password: string;
}

export const loginService = async (credentials: Credentials) => {
	console.log('credentials', credentials);
	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				email: credentials.email,
			}
		});
		return await bcrypt.compare(credentials.password, user.password);
	} catch (error) {
		throw new ApplicationError('Password or email is incorrect', 404);
	}
};

// Vratiti token u cookie
// Napraviti middleware za cookie, treba nam cookie parser
// Istraziti interceptor za axios