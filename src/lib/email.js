import nodemailer from "nodemailer";
import errorUtils from "../utils/error.utils.js";
import logger from "./logger.js";

const transporter = nodemailer.createTransport({
	host: process.env.GMAIL_HOST,
	port: 465,
	secure: true,
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASSWORD,
	},
});

export default async function sendEmail({ to, subject, text, html }) {
	const [err, _data] = await errorUtils(
		transporter.sendMail({
			from: process.env.GMAIL_USER,
			to,
			subject,
			text,
			html,
		}),
	);

	if (err) {
		logger.error(err);
		return false;
	}

	logger.debug(`Email sent successfully to ${to}`);
	return true;
}
