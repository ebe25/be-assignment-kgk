
# User Authentication and Logout

## Endpoints

1. **Register/Login/Logout**
   - `POST /api/v1/register`: Endpoint to register to app.
   - `POST /api/v1/login`: Endpoint to login to app.
   - `POST /api/v1/logout`: Endpoint to logout from app.

2. **Authenticated Routes**
   - `GET /api/v1/dashboard`: Endpoint for user's dashboard.
   - `GET /api/v1/wallet`: Endpoint to access user's wallet.

3. **Refresh Token**
 `POST /api/v1/refresh/{userId}`: Endpoint to     refresh access token using refresh token.
