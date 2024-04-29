export const natsWrapper = {
    client: {
        jetstream: jest.fn().mockImplementation(() => {
            return {
                publish: jest.fn().mockImplementation((subject: string, data: string) => {
                    return new Promise((resolve, reject) => {
                        resolve({ stream: 'stream', seq: 1 });
                    });
                })
            }
        })
    }
};
