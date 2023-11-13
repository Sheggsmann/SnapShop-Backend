import { Request, Response } from 'express';
// import { IOrderDocument } from '@order/interfaces/order.interface';
import HTTP_STATUS from 'http-status-codes';

class UpdateOrder {
  public async orderPayment(req: Request, res: Response): Promise<void> {
    console.log('\n\n');
    // console.log('[REQUEST HEADERS]:', req.headers);
    console.log('\n[REQUEST BODY]:', req.body);

    const eventData = req.body;
    console.log('\nMETADATA:', eventData.data.metadata);

    res.send(200);
    // res.status(HTTP_STATUS.OK);
  }
}

export const updateOrder: UpdateOrder = new UpdateOrder();
