// шаблоны для отправления письма

export const createWelcomeEmailTemplate = (fullName, profileUrl) => {
    return (
        ` <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to UnLinked</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
<img style="width: 100%" src="https://resize.yandex.net/mailservice?url=https%3A%2F%2Fsun4-18.userapi.com%2FJW3-a2wfgdVGYQ6gjSXBkZEyE2EeYbhJveCmLg%2FPS3Mj1zuj1E.jpg&proxy=yes&key=14142501d471eadd3a022ea15f3eb4ab" alt="">
<div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 18px; color: #0d77f4;"><strong>Привет ${fullName},</strong></p>
    <p>Мы рады то что вы присоеденились к вконтакте  учитесь, общайтесь, и растите в вашей карьере.</p>
    <div style="background-color: #ebf8ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
        <p style="font-size: 16px; margin: 0;"><strong>Как начать:</strong></p>
        <ul style="padding-left: 20px;">
            <li>Дополните свой профить</li>
            <li>Свяжитесь с коллегами и друзьями</li>
            <li>Зайдите в группы которые вам по интересу</li>
            <li>Узнайте о приемуществ работы</li>
        </ul>
    </div>
    <div style="text-align: center; margin: 30px 0;">
        <a href="${profileUrl}" style="background-color: #0d77f4; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">Закончить свой профиль</a>
    </div>
    <p>Если у вас есть какие-то вопросы, мы всегда рады будем вам ответить</p>
    <p>С заботой,<br><b>VK TEAM</b></p>
</div>
</body>
</html>`
    )
}

export const createConnectionAcceptedEmailTemplate = (senderName, recipientName, profileUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connection Request Accepted</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
<img style="width: 100%" src="https://resize.yandex.net/mailservice?url=https%3A%2F%2Fsun4-18.userapi.com%2FJW3-a2wfgdVGYQ6gjSXBkZEyE2EeYbhJveCmLg%2FPS3Mj1zuj1E.jpg&proxy=yes&key=14142501d471eadd3a022ea15f3eb4ab" alt="">
<div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
  <p style="font-size: 18px; color: #0d77f4;"><strong>Hello ${senderName},</strong></p>
  <p>Great news! <strong>${recipientName}</strong> has accepted your connection request on UnLinked.</p>
  <div style="background-color: #edf2ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="font-size: 16px; margin: 0;"><strong>What's next?</strong></p>
    <ul style="padding-left: 20px;">
      <li>Check out ${recipientName}'s full profile</li>
      <li>Send a message to start a conversation</li>
      <li>Explore mutual connections and interests</li>
    </ul>
  </div>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${profileUrl}" style="background-color: #0d77f4; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">View ${recipientName}'s Profile</a>
  </div>
  <p>Expanding your professional network opens up new opportunities. Keep connecting!</p>
  <p>Best regards,<br>The UnLinked Team</p>
</div>
</body>
</html>
`;

export const createCommentNotificationEmailTemplate = (recipientName, commenterName, postUrl, commentContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Comment on Your Post</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
<img style="width: 100%" src="https://resize.yandex.net/mailservice?url=https%3A%2F%2Fsun4-18.userapi.com%2FJW3-a2wfgdVGYQ6gjSXBkZEyE2EeYbhJveCmLg%2FPS3Mj1zuj1E.jpg&proxy=yes&key=14142501d471eadd3a022ea15f3eb4ab" alt="">
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 18px; color: #0d77f4;"><strong>Hello ${recipientName},</strong></p>
    <p>${commenterName} has commented on your post:</p>
    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0;">"${commentContent}"</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href=${postUrl} style="background-color: #0d77f4; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">View Comment</a>
    </div>
    <p>Stay engaged with your network by responding to comments and fostering discussions.</p>
    <p>Best regards,<br>The UnLinked Team</p>
  </div>
</body>
</html>
`;