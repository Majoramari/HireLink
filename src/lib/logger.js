import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

const logger = pino({
	level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
	serializers: {
		err: pino.stdSerializers.err,
	},
	transport: !isProd
		? {
				target: "pino-pretty",
				options: {
					colorize: true,
					translateTime: "yyyy-mm-dd HH:MM:ss",
					ignore: "pid,hostname",
				},
			}
		: undefined,
});

export default logger;
