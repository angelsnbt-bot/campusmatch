import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import verificationRouter from "./verification";
import profileRouter from "./profile";
import discoverRouter from "./discover";
import connectionsRouter from "./connections";
import contentRouter from "./content";
import modulesRouter from "./modules";
import adminRouter from "./admin";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(verificationRouter);
router.use(profileRouter);
router.use(discoverRouter);
router.use(connectionsRouter);
router.use(contentRouter);
router.use(modulesRouter);
router.use(adminRouter);
router.use(uploadRouter);

export default router;
