"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchesWorker = void 0;
const config_1 = require("../../config");
const searches_service_1 = require("../services/db/searches.service");
const log = config_1.config.createLogger('searches worker');
class SearchesWorker {
    addSearchTermToDB(job, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = job;
                yield searches_service_1.searchesService.add(data.searchParam, data.location);
                job.progress(100);
                done(null, data);
            }
            catch (err) {
                log.error(err);
                done(err);
            }
        });
    }
}
exports.searchesWorker = new SearchesWorker();
