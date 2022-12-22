import { Router } from 'express';

import login from './login';
import signup from './signup';
import verify from './verify';

const routes = Router()
	.use(signup)
	.use(login)
	.use(verify);

export default Router().use('/api/auth', routes);