import { NextFunction, Request, Response, Router } from 'express';
import * as yup from 'yup';

import { validate } from '../../middlewares';
import { ApplicationError } from '../../middlewares/errors';

import { resendVerifyLinkService } from './ResendVerifyLink.service';

const router = Router();

const schema = yup.object({
	email: yup.string().email('Please provide a valid email').required('Email is required'),
});

router.post('/resend-verify-link', validate(schema), async(req: Request, res: Response, next: NextFunction) => {
	try {
		const response = await resendVerifyLinkService(req.body.email);

		if (response?.success) {
			return res.status(201).json({ message: 'Verification link is sent to email address', status: 201 });
		}
	} catch (error) {
		if (error instanceof ApplicationError) {
			return res.status(error.status).json(error).end();
		}
	}
});

export default router;