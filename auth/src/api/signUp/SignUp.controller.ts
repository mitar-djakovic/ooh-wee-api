import { Request, Response, Router } from 'express';
import * as yup from 'yup';

import { validate } from '../../middlewares';
import { ApplicationError } from '../../middlewares/errors';

import { signUpService } from './SignUp.service';

const router = Router();

const schema = yup.object({
	email: yup.string().email('Please provide a valid email').required('Email is required'),
	password: yup.string().required('Password is required'),
	confirmPassword: yup.string()
		.oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required')
});

router.post('/signup', validate(schema), async (req: Request, res: Response) => {
	try {
		await signUpService(req.body);

		return res.status(201).json({ message: 'Account created', status: 201 });
	} catch (error) {
		if (error instanceof ApplicationError) {
			return res.status(error.status).json(error).end();
		}
	}
});

export default router;