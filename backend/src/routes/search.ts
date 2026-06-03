import { Router } from "express";
import { query } from "express-validator";
import { searchTutorsController, tutorMapController } from "../controllers/searchController";
import { validateRequest } from "../middleware/validate";

export const searchRouter = Router();

const searchValidation = [
  query("lat").optional().isFloat({ min: -90, max: 90 }),
  query("lng").optional().isFloat({ min: -180, max: 180 }),
  query("radius").optional().isFloat({ min: 1, max: 50 }),
  query("maxRate").optional().isFloat({ min: 1 }),
  query("minRating").optional().isFloat({ min: 1, max: 5 }),
  query("mode").optional().isIn(["ONLINE", "OFFLINE", "BOTH"]),
  query("sortBy").optional().isIn(["distance", "rating", "price", "smart_score"])
];

searchRouter.get("/tutors", searchValidation, validateRequest, searchTutorsController);
searchRouter.get("/tutors/map", searchValidation, validateRequest, tutorMapController);

