import { defineConfig } from 'cypress';
const { rmdir } = require('fs');

export default defineConfig({
  // setupNodeEvents can be defined in either the e2e or component configuration.
  // DeleteFolder is a custom task used in subscribers_flow.cy.js
  projectId: "oaps1g",
  e2e: {
    defaultCommandTimeout: 30000,

    setupNodeEvents(on, _config) {
      on('task', {
        deleteFolder(downloads) {
          console.log('deleting folder %s', downloads);

          return new Promise((resolve, reject) => {
            rmdir(downloads, { maxRetries: 10, recursive: true }, (err: string) => {
              if (err) {
                console.error(err);
                return reject(err);
              }
              resolve(null);
            });
          });
        },
      });
    },
  },
});
