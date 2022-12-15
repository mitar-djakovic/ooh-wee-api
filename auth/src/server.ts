import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import api from './api';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(api);

const PORT = 8000;

app.listen(PORT, async () => {
	console.log(`Server is listening on port ${PORT}`);
});
