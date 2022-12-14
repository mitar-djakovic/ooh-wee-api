import { Router } from 'express';

import login from './login';
import signup from './signup';

const routes = Router()
	.use(signup)
	.use(login);

export default Router().use('/api/auth', routes);