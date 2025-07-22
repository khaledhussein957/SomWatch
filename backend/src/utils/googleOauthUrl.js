import { ENV } from "../config/env.js";

const getGoogleAuthURL = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: ENV.GOOGLE_REDIRECT_URI,
        client_id: ENV.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: ENV.NODE_ENV === "development" ? "consent" : undefined,
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ].join(" "),
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
};

export default getGoogleAuthURL;
