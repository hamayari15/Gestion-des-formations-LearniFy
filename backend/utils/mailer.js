const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendWelcomeEmail = async (to, fullName, language = "en") => {
  const loginUrl = `${process.env.CLIENT_URL}/login`;

  const translations = {
    en: {
      subject: "Welcome!",
      greeting: `Hello ${fullName},`,
      message:
        "Your account has been created successfully. You can now log in and browse the available training courses.",
      button: "Login",
      footer: "Thank you!",
    },
    fr: {
      subject: "Bienvenue !",
      greeting: `Bonjour ${fullName},`,
      message:
        "Votre compte a été été créé avec succès. Vous pouvez maintenant vous connecter et consulter les formations disponibles.",
      button: "Se connecter",
      footer: "Merci !",
    },
  };

  const t = translations[language] || translations.en;

  await transporter.sendMail({
    from: `"LearniFy" <${process.env.MAIL_USER}>`,
    to,
    subject: t.subject,
    html: `
      <p>${t.greeting}</p>

      <p>${t.message}</p>

      <p>
        <a href="${loginUrl}" style="
          display:inline-block;
          padding:10px 20px;
          background:#2563eb;
          color:#fff;
          text-decoration:none;
          border-radius:6px;
        ">
          ${t.button}
        </a>
      </p>

      <p>${t.footer}</p>
    `,
  });
};