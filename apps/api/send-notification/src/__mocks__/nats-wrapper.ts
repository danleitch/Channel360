export const natsWrapper = {
    client: {
        jetstream: jest.fn().mockImplementation(() => {
            return {
                publish: jest.fn().mockImplementation(() => {
                    return new Promise((resolve, _) => {
                        resolve({ stream: 'stream', seq: 1 });
                    });
                })
            }
        })
    }
};
