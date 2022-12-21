import { NextFunction, Request, Response, Router } from 'express';
import * as yup from 'yup';

import { validate } from '../../middlewares';
import { ApplicationError } from '../../middlewares/errors';

import { signupService } from './Signup.service';

const router = Router();

const schema = yup.object({
	firstName: yup.string().required('First name is required'),
	lastName: yup.string().required('Last name is required'),
	email: yup.string().email('Please provide a valid email').required('Email is required'),
	password: yup.string().required('Password is required'),
	confirmPassword: yup.string()
		.oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required')
});

router.post('/signup', validate(schema), async (req: Request, res: Response, next: NextFunction) => {
	try {
		await signupService(req.body);

		return res.status(201).json({ message: 'Account created', status: 201 });
	} catch (error) {
		if (error instanceof ApplicationError) {
			return res.status(error.status).json(error).end();
		}
	}
});

export default router;