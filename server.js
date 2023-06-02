const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const axios = require('axios');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/save-image', (req, res) => {
  const data = req.body.image;
  //artist name and artwork
  const uik = "1234";
  const artist = "munch";
  const artwork_name = "solstrole";
  const signature_path = "C:/Users/jonas/Pictures/signature.jpg";

  const base64Data = data.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  const timestamp = Date.now(); //image timestamp
  filename = `C:/Users/jonas/Pictures/artpiece_${timestamp}.jpg`
  fs.writeFile(filename, buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving image');
    } else {
      // Now that the image is saved, send metadata to Python API
      axios.post('http://127.0.0.1:5000/api', {
        uik: uik,
        artist: artist,
        artwork_name: artwork_name,
        artwork_path: filename,
        signature_path: signature_path,
      })
      .then(function (response) {
        res.send('Image and metadata saved successfully');
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