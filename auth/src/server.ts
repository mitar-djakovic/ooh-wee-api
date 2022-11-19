import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 8000;

app.listen(PORT, async () => {
	console.log(`Server is listening on port ${PORT}`);
});
