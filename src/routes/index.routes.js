import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profiles.routes.js";
import challengeRoutes from "./challenges.routes.js";
import loyaltyRoutes from "./loyality.routes.js";
import tierRoutes from "./tier.routes.js";
import userChallengeRoutes from "./userChallenge.routes.js";
import rewardRoutes from "./rewards.routes.js";
import redemptionRoutes from "./redemption.routes.js";
import scanRoutes from "./scans.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user_profiles", profileRoutes);
router.use("/user_loyalty", loyaltyRoutes);
router.use("/challenges", challengeRoutes);
router.use("/user_rewards", rewardRoutes);
router.use("/user_challenges", userChallengeRoutes);
router.use("/redemptions", redemptionRoutes);
router.use("/user_tiers", tierRoutes);
router.use("/scan_logs", scanRoutes);
router.use("/tiers", loyaltyRoutes);

export default router;
