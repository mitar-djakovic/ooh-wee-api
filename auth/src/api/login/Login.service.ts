import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { ApplicationError } from '../../middlewares/errors';
import prisma from '../../utils/prisma';

interface Credentials {
	email: string;
	password: string;
}

interface LoginResponse {
	success: boolean;
	token: string | null
}

export const loginService = async (credentials: Credentials): Promise<LoginResponse | undefined> => {
	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				email: credentials.email,
			}
		});

		if (!user.emailVerifiedAt) {
			throw new ApplicationError('Email is not verified', 400);
		}
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
			token: null
		};
	} catch (error) {
		if (error instanceof ApplicationError) {
			if (error.status === 400) {
				throw new ApplicationError(error.message, error.status);
			}
		} else {
			throw new ApplicationError('Password or email is incorrect', 404);
		}
	}
};

// Vratiti token u cookie
// Napraviti middleware za cookie, treba nam cookie parser
// Istraziti interceptor za axios