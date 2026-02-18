require('dotenv').config();

const EmailService = require('./services/email.service');

const mockAnalysis = {
  matchPercentage: 85,
  strengths: ['Node.js', 'Express', 'React'],
  feedbackToCandidate: 'Your skills are a great match for the position. Keep up the good work!'
}

EmailService.sendFeedbackEmail('kaddechiala@gmail.com', 'Alaa Kaddechi - Screening Review', mockAnalysis)
  .then(() => { console.log('Test email sent successfully'); })
  .catch(err => { console.error('Error sending test email:', err); });
  