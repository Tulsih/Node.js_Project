const nodemailer = require("nodemailer");
require("dotenv").config();
const Mustache = require("mustache");
const fs = require("fs");
const path = require("path");

class EmailService {
  //retun value to send user
  getSafeUser(user) {
    return {
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.middleName} ${user.lastName}`,
      email: user.email,
      city: user.city,
      state: user.state,
      status: user.status,
      createdAt: new Date(user.createdAt).toLocaleString(),
      updatedAt: new Date(user.updatedAt).toLocaleString(),
    };
  }
  async sendBlockEmail(user) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.verify();

      //load mustache template
      const templatePath = path.join(
        __dirname,
        "../templates/accountBlocked.mustache",
      );
      const template = fs.readFileSync(templatePath, "utf-8");

      //call funtion to mustache
      const SafeUser = this.getSafeUser(user);

      //read templted
      const html = Mustache.render(template, SafeUser);

      //send eamil
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Account Blocked",
        html: html,
      });

      console.log("block email send successfully");
    } catch (error) {
      console.log("Email Error:", error.message);
    }
  }
}

module.exports = new EmailService();
