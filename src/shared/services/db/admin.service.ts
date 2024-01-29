import { AdminRole, IAdminDocument } from '@admin/interfaces/admin.interface';
import { AdminModel } from '@admin/models/admin.model';

class AdminService {
  public async createAdmin(data: IAdminDocument): Promise<void> {
    await AdminModel.create(data);
  }

  public async getAdminByRole(role: keyof typeof AdminRole): Promise<IAdminDocument | null> {
    return await AdminModel.findOne({ role });
  }

  public async getAdminByEmail(email: string): Promise<IAdminDocument | null> {
    return await AdminModel.findOne({ email });
  }

  public async getAdmin(role: keyof typeof AdminRole, email: string): Promise<IAdminDocument | null> {
    return await AdminModel.findOne({ role, email });
  }

  public async updateServiceAdminUserCharge(amount: number): Promise<void> {
    await AdminModel.updateOne({ role: AdminRole.Service }, { $inc: { serviceChargeFromUsers: amount } });
  }

  public async updateServiceAdminStoreCharge(amount: number): Promise<void> {
    await AdminModel.updateOne({ role: AdminRole.Service }, { $inc: { serviceChargeFromStores: amount } });
  }
}

export const adminService: AdminService = new AdminService();
