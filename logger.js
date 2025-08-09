import { createLogger, format, transports } from "winston";
const { combine, colorize, json, timestamp } = format;

const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message }) => {
    return `${level}: ${message}`;
  })
);

const logger = createLogger({
  level: "info",
  format: combine(
    colorize(), json(), timestamp()
  ),
  transports: [
    new transports.Console({
      format: consoleLogFormat
    }),
    new transports.File({
      filename: "app.log"
    })
  ]
})

export default logger;