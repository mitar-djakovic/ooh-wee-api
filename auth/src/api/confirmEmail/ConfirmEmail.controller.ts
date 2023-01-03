import { Request, Response, Router } from 'express';
import * as yup from 'yup';

import { Route } from '../../config';
import { validate } from '../../middlewares';
import { ApplicationError } from '../../middlewares/errors';

import { confirmEmail } from './ConfirmEmail.service';

const schema = yup.object({
	email: yup.string().email('Please provide a valid email').required('Email is required'),
});

const router = Router();

router.post(Route.ConfirmEmail, validate(schema), async(req: Request, res: Response) => {
	try {
		const response = await confirmEmail(req.body.email);
		if (response?.success) {
			return res.status(200).json({ message: 'Email verified', status: 200 });
		}
	} catch (error) {
		if (error instanceof ApplicationError) {
			return res.status(error.status).json(error).end();
		}
	}
});

export default router;