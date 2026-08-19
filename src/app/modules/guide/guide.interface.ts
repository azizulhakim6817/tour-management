import { Types } from "mongoose";

export enum IGuideApplicationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ARCHIVED = "ARCHIVED",
}

export interface IGuideApplication {
  userId: Types.ObjectId;
  nidPhoto: string;
  divisionId: Types.ObjectId;
  status: IGuideApplicationStatus;
}
