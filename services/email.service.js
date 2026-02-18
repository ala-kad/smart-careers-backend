const { Resend } = require('resend');

// تأكد من تمرير المفتاح مباشرة للمشيد لضمان العمل
const resend = new Resend(process.env.RESEND_API_KEY || 're_JQ5d85y4_FezsCAAojXijvZnZgAhCKTwh');

const sendFeedbackEmail = async (to, candidateName, analysis) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Smart Careers <onboarding@resend.dev>',
            to: to,
            subject: 'Application Update: AI Selection Results 🚀',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
                    <h2 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Hello ${candidateName},</h2>
                    <p style="font-size: 16px;">Thank you for your interest in <strong>Smart Careers</strong>. Our AI engine has completed the initial review of your application.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #2c3e50;">Evaluation Summary:</h3>
                        <p><strong>📊 Match Score:</strong> <span style="color: #28a745; font-size: 18px; font-weight: bold;">${analysis.matchPercentage}%</span></p>
                        <p><strong>✅ Key Strengths:</strong> ${analysis.strengths.join(', ')}</p>
                        <hr style="border: 0; border-top: 1px solid #ddd;">
                        <p><strong>💡 AI Recommendations:</strong></p>
                        <p style="font-style: italic; color: #555;">"${analysis.feedbackToCandidate}"</p>
                    </div>

                    <p style="font-size: 14px; color: #777;">Please note that this is an automated preliminary screening. Our HR team will reach out if your profile matches our current needs.</p>
                    
                    <footer style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
                        Sent with ❤️ by Smart Careers AI System
                    </footer>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return;
        }
        console.log('✅ English Feedback Email sent:', data.id);
    } catch (err) {
        console.error('Failed to send email:', err);
    }
};

module.exports = { sendFeedbackEmail };