import multer from "multer";
import { badRequest } from "../utils/apiError";

const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/jpg", "image/png"]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(badRequest("Only PDF, JPG, JPEG, and PNG files are allowed", "INVALID_FILE_TYPE"));
      return;
    }
    cb(null, true);
  }
});

