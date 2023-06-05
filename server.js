const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const axios = require('axios');
//to create random * process id:
const crypto = require('crypto');

app.use(cors());
app.use(express.json({ limit: '100mb' }));

function generateUID() {
  let randomString = crypto.randomBytes(16).toString('hex');
  let processId = process.pid;
  let uid = `${randomString}-${processId}`;
  return uid;
}


app.post('/save-image', (req, res) => {
  const data = req.body.image;

  const base64Data = data.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  const timestamp = Date.now(); //image timestamp
  const db_artpath = `http://127.0.0.1:5000/images/artpiece_${timestamp}.jpg`

  filename = `C:/Users/Hammer/Pictures/artpiece_${timestamp}.jpg`
  fs.writeFile(filename, buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving image');
    } else {
      // Image saved, send filename back to client
      res.json({ filename2: filename, filename: db_artpath}); //mby remove
    }
  });
});

app.post('/save-signature', (req, res) => {
  const uik = generateUID();
  const data = req.body.signature_image;
  const artworkName = req.body.artwork_name;
  const filename = req.body.filename; // this is the artwork image filename

  const base64Data = data.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  const timestamp = Date.now(); //signature timestamp
  const db_signpath = `http://127.0.0.1/images/signature_${timestamp}.jpg`

  const signatureFilename = `C:/Users/Hammer/Pictures/signature_${timestamp}.jpg`
  fs.writeFile(signatureFilename, buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving image');
    } else {
      // Image saved, now send metadata to Python API
      axios.post('http://127.0.0.1:5000/api', {
        uik: uik,
        artwork_name: artworkName,
        artwork_path: filename,
        signature_path: db_signpath
      })
      .then(function (response) {
        res.send('Signature and metadata saved successfully');
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).send('Error saving metadata');
      });
    }
  });
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
