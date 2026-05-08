// Configuration file for TripCloud frontend
// Local Live Server uses the backend on port 3000. Azure App Service uses same-origin API calls.
const API_BASE_URL = (function() {
    const isLocalStaticFrontend =
        window.location.protocol === 'file:' ||
        window.location.port === '5500' ||
        window.location.port === '8080';

    if (isLocalStaticFrontend) {
        return 'http://localhost:3000';
    }

    return window.location.origin;
})();
