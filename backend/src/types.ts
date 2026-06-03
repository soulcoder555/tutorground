import type { Request } from "express";
import type { Role } from "@prisma/client";

export type AuthUser = {
  id: string;
  role: Role;
  email: string;
  name: string;
};

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export type ApiResponse<T> = {
  data: T;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

