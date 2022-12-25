import { NextFunction, Request, Response, Router } from 'express';
import * as yup from 'yup';

import { validate } from '../../middlewares';

import { resendVerifyLinkService } from './ResendVerifyLink.service';

const router = Router();

const schema = yup.object({
	email: yup.string().email('Please provide a valid email').required('Email is required'),
});

router.post('/resend-verify-link', validate(schema), async(req: Request, res: Response, next: NextFunction) => {
	console.log('verify');
	try {
		const response = await resendVerifyLinkService(req.body.email);
		console.log('response', response);
	} catch (error) {
		console.log('error', error);
	}
});

export default router;