import request from 'supertest'
import { app } from '../../app'
import { createLogs } from './helpers/createLogs'

jest.mock('../../nats-wrapper.ts', () => {
    return {
        natsWrapper: {
            client: {
                // Provide your implementation for the `jetstream` function
                jetstream: jest.fn().mockReturnThis(),
                // If `publish` function is also used, provide a mock for it as well
                publish: jest.fn().mockReturnThis(),
            },
        },
    }
})

describe('GET /api/logging/:orgId/export', () => {
    it('Successfully exports logs as CSV for an organization within a date range', async () => {
        const startDate = 'Tue, 01 Aug 2023 11:13:32 GMT'
        const currentDate = new Date()

        // Add one day so that the end date is in the future
        currentDate.setDate(currentDate.getDate() + 1)

        // Convert to the desired format
        const formattedDateToday = currentDate.toUTCString()

        const organization = await global.createOrganization()

        // Create dummy logs for testing
        const LOG_MESSAGES = ['Hello 1', 'Hello 2', 'Hello 3', 'Hello 4']

        // Looping for log creation
        for (const message of LOG_MESSAGES) {
            const log = await createLogs(organization.id, message)
            await log.save()
        }

        const response = await request(app)
            .get(
                `/api/logging/${organization.id}/export?startDate=${startDate}&endDate=${formattedDateToday}`
            )
            .expect(200)

        expect(response.header['content-type']).toEqual('text/csv')
        expect(response.text).toContain(
            'Mobile Number,Direction,Status,Message Text,Conversation Id'
        )

        // The content should match the expected CSV rows
        // Dynamic expectation generation
        for (const message of LOG_MESSAGES) {
            expect(response.text).toContain(
                `083551228,inboundExample,successExample,${message},conversationIdExample`
            )
        }
    })
})
