var express = require('express');
var app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const stream = require('stream');

const DB = {};

app.get('/', function (req, res) {
  res.send('Nothing to see here...');
});

app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
}));

// app.get('/app', express.static('../ui', {}))
app.use('/app', express.static(path.join(__dirname, '../ui')))


app.post('/api/:sessionId/:part/upload', function(req, res) {
  DB[req.params.sessionId] = DB[req.params.sessionId] || {}
  DB[req.params.sessionId][req.params.part] = req.files.photo.data;

  res.send({
    status: 200
  });
});

app.use('/api/:sessionId/:part', (req, res) => {
  console.log('DB', DB)
  // const fileContents = DB.asd.before;

  const readStream = new stream.PassThrough();
  readStream.end(DB[req.params.sessionId][req.params.part]);

  res.writeHead(200, {
    'Content-Type': 'image/jpeg'
  });

  // res.set('Content-disposition', 'attachment; filename=' + 'fileName');
  // res.set('Content-Type', 'text/plain');

  readStream.pipe(res);
  // res.send(DB[req.params.sessionId]);
});

app.listen(8282, function () {
  console.log('Example app listening on port 8282!');
});
