import { Router } from 'express'
import { authorization } from '../middleware/auth.middleware'
import { realTimeController } from '../controllers/realtime.controller'

const router = Router()

router.get("/status", authorization, realTimeController.updateStatusUser)
router.get("/compiler", realTimeController.getResultCompile)
router.get("/compiler/submission", realTimeController.getResultSubmission)

export { router as realTimeRouter }
