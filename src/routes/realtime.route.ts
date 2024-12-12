import { Router } from 'express'
import { authorization } from '../middleware/auth.middleware'
import { realTimeController } from '../controllers/realtime.controller'

const router = Router()

router.get("/status", authorization, realTimeController.updateStatusUser)
router.get("/compiler", authorization, realTimeController.getResultCompile)
router.get("/compiler/submission", authorization, realTimeController.getResultSubmission)

export { router as realTimeRouter }
