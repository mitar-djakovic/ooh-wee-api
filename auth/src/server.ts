import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(bodyParser.json());

async function main() {
	// Connect the client
	await prisma.$connect();
	// ... you will write your Prisma Client queries here
	const allUsers = await prisma.user.findMany();
	console.log(allUsers);
}

const PORT = 8000;

app.listen(PORT, async () => {

	main()
		.then(async () => {
			await prisma.$disconnect();
		})
		.catch(async (e) => {
			console.error(e);
			await prisma.$disconnect();
			process.exit(1);
		});
	console.log(`Server is listening on port ${PORT}`);
});
