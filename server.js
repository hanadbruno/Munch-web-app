const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/save-image', (req, res) => {
  const data = req.body.image;

  const base64Data = data.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  fs.writeFile('C:/Users/Hammer/Pictures/output.png', buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving image');
    } else {
      res.send('Image saved successfully');
    }
  });
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});