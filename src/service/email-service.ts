import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import fs from "fs";
import path from "path";
import mustache from "mustache";
import dotenv from "dotenv";
dotenv.config();

class EmailService {
  private ses: SESClient;

  constructor() {
    this.ses = new SESClient({ region: "us-east-1" });
  }

  private messageResponse(token: string): string {
    const templatePath = path.resolve(__dirname, "../static/index.mustache");
    const templateMessage = fs.readFileSync(templatePath, "utf-8");
    return mustache.render(templateMessage, { token });
  }

  private createSendEmailCommand(
    toAddress: string,
    fromAddress: string,
    message: string,
  ): SendEmailCommand {
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

  public async sendEmailToken(email: string, token: string): Promise<void> {
    const message = this.messageResponse(token);
    const command = this.createSendEmailCommand(
      email,
      process.env.SENDER_EMAIL_ADDRESS!,
      message,
    );

    try {
      await this.ses.send(command);
    } catch (error) {
      throw error;
    }
  }
}

export default EmailService;
