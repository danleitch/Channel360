import request from 'supertest'
import { app } from '@app' // Assuming app is your express application instance.

// Mock multer-s3 and AWS S3
jest.mock('@aws-sdk/client-s3')
jest.mock('multer-s3')

describe('CSV Upload Route', () => {
	it('should upload a CSV successfully', async () => {
		// Create a mock CSV Buffer.
		const csvBuffer = Buffer.from('header1,header2\nvalue1,value2')

		const response = await request(app)
			.post('/api/templates/upload')
			.attach('csv', csvBuffer, 'test.csv')

		expect(response.status).toEqual(201)
		expect(response.body).toHaveProperty('uploadedFiles')
	})
})
