export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, message: string, code = "APP_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function badRequest(message: string, code = "BAD_REQUEST") {
  return new ApiError(400, message, code);
}

export function unauthorized(message = "Authentication required", code = "UNAUTHORIZED") {
  return new ApiError(401, message, code);
}

export function forbidden(message = "You do not have permission for this action") {
  return new ApiError(403, message, "FORBIDDEN");
}

export function notFound(message = "Resource not found") {
  return new ApiError(404, message, "NOT_FOUND");
}

export function conflict(message: string) {
  return new ApiError(409, message, "CONFLICT");
}
