"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = void 0;
class UpdateOrder {
    async orderPayment(req, res) {
        console.log('\n\n');
        // console.log('[REQUEST HEADERS]:', req.headers);
        console.log('\n[REQUEST BODY]:', req.body);
        const eventData = req.body;
        console.log('\nMETADATA:', eventData.data.metadata);
        res.send(200);
        // res.status(HTTP_STATUS.OK);
    }
}
exports.updateOrder = new UpdateOrder();
