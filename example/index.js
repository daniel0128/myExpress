const express = require('../index.js');
const app = express();

// lesson 2
// app.get((req, res) => {
// 	res.end('You send GET request.');
// });
//
// app.post((req, res) => {
// 	res.end('You send POST request');
// });
//
// app.put((req, res) => {
// 	res.end('You send PUT request');
// });
//
// app.delete((req, res) => {
// 	res.end('You send DELETE request');
// });

// lesson 3
app.get((req, res, next) => {
	req.user = {
		name: 'fool'
	};
	next();
});

app.get((req, res, next) => {
	req.article = {
		title: 'bar'
	};
	next();
}, (req, res, next) => {
	res.end(`User name is ${req.user.name}, and Article title is ${req.article.title}.`);
});

app.listen(5000);
