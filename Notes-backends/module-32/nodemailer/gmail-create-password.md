# Nodemailer--------------------------------

1. npm i nodemailer --force
   npm i @types/nodemailer --f

2. google account ----Generated app password(copy to)--------------------------
   --> google account --> google_password ---> SMTP_email---> programmerazizulhakim@gmail.com

   --> 2-step-verification--> on---> google acccount
   --> secuirity --->
   --> Search----> App password
   --> App_name --: Azizul Hakim --> OK---> Generated app password(copy to)

   --> google smtp host ---> smtp.gmail.com
   --> gmail smpt port ---> 465

3. .env ------------------------------------
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=programmerazizulhakim@gmail.com
   SMTP_PASS=cfrk zele myub vsgm
   SMTP_FROM=programmerazizulhakim@gmail.com

4. utilily/sendEmail.ts-----------------------------

```js
/* eslint-disable no-console */
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { envVars } from "../app/config/env.js";

const transporter = nodemailer.createTransport({
  host: envVars.SMTP_HOST,
  port: Number(envVars.SMTP_PORT),
  secure: true,
  auth: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
  },
});

interface ISendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, unknown>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: ISendEmailOptions) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "app",
    "templates",
    `${templateName}.ejs`,
  );

  const html = await ejs.renderFile(templatePath, templateData);

  const info = await transporter.sendMail({
    from: envVars.SMTP_FROM,
    to: to,
    subject: subject,
    html: html,
    attachments: attachments?.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
      contentType: attachment.contentType,
    })),
  });

  console.log(`✉️ Email sent to ${to}: ${info.messageId}`);

  return info;
};


```

4. ejs ------------------------------------------------
   1. --> npm i ejs
      --> npm i @types/ejs

5. templates----------------------------------------
   --> utility/template/forgetPassword.html

```js
//! forget-password Users Service-------------------------------------------------------
const forgetPasswordUser = async (email: string) => {
  const isUserExist = await UserModel.findOne({ email });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User dose not exist!");
  }

  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is blocked!");
  }

  if (isUserExist.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted!");
  }

  if (!isUserExist.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User isn't verified!");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const resetUrlLink = `${envVars.FORNTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  await sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetpassword",
    templateData: {
      name: isUserExist.name,
      resetLink: resetUrlLink,
    },
  });
};
```

6. API forgetPassword--------------------------------------

```js

```
