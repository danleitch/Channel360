import request from 'supertest';
import { app } from '../../app';
import { createLogs } from './helpers/createLogs';

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
    };
});

describe('Get Logs return from, {{url}}/api/logging/{{orgId}}?order=desc', () => {
    it('Find and returns Log shape using Org ID', async () => {
        const organization = await global.createOrganization();

        // Create Logs
        const firstLog = await createLogs(organization.id, 'Hello  1');
        await firstLog.save();

        const secondLog = await createLogs(organization.id, 'Hello  2');
        await secondLog.save();

        const thirdLog = await createLogs(organization.id, 'Hello  3');
        await thirdLog.save();

        const fourthLog = await createLogs(organization.id, 'Hello  4');
        await fourthLog.save();

        const ReturnedLogs = await request(app)
            .get(`/api/logging/${organization.id}`)
            .send()
            .expect(200);

        expect(ReturnedLogs.body).toMatchObject({
            logs: expect.arrayContaining([
                expect.objectContaining({
                    conversationId: expect.any(String),
                    messageText: expect.stringMatching(/Hello {2}\d/),
                    direction: 'inboundExample',
                    status: 'successExample',
                    organization: organization.id,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    version: 0,
                    id: expect.any(String)
                })
            ]),
            totalLogs: 4
        });
    });

    it('Find and returns SORTED Logs Newest to Oldest', async () => {
        const organization = await global.createOrganization();

        // Create Logs
        const firstLog = await createLogs(organization.id, 'Hello  1');
        await firstLog.save();

        const secondLog = await createLogs(organization.id, 'Hello  2');
        await secondLog.save();

        const thirdLog = await createLogs(organization.id, 'Hello  3');
        await thirdLog.save();

        const fourthLog = await createLogs(organization.id, 'Hello  4');
        await fourthLog.save();

        const ReturnedLogs = await request(app)
            .get(`/api/logging/${organization.id}?order=desc`)
            .send()
            .expect(200);


        expect(ReturnedLogs.body).toMatchObject({
            logs: expect.arrayContaining([
                expect.objectContaining({
                    conversationId: expect.any(String),
                    messageText: expect.stringMatching(/Hello {2}\d/),
                    direction: 'inboundExample',
                    status: 'successExample',
                    organization: organization.id,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    version: 0,
                    id: expect.any(String)
                })
            ]),
            totalLogs: 4
        });

          // Check order
        for (let i = 0; i < ReturnedLogs.body.logs.length; i++) {
            expect(ReturnedLogs.body.logs[i].messageText).toBe(`Hello  ${4 - i}`);
        }
    });
});
