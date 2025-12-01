import chalk from "chalk"; // if you picked the easy option, remove this from package.json
import morgan from "morgan";
import logger from "../lib/logger.js";

const httpLogMiddleware = morgan(
	(tokens, req, res) => {
		const status = Number(tokens.status(req, res));
		let statusColor = chalk.white;
		if (status >= 500) {
			statusColor = chalk.red;
		} else if (status >= 400) {
			statusColor = chalk.yellow;
		} else if (status >= 300) {
			statusColor = chalk.cyan;
		} else if (status >= 200) {
			statusColor = chalk.green;
		}

		return [
			chalk.blue(tokens.method(req, res)),
			tokens.url(req, res),
			statusColor(tokens.status(req, res)),
			chalk.magenta(`${tokens["response-time"](req, res)} ms`),
			chalk.gray(`${tokens.res(req, res, "content-length") || 0} bytes`),
		].join(" ");
	},
	{
		stream: {
			write: (message) => logger.info(message.trim()),
		},
	},
);

export default httpLogMiddleware;
