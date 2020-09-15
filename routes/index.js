const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const config = require("../config/key");
const multer = require("multer");

let attachement = {};

const upload = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      return cb(new Error("Must be an Image or pdf"));
    }
    attachement.fileName = file.originalname;
    attachement.fileType = file.originalname.split(".").pop();
    return cb(undefined, true);
  },
});

router.post("/user/me/file1", upload.single("file1"), async (req, res) => {
  attachement.buffer = req.file.buffer.toString("base64");
  res.send({
    buffer: req.file.buffer,
  });
});

sgMail.setApiKey(config.sendGridKey);

router.get("/", (req, res) => {
  res.render("dashboard", {
    name: "waleed rafi",
  });
});

router.post("/sendEmail", async (req, res) => {
  let msg;
  const rawEmailsTo = req.body.emailTo.split("\n");
  const emailsTo = rawEmailsTo.map((email) => {
    return email.trim();
  });
  if (req.body) {
    if (req.body.selectedRadio === "text") {
      if (!attachement || !attachement.buffer) {
        emailsTo.forEach((emailTo) => {
          msg = {
            to: emailTo,
            from: req.body.sender,
            subject: req.body.subject,
            text: req.body.body,
          };
          sgMail.send(msg);
        });
      } else {
        emailsTo.forEach((emailTo) => {
          msg = {
            to: emailTo,
            from: req.body.sender,
            subject: req.body.subject,
            text: req.body.body,
            attachments: [
              {
                content: attachement.buffer,
                filename: attachement.fileName,
                type: "application/" + attachement.fileType,
                disposition: "attachment",
              },
            ],
          };
          sgMail.send(msg);
        });
      }
    } else if (req.body.selectedRadio === "html") {
      if (!attachement || !attachement.buffer) {
        emailsTo.forEach((emailTo) => {
          msg = {
            to: emailTo,
            from: req.body.sender,
            subject: req.body.subject,
            html: req.body.body,
          };
          sgMail.send(msg);
        });
      } else {
        emailsTo.forEach((emailTo) => {
          msg = {
            to: emailTo,
            from: req.body.sender,
            subject: req.body.subject,
            html: req.body.body,
            attachments: [
              {
                content: attachement.buffer,
                filename: attachement.fileName,
                type: "application/" + attachement.fileType,
                disposition: "attachment",
              },
            ],
          };
          sgMail.send(msg);
        });
      }
    }

    attachement = {};
    return res.json({
      message: "ok",
    });
  }
  res.json({
    err: "no body",
  });
});

module.exports = router;
