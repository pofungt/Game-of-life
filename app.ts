import express from 'express';

const app = express();

app.use(express.static('public', {index: 'landing.html'}));

const PORT = 9000;
app.listen(PORT, () => {
	console.log(`Listening at https://gameoflife.duncantang.dev:${PORT}/`);
});