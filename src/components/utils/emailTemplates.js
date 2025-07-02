// Function to generate the welcome email HTML
function generateWelcomeEmailHtml(username) {
  // Using direct hex codes that match your CSS variables for better email client compatibility
  const primaryColor = '#502A90';          // Darker Deep Purple for button start
  const primaryDarkColor = '#4527A0';       // Original Darker Purple for other elements
  const accentColor = '#008C9E';            // Darker Energetic Cyan for button end
  const lightBgColor = '#F5F5F5';           // Very Light Gray
  const cardBgColor = '#FFFFFF';            // White
  const textDarkColor = '#424242';          // Dark Gray
  const buttonTextColor = '#FFFFFF';        // Explicitly white text for the button

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Personal Sustainability Tracker!</title>
        <style>
            body {
                font-family: 'Inter', sans-serif; /* Or a common sans-serif fallback */
                margin: 0;
                padding: 0;
                background-color: ${lightBgColor};
                color: ${textDarkColor};
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: ${cardBgColor};
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                border: 1px solid #ECEFF1; /* var(--border-light) */
            }
            .header {
                background-color: ${primaryColor};
                padding: 30px 20px;
                text-align: center;
                color: ${cardBgColor}; /* White text for header */
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
                letter-spacing: 0.5px;
            }
            .content {
                padding: 30px;
                line-height: 1.6;
                text-align: left;
            }
            .content p {
                margin-bottom: 15px;
                font-size: 16px;
            }
            .button-container {
                text-align: center;
                margin-top: 25px;
                margin-bottom: 25px;
            }
            .button {
                display: inline-block;
                padding: 12px 25px;
                background: linear-gradient(45deg, ${primaryColor} 0%, ${accentColor} 100%);
                color: ${buttonTextColor} !important; /* <--- ADDED !important HERE */
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 17px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                transition: all 0.2s ease-in-out;
            }
            .footer {
                background-color: ${lightBgColor};
                padding: 20px;
                text-align: center;
                font-size: 13px;
                color: ${textDarkColor};
                border-top: 1px solid #ECEFF1; /* var(--border-light) */
            }
            .footer p {
                margin: 0;
            }
            .footer a {
                color: ${primaryColor};
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Personal Sustainability Tracker 🌱</h1>
            </div>
            <div class="content">
                <p>Hello ${username},</p>
                <p>Welcome to the **Personal Sustainability Tracker**! We're thrilled to have you join our community dedicated to making a real impact on the environment.</p>
                <p>Our app helps you easily monitor your daily habits related to commute, food, electricity, water, and plastic, and visualize your personal carbon footprint. Get ready to transform your eco-journey!</p>
                <div class="button-container">
                    <a href="http://localhost:3000/dashboard" class="button">Go to Your Dashboard</a>
                </div>
                <p>If you have any questions or need assistance, feel free to reply to this email.</p>
                <p>Best regards,<br>The Personal Sustainability Tracker Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Personal Sustainability Tracker. All rights reserved.</p>
                <p><a href="http://localhost:3000/privacy">Privacy Policy</a> | <a href="http://localhost:3000/terms">Terms of Service</a></p>
            </div>
        </div>
    </body>
    </html>
  `;
}

// Function to generate the login notification email HTML
function generateLoginEmailHtml(username, loginTime) {
    const primaryColor = '#502A90';
    const accentColor = '#008C9E';
    const lightBgColor = '#F5F5F5';
    const cardBgColor = '#FFFFFF';
    const textDarkColor = '#424242';
    const buttonTextColor = '#FFFFFF'; // Ensure this is white

    // Format loginTime for readability
    const formattedLoginTime = loginTime ? new Date(loginTime).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }) : 'recently';

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Notification - Personal Sustainability Tracker</title>
            <style>
                body {
                    font-family: 'Inter', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: ${lightBgColor};
                    color: ${textDarkColor};
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: ${cardBgColor};
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                    border: 1px solid #ECEFF1;
                }
                .header {
                    background-color: ${primaryColor};
                    padding: 30px 20px;
                    text-align: center;
                    color: ${cardBgColor};
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                .content {
                    padding: 30px;
                    line-height: 1.6;
                    text-align: left;
                }
                .content p {
                    margin-bottom: 15px;
                    font-size: 16px;
                }
                .button-container {
                    text-align: center;
                    margin-top: 25px;
                    margin-bottom: 25px;
                }
                .button {
                    display: inline-block;
                    padding: 12px 25px;
                    background: linear-gradient(45deg, ${primaryColor} 0%, ${accentColor} 100%);
                    color: ${buttonTextColor} !important; /* <--- ADDED !important HERE */
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 17px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    transition: all 0.2s ease-in-out;
                }
                .footer {
                    background-color: ${lightBgColor};
                    padding: 20px;
                    text-align: center;
                    font-size: 13px;
                    color: ${textDarkColor};
                    border-top: 1px solid #ECEFF1;
                }
                .footer p {
                    margin: 0;
                }
                .footer a {
                    color: ${primaryColor};
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Login Notification 🚨</h1>
                </div>
                <div class="content">
                    <p>Hello ${username},</p>
                    <p>This is an important security notification to inform you that your **Personal Sustainability Tracker** account was just logged in.</p>
                    <p><strong>Login Time:</strong> ${formattedLoginTime}</p>
                    <p>If this activity was not you, please take immediate action to secure your account.</p>
                    <div class="button-container">
                        <a href="http://localhost:3000/settings" class="button">Review Account Settings</a>
                    </div>
                    <p>If you have any concerns, please contact our support team.</p>
                    <p>Stay Green,<br>The Personal Sustainability Tracker Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 Personal Sustainability Tracker. All rights reserved.</p>
                    <p><a href="http://localhost:3000/privacy">Privacy Policy</a> | <a href="http://localhost:3000/terms">Terms of Service</a></p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Export both functions
module.exports = {
  generateWelcomeEmailHtml,
  generateLoginEmailHtml,
};
