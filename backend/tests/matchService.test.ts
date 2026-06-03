import { describe, expect, it } from "vitest";
import { calculateSmartMatchScore, subjectMatchScore } from "../src/services/matchService";
import { haversineDistanceKm } from "../src/utils/distance";

describe("Smart Match Score", () => {
  it("scores exact subject matches higher than partial matches", () => {
    expect(subjectMatchScore(["Math", "Physics"], "Math")).toBe(100);
    expect(subjectMatchScore(["Mathematics"], "Math")).toBe(50);
  });

  it("uses the weighted marketplace formula", () => {
    const score = calculateSmartMatchScore({
      distanceKm: 2,
      maxRadius: 10,
      ratingAvg: 4.5,
      consistencyScore: 90,
      subjectMatchScore: 100,
      responseRate: 80
    });
    expect(score).toBe(87.5);
  });

  it("computes nearby haversine distance in kilometers", () => {
    const distance = haversineDistanceKm(32.7266, 74.857, 32.7357, 74.8691);
    expect(distance).toBeGreaterThan(1);
    expect(distance).toBeLessThan(2);
  });
});

