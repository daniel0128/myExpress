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
// app.get((req, res, next) => {
// 	req.user = {
// 		name: 'fool'
// 	};
// 	next();
// });
//
// app.get((req, res, next) => {
// 	req.article = {
// 		title: 'bar'
// 	};
// 	next();
// }, (req, res, next) => {
// 	res.end(`User name is ${req.user.name}, and Article title is ${req.article.title}.`);
// });

// lesson 4
// // curl -X GET http://localhost:5000/foo
// // curl -X POST http://localhost:5000/foo
// console.log(app);
//
// app.get('/foo', function (req, res, next) {
// 	console.log(app);
// 	res.end('Welcome to GET /foo')
// });
//
// app.get('/bar', function (req, res, next) {
// 	res.end('Welcome to GET /bar')
// });
//
// app.post('/foo', function (req, res, next) {
// 	res.end('Welcome to POST /foo')
// });

// lesson 5
// curl -X GET http://localhost:5000/user/1234
// curl -X GET http://localhost:5000/article/grow-to-express
app.get('/user/:userId', (req, res, next) => {
	// console.log(req.params);
	// console.log(req.user);
	res.end(`Welcome, the user.id = ${req.params.userId} and the user.name is ${req.user.name}\n`);
});

app.param('userId', (req, res, next, userId, key) => {
	// console.log('here...');
	// console.log(userId);
	req.user = {
		id: userId,
		name: 'foo'
	};
	next();
});
let time = 0;
app.get('/article/:title', (req, res, next) => {
	// console.log(`getting article ${++time}`);
	res.end(`Welcome, the article's title is "${req.params.title}"\n`);
});

app.listen(5000);
