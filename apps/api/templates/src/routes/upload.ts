import { S3Client } from '@aws-sdk/client-s3'
import {
	requireAuth,
	validateCognitoTokenAndOrganization,
} from '@channel360/core'
import express, { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'

const region = { region: 'af-south-1' }
const s3 = new S3Client(region)

export const uploadFiles = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const upload = multer({
		storage: multerS3({
			contentType: multerS3.AUTO_CONTENT_TYPE,
			contentDisposition: 'inline',
			s3: s3,
			bucket: 'channel360-template-tags',
			metadata: function (req, file, cb) {
				cb(null, { fieldName: file.fieldname })
			},
			key: function (req, file, cb) {
				cb(null, `${new Date().toISOString()}-${file.originalname}`)
			},
		}),
		fileFilter: function (req, file, cb) {
			// Define the allowed file extensions.
			const allowedMimetypes = [
				'application/pdf',
				'text/csv',
				'image/jpeg',
				'video/mp4',
			]

			// Check if the file's mimetype is in the list of allowed mimetypes.
			if (allowedMimetypes.includes(file.mimetype)) {
				cb(null, true)
			} else {
				// Reject the file if no match.
				cb(null, false)
			}
		},
		limits: {
			fileSize: 15728640,
			files: 10,
		},
	}).any()

	upload(req, res, (error) => {
		if (error) {
			if (error instanceof multer.MulterError) {
				return res.status(400).json({
					message: 'Upload unsuccessful',
					errorMessage:
						error.message ||
						'File type not allowed. Only .pdf, .csv, .jpeg files are accepted.',
					errorCode: error.code,
				})
			} else if (error.message) {
				return res.status(400).json({
					message: 'Upload unsuccessful',
					errorMessage: error.message,
				})
			} else {
				return res.status(500).json({
					message: 'Error occurred',
					errorMessage: error.message,
				})
			}
		}

		next()
	})
}

// NOTE: This route is for cleints to upload .pdf, .csv, .jpeg used for whatapp attachments only, not for templates creation that's a convension route serice.
const router = express.Router()
router.post(
	'/api/templates/upload',
	requireAuth,
	uploadFiles,
	async (req: Request, res: Response) => {
		const uploadedFiles = req.files
		res.status(201).send({ uploadedFiles })
	}
)

router.post(
	'/webapi/org/:orgId/templates/upload',
	uploadFiles,
	validateCognitoTokenAndOrganization,
	async (req: Request, res: Response) => {
		const uploadedFiles = req.files
		res.status(200).send({ uploadedFiles })
	}
)

export { router as uploadRouter }
