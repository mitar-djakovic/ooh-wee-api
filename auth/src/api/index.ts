import { Router } from 'express';

import login from './login';
import resendVerifyLink from './resend-verify-link';
import signup from './signup';

const routes = Router()
	.use(signup)
	.use(login)
	.use(resendVerifyLink);

export default Router().use('/api/auth', routes);