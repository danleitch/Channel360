export const natsWrapper = {
  client: {
    jetstream: jest.fn().mockImplementation(() => {
      return {
        publish: jest.fn().mockImplementation((_subject: string, _data: string) => {
          return new Promise((resolve, _reject) => {
            resolve({ stream: 'stream', seq: 1 });
          });
        })
      }
    })
  }
};
