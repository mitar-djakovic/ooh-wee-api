import { Router } from 'express';

import login from './login';
import sendVerificationLink from './send-verification-link';
import signup from './signup';

const routes = Router()
	.use(signup)
	.use(login)
	.use(sendVerificationLink);

export default Router().use('/api/auth', routes);