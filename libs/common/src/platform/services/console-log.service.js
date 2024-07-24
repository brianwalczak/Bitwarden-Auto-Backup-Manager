"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogService = void 0;
const log_level_type_enum_1 = require("../enums/log-level-type.enum");
class ConsoleLogService {
    constructor(isDev, filter = null) {
        this.isDev = isDev;
        this.filter = filter;
        this.timersMap = new Map();
    }
    debug(message, ...optionalParams) {
        if (!this.isDev) {
            return;
        }
        this.write(log_level_type_enum_1.LogLevelType.Debug, message, ...optionalParams);
    }
    info(message, ...optionalParams) {
        this.write(log_level_type_enum_1.LogLevelType.Info, message, ...optionalParams);
    }
    warning(message, ...optionalParams) {
        this.write(log_level_type_enum_1.LogLevelType.Warning, message, ...optionalParams);
    }
    error(message, ...optionalParams) {
        this.write(log_level_type_enum_1.LogLevelType.Error, message, ...optionalParams);
    }
    write(level, message, ...optionalParams) {
        if (this.filter != null && this.filter(level)) {
            return;
        }
        switch (level) {
            case log_level_type_enum_1.LogLevelType.Debug:
                // eslint-disable-next-line
                console.log(message, ...optionalParams);
                break;
            case log_level_type_enum_1.LogLevelType.Info:
                // eslint-disable-next-line
                console.log(message, ...optionalParams);
                break;
            case log_level_type_enum_1.LogLevelType.Warning:
                // eslint-disable-next-line
                console.warn(message, ...optionalParams);
                break;
            case log_level_type_enum_1.LogLevelType.Error:
                // eslint-disable-next-line
                console.error(message, ...optionalParams);
                break;
            default:
                break;
        }
    }
}
exports.ConsoleLogService = ConsoleLogService;
//# sourceMappingURL=console-log.service.js.map