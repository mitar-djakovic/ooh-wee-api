import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = 8001;

app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);
});