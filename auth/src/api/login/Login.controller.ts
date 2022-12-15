import { Request, Response, Router } from 'express';
import * as yup from 'yup';

import { validate } from '../../middlewares';
import { ApplicationError } from '../../middlewares/errors';

import { loginService} from './Login.service';

const router = Router();

const schema = yup.object({
	email: yup.string().email('Please provide a valid email').required('Email is required'),
	password: yup.string().required('Password is required'),
});

router.post('/login', validate(schema), async(req: Request, res: Response) => {
	try {
		const { success, token } = await loginService(req.body);

		console.log('token', token);
		if (!success) {
			throw new ApplicationError('Password or email is incorrect', 404);
		}
		return res
			.status(200)
			.cookie('access_token', token)
			.json({
				message: 'Logged in successfully!',
				status: 200
			});
	} catch (error) {
		res.json(error).end();
	}
});

export default router;