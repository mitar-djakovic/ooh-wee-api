import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { ApplicationError } from '../../middlewares/errors';
import prisma from '../../utils/prisma';

interface Credentials {
	email: string;
	password: string;
}

export const loginService = async (credentials: Credentials) => {
	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				email: credentials.email,
			}
		});
		const match = await bcrypt.compare(credentials.password, user.password);
		if (match) {
			const token = jwt.sign({ email: credentials.email }, process.env.TOKEN_SECRET as string, {
				expiresIn: '1800s',
			});

			return {
				success: match,
				token
			};
		}
		return {
			success: false,
			token: ''
		};
	} catch (error) {
		throw new ApplicationError('Password or email is incorrect', 404);
	}
};

// Vratiti token u cookie
// Napraviti middleware za cookie, treba nam cookie parser
// Istraziti interceptor za axios