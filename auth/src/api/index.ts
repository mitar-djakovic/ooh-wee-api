import { Router } from 'express';

import signup from './signup';

const routes = Router().use(signup);

export default Router().use('/api/auth', routes);