import Amplify, { Auth } from 'aws-amplify';
import config from "../config.json";

Amplify.configure({
    Auth: {
        region: config["cognito-region"],
        userPoolId: config["cognito-pool-id"],
        userPoolWebClientId: config["cognito-client-id"]
    }
});

// You can get the current config object
Auth.configure();
