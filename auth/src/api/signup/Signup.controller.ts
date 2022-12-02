import { NextFunction, Request, Response, Router } from 'express';
import * as yup from 'yup';

import validate from '../../middlewares';

import { signupService } from './Signup.service';

const router = Router();

const schema = yup.object({
	firstName: yup.string().min(3, 'First name must be at least 3 character long').required('First name is a required'),
	lastName: yup.string().required('Last name is a required'),
	username: yup.string().required('Username is a required'),
	email: yup.string().email('Please provide a valid email').required('Email is a required'),
	password: yup.string().required(),
	confirmPassword: yup.string()
		.oneOf([yup.ref('password'), null], 'Passwords must match')
});

router.post('/signup', validate(schema), async (req: Request, res: Response, next: NextFunction) => {
	try {
		// console.log('request', req.body);
		// const response = await signupService(req.body);
		// console.log('response', response);
	} catch (error) {
		console.log('error +++', error);
	}
});

export default router;