const restify = require('restify');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'lahman2016',
});

db.connect();

const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.post('/', (req, res) => {
  db.query(req.body.query, (err, sql) => {
    res.send(sql);
  });
});

server.get(/\/?.*/, restify.plugins.serveStatic({
  directory: './public',
  default: 'index.html',
}));

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
