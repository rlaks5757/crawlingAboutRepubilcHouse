const nodemailer = require("nodemailer");
const gmailInfo = require("../gmailInfo");

const sendMail = async (arr) => {
  const { user, pass, to, from } = gmailInfo;

  const transporter = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: user, // 보내는 메일의 주소
      pass: pass, // 보내는 메일의 비밀번호
    },
  };
  const mailer = nodemailer.createTransport(transporter);

  const htmlContents = await arr.map((com, idx) => {
    return `<b>title_${idx + 1}: </b> ${com.title} <br />
    <b>link_${idx + 1}: </b> ${com.link} <br />
    <b>date_${idx + 1}: </b> ${com.date} <br /><br />`;
  });

  const data = {
    to: to,
    from: from,
    subject: "역세권 청년주택 공지사항",
    text: "역세권 청년주택 공지사항",
    html: htmlContents.join(),
  };

  try {
    const response = await mailer.sendMail(data);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
