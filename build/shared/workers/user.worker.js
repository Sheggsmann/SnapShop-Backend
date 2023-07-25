"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userWorker = void 0;
const config_1 = require("../../config");
const user_service_1 = require("../services/db/user.service");
const log = config_1.config.createLogger('User Worker');
class UserWorker {
    async addUserToDB(job, done) {
        try {
            const { value } = job.data;
            await user_service_1.userService.createUser(value);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
    async updateUserInDB(job, done) {
        try {
            const { key, value } = job.data;
            await user_service_1.userService.updateUser(key, value);
            job.progress(100);
            done(null, job.data);
        }
        catch (err) {
            done(err);
        }
    }
}
exports.userWorker = new UserWorker();
