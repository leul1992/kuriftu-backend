import { Router } from "express";
import {
  authenticate,
  checkAdmin,
  requireCompleteProfile,
} from "../middleware/auth.middleware.js";
import { checkChallengeExists } from "../middleware/challenge.middleware.js";
import { UserChallengeService } from "../services/supabase/userChallenge.service.js";

const router = Router();

// Get all user challenges
router.get("/", authenticate, async (req, res, next) => {
  try {
    const challenges = await UserChallengeService.getUserChallenges(
      req.user.id
    );
    res.json({ status: "success", data: challenges });
  } catch (error) {
    next(error);
  }
});

// Start a new challenge
router.post(
  "/",
  authenticate,
  requireCompleteProfile,
  checkChallengeExists,
  async (req, res, next) => {
    try {
      const challenge = await UserChallengeService.createUserChallenge(
        req.user.id,
        req.body.challenge_id
      );
      res.status(201).json({ status: "success", data: challenge });
    } catch (error) {
      next(error);
    }
  }
);

// Update challenge status
router.patch(
  "/:id",
  authenticate,
  requireCompleteProfile,
  checkChallengeExists,
  async (req, res, next) => {
    try {
      const challenge = await UserChallengeService.updateUserChallenge(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json({ status: "success", data: challenge });
    } catch (error) {
      next(error);
    }
  }
);

// verification endpoint
router.patch(
  "/",
  authenticate,
  requireCompleteProfile,
  async (req, res, next) => {
    try {
      const challenge = await UserChallengeService.verifyChallengeCompletion(
        req.user.id,
        req.body.subChallengeId
      );
      res.json({ status: "success", data: challenge });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
