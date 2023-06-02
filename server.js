const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const axios = require('axios');

app.use(cors());
app.use(express.json({ limit: '100mb' }));

app.post('/save-image', (req, res) => {
  const data = req.body.image;
  //artist name and artwork
  const uik = "123";
  const artist = "munch";
  const artwork_name = "månestrole";
  const signature_path = "hdsurivi";


  const base64Data = data.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  const timestamp = Date.now(); //image timestamp
  filename = `C:/Users/jonas/Pictures/artpiece_${timestamp}.jpg`
  fs.writeFile(filename, buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving image');
    } else {
      // Image saved, send filename back to client
      res.json({ filename: filename });
    }
  });
});

app.post('/save-signature', (req, res) => {
  const uik = "1234567890";
  const data = req.body.signature_image;
  const artworkName = req.body.artwork_name;
  const filename = req.body.filename; // this is the artwork image filename

  const base64Data = data.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  const timestamp = Date.now(); //signature timestamp
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
        signature_path: signature_path
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
