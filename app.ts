import express from 'express';

const app = express();

app.use(express.static('public', {index: 'landing.html'}));

const PORT = 8080;
app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}/`);
});