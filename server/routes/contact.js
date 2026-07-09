import express from 'express';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const emailHtml = `
      <h2>New Contact Message from Wiecodes</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
    `;

    await sendEmail({
      to: 'wiecodes@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: emailHtml,
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending contact message:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

export default router;
