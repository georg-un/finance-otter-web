# FinO

## Setup

1. This project has been developed with Angular 15 and Node 16. 
2. To configure firebase, generate environment files by running `ng generate environments`.
3. Next, add your firebase configuration to the newly created `environment.ts`:
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
4. To build and deploy the app, run `ng deploy`.
