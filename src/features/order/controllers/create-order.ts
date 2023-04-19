import { IOrderDocument } from '@order/interfaces/order.interface';
import { userService } from '@service/db/user.service';
import { IUserDocument } from '@user/interfaces/user.interface';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { orderQueue } from '@service/queues/order.queue';
import { validator } from '@global/helpers/joi-validation-decorator';
import { orderSchema } from '@order/schemes/order.scheme';
import HTTP_STATUS from 'http-status-codes';

class Create {
  @validator(orderSchema)
  public async order(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params;
    const { products } = req.body;

    const orderObjectId: ObjectId = new ObjectId();

    const user: IUserDocument = await userService.getUserById(req.currentUser!.userId);

    const orderData: IOrderDocument = {
      _id: orderObjectId,
      store: storeId,
      user: {
        userId: req.currentUser!.userId,
        name: `${user.firstname} ${user.lastname}`,
        mobileNumber: user.mobileNumber
      },
      products
    } as IOrderDocument;

    orderQueue.addOrderJob('addOrderToDB', { value: orderData });

    res.status(HTTP_STATUS.OK).json({ message: 'Order created successfully', order: orderData });
  }
}

export const createOrder: Create = new Create();
