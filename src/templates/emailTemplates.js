const taskExecutedTemplate = (data) => {
  const { userName, taskTitle, taskDescription, executedAt, status } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .status { padding: 10px 20px; border-radius: 5px; display: inline-block; font-weight: bold; margin: 15px 0; }
        .success { background: #d4edda; color: #155724; }
        .failed { background: #f8d7da; color: #721c24; }
        .details { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Task Executed</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Your scheduled task has been executed.</p>
          
          <div class="status ${status === "success" ? "success" : "failed"}">
            Status: ${status.toUpperCase()}
          </div>
          
          <div class="details">
            <h3>📋 Task Details</h3>
            <p><strong>Title:</strong> ${taskTitle}</p>
            ${
              taskDescription
                ? `<p><strong>Description:</strong> ${taskDescription}</p>`
                : ""
            }
            <p><strong>Executed At:</strong> ${executedAt}</p>
          </div>
          
          <p>Thank you for using Task Scheduler!</p>
        </div>
        <div class="footer">
          <p>This is an automated message from Task Scheduler API</p>
          <p>&copy; ${new Date().getFullYear()} Task Scheduler. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const taskScheduledTemplate = (data) => {
  const { userName, taskTitle, taskDescription, scheduledTime } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .details { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
        .time-badge { background: #667eea; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; font-weight: bold; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 Task Scheduled</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Your task has been successfully scheduled!</p>
          
          <div class="time-badge">
            ⏰ ${scheduledTime}
          </div>
          
          <div class="details">
            <h3>📋 Task Details</h3>
            <p><strong>Title:</strong> ${taskTitle}</p>
            ${
              taskDescription
                ? `<p><strong>Description:</strong> ${taskDescription}</p>`
                : ""
            }
          </div>
          
          <p>You will receive a notification when the task is executed.</p>
        </div>
        <div class="footer">
          <p>This is an automated message from Task Scheduler API</p>
          <p>&copy; ${new Date().getFullYear()} Task Scheduler. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const welcomeTemplate = (data) => {
  const { userName, userEmail } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .features { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .feature-item { padding: 10px 0; border-bottom: 1px solid #eee; }
        .feature-item:last-child { border-bottom: none; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Task Scheduler!</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Thank you for registering with Task Scheduler! Your account has been successfully created.</p>
          
          <div class="features">
            <h3>🚀 What you can do:</h3>
            <div class="feature-item">✓ Create and manage scheduled tasks</div>
            <div class="feature-item">✓ Receive email notifications when tasks execute</div>
            <div class="feature-item">✓ Track execution history and logs</div>
            <div class="feature-item">✓ Update and reschedule tasks easily</div>
          </div>
          
          <p><strong>Your Email:</strong> ${userEmail}</p>
          <p>Get started by creating your first scheduled task!</p>
        </div>
        <div class="footer">
          <p>This is an automated message from Task Scheduler API</p>
          <p>&copy; ${new Date().getFullYear()} Task Scheduler. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  taskExecutedTemplate,
  taskScheduledTemplate,
  welcomeTemplate,
};
