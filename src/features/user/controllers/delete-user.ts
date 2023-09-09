import { Request, Response } from "express";
import { userService } from "@service/db/user.service";
import HTTP_STATUS from "http-status-codes";

class Delete {
    public async user(req: Request, res: Response): Promise<void> {
        // implement function to delete user from user model and auth model. 
        await userService.deleteUser(req.params.userId);

        res.status(HTTP_STATUS.OK).json({ message: "User deleted successfully" });
    }
}

export const deleteUser: Delete = new Delete();