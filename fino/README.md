# FinO

# Prerequisites
1. Angular 15 and Node 16 must be installed.
2. You need an existing firebase project for the app.

## Setup
1. To configure firebase, generate environment files by running `ng generate environments`.
2. Next, add your firebase configuration to the newly created `environment.ts`:
   ```typescript
   export const environment = {
     firebase: {
     projectId: '<your-config>',
     appId: '<your-config>',
     storageBucket: '<your-config>',
     apiKey: '<your-config>',
     authDomain: '<your-config>',
     messagingSenderId: '<your-config>',
     },
   };
   ```
3. Change the file `.firebase.rc` to match your project configuration.
4. To build and deploy the app, run `ng deploy`.
5. to build and deploy the cloud functions, `cd` into `functions/` and run `npm run build && npm run deploy`.
