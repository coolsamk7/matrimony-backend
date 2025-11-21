# OTP-Based Registration Flow (2-Step)

This document describes the **simplified 2-step OTP-based registration flow** implemented in the authentication system.

## Overview

The registration process consists of **2 steps**:

1. **Request OTP** - User provides mobile number
2. **Verify OTP & Complete Registration** - User provides OTP + all registration details

This approach eliminates the need for session cache and simplifies the implementation.

---

## Flow Diagram

```
┌─────────────────┐
│   User/Client   │
└────────┬────────┘
         │
         │ Step 1: POST /auth/request-otp
         │ { mobile: "+919876543210" }
         ▼
┌─────────────────────────┐
│   OtpService            │
│   (Third-party: Twilio/ │
│    AWS SNS/Mock)        │
└────────┬────────────────┘
         │
         │ OTP sent to mobile
         │
         ▼
┌─────────────────┐
│   User/Client   │
│   (Receives OTP)│
└────────┬────────┘
         │
         │ Step 2: POST /auth/complete-registration
         │ {
         │   mobile: "+919876543210",
         │   otp: "123456",
         │   username: "john_doe",
         │   password: "SecurePass@123",
         │   email: "john@example.com",
         │   dateOfBirth: "1995-01-15",
         │   gender: "male"
         │ }
         ▼
┌─────────────────────────┐
│   AuthService           │
│   1. Verify OTP         │
│   2. Validate data      │
│   3. Create user        │
│   4. Generate tokens    │
└────────┬────────────────┘
         │
         │ Returns JWT tokens
         │
         ▼
┌─────────────────┐
│   User/Client   │
│   (Authenticated)│
└─────────────────┘
```

---

## API Endpoints

### 1. Request OTP

**Endpoint:** `POST /auth/request-otp`

**Description:** Sends an OTP to the user's mobile number.

**Request Body:**

```json
{
  "mobile": "+919876543210"
}
```

**Response (200 OK):**

```json
{
  "message": "OTP sent successfully to your mobile number"
}
```

**Error Responses:**

- `409 Conflict` - Mobile number already registered
- `400 Bad Request` - Failed to send OTP

---

### 2. Verify OTP & Complete Registration

**Endpoint:** `POST /auth/complete-registration`

**Description:** Verifies OTP and completes registration with all user details.

**Request Body:**

```json
{
  "mobile": "+919876543210",
  "otp": "123456",
  "username": "john_doe",
  "password": "SecurePass@123",
  "email": "john@example.com",
  "dateOfBirth": "1995-01-15",
  "gender": "male"
}
```

**Response (201 Created):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "user": {
    "id": "01HQWXYZ...",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "APPLICATION_USER"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid or expired OTP
- `409 Conflict` - Username, email, or mobile already exists
- `400 Bad Request` - Validation errors

---

## Validation Rules

### Mobile Number

- Must be in international format (E.164)
- Pattern: `^\+?[1-9]\d{1,14}$`
- Example: `+919876543210`

### OTP

- 4-6 characters
- Alphanumeric

### Username

- 3-30 characters
- Alphanumeric and underscores only
- Pattern: `^[a-zA-Z0-9_]+$`

### Password

- Minimum 8 characters
- Must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (`@$!%*?&`)

### Email

- Valid email format
- Optional field

### Date of Birth

- ISO 8601 date format
- Example: `1995-01-15`

### Gender

- Allowed values: `male`, `female`, `other`

---

## OTP Service Configuration

The system supports multiple OTP providers through the `OtpService`:

### Environment Variables

```env
# OTP Provider Selection
OTP_PROVIDER=mock  # Options: mock, twilio, aws

# Twilio Configuration (if using Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# AWS SNS Configuration (if using AWS)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Provider Types

1. **Mock Provider** (Development)
   - Always returns success
   - Uses fixed OTP: `123456`
   - No external API calls

2. **Twilio**
   - Production-ready SMS service
   - Requires Twilio account

3. **AWS SNS**
   - Production-ready SMS service
   - Requires AWS account with SNS permissions

---

## User Creation Details

After successful OTP verification, the user is created with:

```typescript
{
  id: ulid(),                      // Unique identifier
  username: "john_doe",
  email: "john@example.com",
  mobile: "+919876543210",
  password: "hashed_password",     // Bcrypt hashed
  dateOfBirth: Date,
  gender: "male",
  role: Role.APPLICATION_USER,
  isMobileVerified: true,          // Set to true after OTP verification
  isEmailVerified: false,          // Email verification separate
  isProfileComplete: false         // Requires additional profile data
}
```

---

## Profile Completion Enforcement

Users must complete their profile before accessing protected features:

### Profile Completion Guard

The `ProfileCompletionGuard` is applied globally and enforces:

- Users with `isProfileComplete: false` cannot access protected endpoints
- Exempted routes:
  - All public routes (`@Public()` decorator)
  - Auth endpoints (login, register, token refresh)
  - Profile completion endpoints

### Example Error Response

When an incomplete profile tries to access protected features:

```json
{
  "statusCode": 403,
  "message": "Please complete your profile to access this feature",
  "error": "Forbidden"
}
```

---

## Security Features

### 1. Password Security

- Passwords are hashed using bcrypt (salt rounds: 10)
- Never stored in plain text

### 2. JWT Tokens

- Access token: Short-lived (15 minutes default)
- Refresh token: Long-lived (7 days default)
- Tokens include user ID, role, and type

### 3. OTP Verification

- OTP verification happens through third-party service
- No OTP storage in database (stateless)
- OTPs expire based on provider settings

### 4. Mobile Verification

- Mobile number verified through OTP
- `isMobileVerified` flag set to true
- Prevents duplicate registrations

---

## Error Handling

### Common Errors

| Error Code | Description           | Cause                                     |
| ---------- | --------------------- | ----------------------------------------- |
| 400        | Bad Request           | Invalid input data or OTP send failure    |
| 401        | Unauthorized          | Invalid or expired OTP                    |
| 409        | Conflict              | Mobile, email, or username already exists |
| 500        | Internal Server Error | Unexpected server error                   |

### Error Response Format

```json
{
  "statusCode": 409,
  "message": "Mobile number already registered",
  "error": "Conflict"
}
```

---

## Development & Testing

### Using Mock OTP Provider

Set in `.env`:

```env
OTP_PROVIDER=mock
```

**Always use OTP: `123456`** for testing.

### Test Flow Example

1. **Request OTP:**

```bash
curl -X POST http://localhost:3000/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "+919876543210"
  }'
```

2. **Complete Registration:**

```bash
curl -X POST http://localhost:3000/auth/complete-registration \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "+919876543210",
    "otp": "123456",
    "username": "testuser",
    "password": "Test@123456",
    "email": "test@example.com",
    "dateOfBirth": "1995-01-15",
    "gender": "male"
  }'
```

---

## Advantages of 2-Step Flow

### ✅ Benefits

1. **No Session Management** - No cache/Redis required
2. **Simpler Architecture** - Fewer moving parts
3. **Better UX** - User provides all data once
4. **Stateless** - OTP verification handled by third-party
5. **Lower Latency** - One less round-trip to server

### 📊 Comparison with 3-Step Flow

| Feature                   | 2-Step Flow       | 3-Step Flow             |
| ------------------------- | ----------------- | ----------------------- |
| API Calls                 | 2                 | 3                       |
| Session Storage           | Not required      | Required (Redis/Memory) |
| User Data Entry           | Once (final step) | Split (step 1 & 3)      |
| Implementation Complexity | Lower             | Higher                  |
| Server State              | Stateless         | Stateful                |

---

## Production Recommendations

1. **Use Real OTP Provider**
   - Configure Twilio or AWS SNS
   - Set appropriate OTP expiry (5-10 minutes)
   - Implement rate limiting on OTP requests

2. **Rate Limiting**
   - Limit OTP requests per mobile number (e.g., 3 per hour)
   - Implement CAPTCHA for abuse prevention

3. **Monitoring**
   - Track OTP success/failure rates
   - Monitor registration conversion rates
   - Alert on suspicious patterns

4. **Security Enhancements**
   - Add CAPTCHA before OTP request
   - Implement device fingerprinting
   - Add IP-based rate limiting

---

## Troubleshooting

### OTP Not Received

1. Check OTP provider configuration
2. Verify mobile number format
3. Check provider logs/dashboard
4. Ensure sufficient credits (for paid providers)

### OTP Verification Failed

1. Verify OTP hasn't expired
2. Check for typos in OTP entry
3. Ensure mobile number matches exactly
4. Check provider verification logs

### User Already Exists

- Mobile/email/username conflict
- User should use login instead
- Consider adding "forgot password" flow

---

## Future Enhancements

- [ ] Email verification flow
- [ ] Resend OTP functionality
- [ ] SMS rate limiting per user
- [ ] OTP retry limits (max 3 attempts)
- [ ] Profile completion wizard
- [ ] Social login integration

---

## Support

For issues or questions, please contact the development team or refer to the main README.
