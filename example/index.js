const express = require('../index.js');
const app = express();

app.get((req, res) => {
	res.end('You send GET request.');
});

app.post((req, res) => {
	res.end('You send POST request');
});

app.put((req, res) => {
	res.end('You send PUT request');
});

app.delete((req, res) => {
	res.end('You send DELETE request');
});

app.listen(5000);
