const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hellooo000oo from EKS DevOps Project 🚀');
});

app.listen(3000, () => console.log('App running on port 3000'));
