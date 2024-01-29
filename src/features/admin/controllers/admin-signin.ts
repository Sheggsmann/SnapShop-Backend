import { IAdminDocument } from '@admin/interfaces/admin.interface';
import { BadRequestError } from '@global/helpers/error-handler';
import { adminService } from '@service/db/admin.service';
import { Helpers } from '@global/helpers/helpers';
import { Request, Response } from 'express';
import { Role } from '@user/interfaces/user.interface';
import HTTP_STATUS from 'http-status-codes';

class SignIn {
  public async read(req: Request, res: Response): Promise<void> {
    const { email, role, password } = req.body;

    const admin: IAdminDocument | null = await adminService.getAdmin(role, email);
    if (!admin) throw new BadRequestError('Admin not found');

    const isPasswordCorrect = await admin.comparePassword(password);
    if (!isPasswordCorrect) throw new BadRequestError('Invalid credentials');

    const adminJwt: string = Helpers.signToken({
      adminId: admin._id,
      roles: [Role.Admin],
      name: admin.name,
      email: admin.email
    });

    res.status(HTTP_STATUS.OK).json({ message: 'Signin Successful', admin, token: adminJwt });
  }
}

export const adminSignin: SignIn = new SignIn();
