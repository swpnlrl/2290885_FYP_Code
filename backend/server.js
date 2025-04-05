const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;

// Setup the email transporter with your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.use(express.json());

// API to send email
app.post('/send-email', (req, res) => {
  const { email, remainingTasks } = req.body;

  // Compose the email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Task Reminder',
    text: `This is a reminder for you to stay on track. There are ${remainingTasks} tasks remaining.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email: ' + error);
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
