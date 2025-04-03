// emailService.js
import axios from 'axios';

export const sendEmailReminder = async (email, taskCount) => {
  try {
    const response = await axios.post('YOUR_EMAIL_API_URL', {
      to: email,
      subject: 'Stay on Track! Reminder',
      text: `This is a reminder for you to stay on track. There are ${taskCount} tasks to do.`,
    });
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
