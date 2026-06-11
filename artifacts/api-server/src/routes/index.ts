import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import contactRouter from "./contact";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(adminRouter);
router.use(storageRouter);

export default router;
