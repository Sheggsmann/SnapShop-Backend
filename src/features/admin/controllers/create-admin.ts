import { IAdminDocument } from '@admin/interfaces/admin.interface';
import { adminSchema } from '@admin/schemes/admin.scheme';
import { validator } from '@global/helpers/joi-validation-decorator';
import { BadRequestError } from '@global/helpers/error-handler';
import { adminService } from '@service/db/admin.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Create {
  @validator(adminSchema)
  public async admin(req: Request, res: Response): Promise<void> {
    const adminExists: IAdminDocument | null = await adminService.getAdminByEmail(req.body.email);

    if (adminExists) {
      throw new BadRequestError('Admin already exists');
    }

    const admin = await adminService.createAdmin(req.body);
    res.status(HTTP_STATUS.OK).json({ message: 'Admin created successfully', admin });
  }
}

export const createAdmin: Create = new Create();
