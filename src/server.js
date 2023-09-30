const AWS = require('aws-sdk');
const express = require('express');
const app = express();

AWS.config.update({region: 'US West (Oregon) us-west-2'});

app.get('/presigned-url', (req, res) => {
  const s3 = new AWS.S3();
  const params = {
    Bucket: 'pdfchatbot',
    Key: s3_prefix + '/' + filename,
    Expires: 60, // Expiration time in seconds
  };

  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      res.status(500).json({error: 'Error creating presigned URL'});
    } else {
      res.status(200).json({url});
    }
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));