"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authWorker = void 0;
const config_1 = require("../../config");
const auth_service_1 = require("../services/db/auth.service");
const log = config_1.config.createLogger('Auth Worker');
class AuthWorker {
    async addAuthUserToDB(job, done) {
        try {
            const { value } = job.data;
            await auth_service_1.authService.createAuthUser(value);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
}
exports.authWorker = new AuthWorker();
