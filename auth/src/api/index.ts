import { Router } from 'express';

import login from './login';
import sendVeificationLink from './send-verification-link';
import signup from './signup';

const routes = Router()
	.use(signup)
	.use(login)
	.use(sendVeificationLink);

export default Router().use('/api/auth', routes);