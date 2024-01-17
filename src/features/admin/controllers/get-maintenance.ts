import { Request, Response } from 'express';
import { adminService } from '@service/db/admin.service';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async maintenance(req: Request, res: Response): Promise<void> {
    const service = await adminService.getAdminByRole('Service');
    let isUnderMaintenance = false;
    if (service) {
      isUnderMaintenance = service.maintenance;
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Maintenance', isUnderMaintenance });
  }
}

export const getMaintenance: Get = new Get();
