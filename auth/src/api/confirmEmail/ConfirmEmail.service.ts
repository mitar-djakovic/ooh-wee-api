import { Prisma } from '@prisma/client';

import { ApplicationError } from '../../middlewares/errors';
import prisma from '../../utils/prisma';

export const confirmEmail = async (email: string) => {
	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				email,
			}
		});
		
		if (user.emailVerifiedAt) {
			throw new ApplicationError('Email is already verified!', 400);
		} else  {
			await prisma.user.update({
				where: { email },
				data: { emailVerifiedAt: new Date()}
			});

			return {
				success: true,
			};
		}
	} catch (error) {
		if (error instanceof ApplicationError) {
			throw new ApplicationError(error.message, error.status);
		}
		if (error instanceof Prisma.NotFoundError) {
			throw new ApplicationError('User not found', 404);
		}
	}
};