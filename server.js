const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const axios = require('axios');
//to create random * process id:
const crypto = require('crypto');
const path = require('path');
const os = require('os');

const username = os.userInfo().username;
console.log(username);

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
  const timestamp = Date.now();
  const db_artpath = `http://192.168.172.133:5000/images/artpiece_${timestamp}.jpg`

  filename = `C:/Users/${username}/Pictures/munch/artpiece_${timestamp}.jpg`
  fs.writeFile(filename, buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving image');
      console.log("eror");
    } else {
      // Image saved, send filename back to client
      res.json({ filename2: filename, filename: db_artpath}); //mby remove
    }
  });
});

app.post('/delete-file', (req, res) => {
  const filePath = req.body.path;
  console.log(filePath);

  // Check if the file exists first
  if (!fs.existsSync(filePath)) {
    console.error(`File ${filePath} does not exist`);
    res.status(404).send(`File ${filePath} does not exist`);
    return;
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("There was an error:", err);
      res.status(500).send(err);
    } else {
      console.log("File was deleted successfully");
      res.send({ status: "File was deleted successfully" });
    }
  });
});

app.post('/save-signature', (req, res) => {
  const uik = generateUID();
  const data = req.body.signature_image;
  const artworkName = req.body.artwork_name;
  const filename = req.body.filename; 
  const base64Data = data.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');
  const timestamp = Date.now(); 
  const db_signpath = `http://192.168.172.133:5000/images/signature_${timestamp}.jpg`
  const signatureFilename = `C:/Users/${username}/Pictures/munch/signature_${timestamp}.jpg`
  fs.writeFile(signatureFilename, buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving image');
    } else {
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
  console.log()
});
