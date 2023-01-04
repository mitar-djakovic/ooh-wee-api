import { Request, Response, Router } from 'express';
import * as yup from 'yup';

import { Route } from '../../config';
import { validate } from '../../middlewares';
import { ApplicationError } from '../../middlewares/errors';

import { loginService} from './Login.service';

const router = Router();

const schema = yup.object({
	email: yup.string().email('Please provide a valid email').required('Email is required'),
	password: yup.string().required('Password is required'),
});

router.post(Route.Login, validate(schema), async(req: Request, res: Response) => {
	try {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const { success, token } = await loginService(req.body);

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
		if (error instanceof ApplicationError) {
			res.status(error.status).json(error).end();
		}
	}
});

export default router;