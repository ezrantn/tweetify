import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import fs from "fs";
import path from "path";
import mustache from "mustache";
require("dotenv").config();

const ses = new SESClient({ region: "us-east-1" });

const messageResponse = (token: string): string => {
  const templatePath = path.resolve(__dirname, "../static/index.mustache");
  const templateMessage = fs.readFileSync(templatePath, "utf-8");
  const messageToken = token;
  const html = mustache.render(templateMessage, { token: messageToken });
  return html;
};

function createSendEmailCommand(
  toAddress: string,
  fromAddress: string,
  message: string,
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
        Html: {
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
    message,
  );

  try {
    return await ses.send(command);
  } catch (error) {
    console.log("Error sending email", error);
    return error;
  }
}
