"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchesWorker = void 0;
const config_1 = require("../../config");
const searches_service_1 = require("../services/db/searches.service");
const log = config_1.config.createLogger('searches worker');
class SearchesWorker {
    async addSearchTermToDB(job, done) {
        try {
            const { data } = job;
            await searches_service_1.searchesService.add(data.searchParam, data.location, data.user);
            job.progress(100);
            done(null, data);
        }
        catch (err) {
            log.error(err);
            done(err);
        }
    }
}
exports.searchesWorker = new SearchesWorker();
