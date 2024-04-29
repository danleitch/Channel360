import express, { Request, Response } from 'express'
import { currentAdmin } from "@channel360/core";

const router = express.Router()

router.get(
  '/api/admin/currentadmin',
  currentAdmin,
  (req: Request, res: Response) => {
    res.send({ currentAdmin: req.currentAdmin || null })
  }
)

export { router as currentAdminRouter }