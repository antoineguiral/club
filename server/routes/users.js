const express = require('express');
const { User } = require('../database/schemas');

const router   = express.Router();

module.exports = router;

router.post('/checkemail', (req, res) => {
  const { email } = req.body;

  User.find({ email }, (err, users) => {
    if (err) {
      res.status(400).send({ message: 'Check email failed', err, email });
    }
    if (users && users[0]) {
      res.send({ available: false, message: 'Email exists', email });
    } else {
      res.send({ available: true, message: 'Email available', email });
    }
  });
});
