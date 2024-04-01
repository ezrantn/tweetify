import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
require("dotenv").config();

const ses = new SESClient({ region: "us-east-1" });

const messageResponse = (token: string): string => {
  return `<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .message {
      margin-bottom: 20px;
    }
    .token {
      font-size: 18px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <p class="message">Dear user,</p>
    <p class="message">Thank you for logging in to our application. Your one-time password is: <span class="token">${token}</span></p>
    <p class="message">We hope you have a great experience!</p>
    <p class="message">Best regards,<br/>Tweetify</p>
  </div>
</body>
</html>`;
};

function createSendEmailCommand(
  toAddress: string,
  fromAddress: string,
  message: string
) {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Source: fromAddress,
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Your one-time password",
      },
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: message,
        },
      },
    },
  });
}
export async function sendEmailToken(email: string, token: string) {
  const message = messageResponse(token);
  const command = createSendEmailCommand(
    email,
    "ezrantn.dev@gmail.com",
    message
  );

  try {
    return await ses.send(command);
  } catch (error) {
    console.log("Error sending email", error);
    return error;
  }
}
