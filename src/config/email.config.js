const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "test356sales@gmail.com",
    pass: process.env.MAIL_PASS,
  },
});

//to can also take array of valid emails
async function sendEmail(to, subject, html) {
  return new Promise(async (resolve, reject) => {
    let info = await transporter
      .sendMail({
        from: "test356sales@gmail.com",
        to,
        subject,
        text: "Text Here!",
        html,
      })
      .catch((e) => {
        reject(e);
      });

    if (info?.messageId) {
      resolve("email sent");
    }
  });
}

async function sendVerifyEmail(name, email, id) {
  console.log(name, email, id);
  try {
    const mailOptions = {
      from: "test356sales@gmail.com",
      to: email,
      subject: "for Verification mail",
      html:
        "<p>Hii" +
        name +
        ', please click here to <a href="http://loclhost:3000/verify?id= ' +
        id +
        '">Verify</a>your mail</p>',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:-", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { sendEmail, sendVerifyEmail };
