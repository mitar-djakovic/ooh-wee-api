import { Router } from 'express';

import confirmEmail from './confirmEmail';
import login from './login';
import sendVerificationLink from './sendVerificationLink';
import signUp from './signUp';

const routes = Router()
	.use(signUp)
	.use(login)
	.use(sendVerificationLink)
	.use(confirmEmail);

export default Router().use('/api/auth', routes);