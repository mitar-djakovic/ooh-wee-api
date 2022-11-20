import { NextFunction, Request, Response, Router } from 'express';

import { signupService } from './Signup.service';
const router = Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log('request', req.body);
		const response = await signupService(req.body);
		console.log('response', response);
	} catch (error) {
		console.log('error', error);
	}
});

export default router;