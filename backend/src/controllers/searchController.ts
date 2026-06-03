import { asyncHandler } from "../utils/asyncHandler";
import { searchTutors } from "../services/matchService";

function numberParam(value: unknown) {
  return value === undefined ? undefined : Number(value);
}

export const searchTutorsController = asyncHandler(async (req, res) => {
  const tutors = await searchTutors({
    subject: req.query.subject as string,
    classLevel: req.query.classLevel as string,
    lat: numberParam(req.query.lat),
    lng: numberParam(req.query.lng),
    radius: numberParam(req.query.radius),
    mode: req.query.mode as never,
    maxRate: numberParam(req.query.maxRate),
    minRating: numberParam(req.query.minRating),
    gender: req.query.gender as string,
    verificationLevel: numberParam(req.query.verificationLevel),
    availability: req.query.availability as string,
    sortBy: req.query.sortBy as never
  });
  res.json({ data: { tutors } });
});

export const tutorMapController = asyncHandler(async (req, res) => {
  const tutors = await searchTutors({
    subject: req.query.subject as string,
    classLevel: req.query.classLevel as string,
    lat: numberParam(req.query.lat),
    lng: numberParam(req.query.lng),
    radius: numberParam(req.query.radius),
    mode: req.query.mode as never,
    maxRate: numberParam(req.query.maxRate),
    minRating: numberParam(req.query.minRating)
  });
  res.json({
    data: {
      markers: tutors.map((tutor) => ({
        id: tutor.id,
        profileUrl: tutor.profileUrl,
        name: tutor.user?.name,
        latitude: tutor.latitude,
        longitude: tutor.longitude,
        ratingAvg: tutor.ratingAvg,
        hourlyRate: tutor.hourlyRate,
        verificationLevel: tutor.verificationLevel,
        smartMatchScore: tutor.smartMatchScore
      }))
    }
  });
});

