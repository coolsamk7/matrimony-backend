# Profile Completion Flow

This document describes the step-by-step profile completion process for users in the matrimony platform.

## Overview

After OTP-based registration, users must complete their profile in **5 mandatory sections** before accessing other platform features:

1. **Basic Profile Info** - Height, weight, blood group, marital status, etc.
2. **Contact Information** - Work city, family city, current city, address
3. **Education** - Degree, university, stream, certifications
4. **Religion Information** - Religion, caste, subcaste, gotra
5. **Family Information** - Family member details, occupation, contact

**Optional sections:**

- **Partner Preferences** - Age range, education, occupation, caste preferences
- **Patrika/Horoscope** - Rashi, nakshatra, gan, nadi, mangal dosha

---

## Profile Completion Tracking

The system automatically tracks profile completion:

- `isProfileComplete` flag is updated after each section update
- Profile is marked complete when all 5 mandatory sections are filled
- Use `GET /profile/status` to check completion percentage and missing sections

---

## API Endpoints

All endpoints require authentication (JWT Bearer token).

### 1. Update Basic Profile Info

**Endpoint:** `PUT /api/v1/profile/basic-info`

**Description:** Step 1 - Update basic profile information

**Request Body:**

```json
{
  "height": 175,
  "weight": 70,
  "bloodGroup": "O_POSITIVE",
  "motherTongue": "MARATHI",
  "maritalStatus": "NEVER_MARRIED",
  "about": "I am a software engineer with 5 years of experience...",
  "aboutFamily": "We are a middle-class family from Mumbai...",
  "profileId": "MAT2024001"
}
```

**Response:**

```json
{
  "message": "Basic profile updated successfully",
  "data": {
    "id": "01HQWXYZ...",
    "userId": "01HQWXYZ...",
    "height": 175,
    "weight": 70,
    "bloodGroup": "O_POSITIVE",
    "motherTongue": "MARATHI",
    "maritalStatus": "NEVER_MARRIED",
    "about": "I am a software engineer...",
    "aboutFamily": "We are a middle-class family...",
    "profileId": "MAT2024001",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Enums:**

- `bloodGroup`: `A_POSITIVE`, `A_NEGATIVE`, `B_POSITIVE`, `B_NEGATIVE`, `O_POSITIVE`, `O_NEGATIVE`, `AB_POSITIVE`, `AB_NEGATIVE`
- `motherTongue`: `MARATHI`, `HINDI`, `ENGLISH`, etc.
- `maritalStatus`: `NEVER_MARRIED`, `DIVORCED`, `WIDOWED`, `SEPARATED`

---

### 2. Update Contact Information

**Endpoint:** `PUT /api/v1/profile/contact-info`

**Description:** Step 2 - Update contact and location details

**Request Body:**

```json
{
  "workCity": "Mumbai",
  "familyCity": "Pune",
  "currentCity": "Bangalore",
  "address": "123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001"
}
```

**Response:**

```json
{
  "message": "Contact information updated successfully",
  "data": {
    "id": "01HQWXYZ...",
    "userId": "01HQWXYZ...",
    "workCity": "Mumbai",
    "familyCity": "Pune",
    "currentCity": "Bangalore",
    "address": "123 Main Street...",
    "createdAt": "2024-01-15T10:05:00.000Z",
    "updatedAt": "2024-01-15T10:05:00.000Z"
  }
}
```

---

### 3. Update Education Details

**Endpoint:** `PUT /api/v1/profile/education`

**Description:** Step 3 - Update education qualifications

**Request Body:**

```json
{
  "medium": "English",
  "degree": "Bachelor of Engineering",
  "name": "MIT College",
  "stream": "Computer Science",
  "certifications": "AWS Certified, Google Cloud Professional",
  "universityOrCollege": "University of Mumbai"
}
```

**Response:**

```json
{
  "message": "Education details updated successfully",
  "data": {
    "id": "01HQWXYZ...",
    "userId": "01HQWXYZ...",
    "medium": "English",
    "degree": "Bachelor of Engineering",
    "name": "MIT College",
    "stream": "Computer Science",
    "certifications": "AWS Certified, Google Cloud Professional",
    "universityOrCollege": "University of Mumbai",
    "createdAt": "2024-01-15T10:10:00.000Z",
    "updatedAt": "2024-01-15T10:10:00.000Z"
  }
}
```

---

### 4. Update Religion Information

**Endpoint:** `PUT /api/v1/profile/religion-info`

**Description:** Step 4 - Update religious background

**Request Body:**

```json
{
  "religion": "Hindu",
  "caste": "Maratha",
  "subcaste": "96 Kuli Maratha",
  "gotra": "Kashyap"
}
```

**Response:**

```json
{
  "message": "Religion information updated successfully",
  "data": {
    "id": "01HQWXYZ...",
    "userId": "01HQWXYZ...",
    "religion": "Hindu",
    "caste": "Maratha",
    "subcaste": "96 Kuli Maratha",
    "gotra": "Kashyap",
    "createdAt": "2024-01-15T10:15:00.000Z",
    "updatedAt": "2024-01-15T10:15:00.000Z"
  }
}
```

---

### 5. Update Family Information

**Endpoint:** `PUT /api/v1/profile/family`

**Description:** Step 5 - Update family member details

**Request Body:**

```json
{
  "occupation": "Engineer",
  "native": "Pune, Maharashtra",
  "relation": "Father",
  "maritalStatus": "MARRIED",
  "mobile": "+919876543210",
  "email": "family@example.com",
  "whatsApp": "+919876543210"
}
```

**Response:**

```json
{
  "message": "Family information updated successfully",
  "data": {
    "id": "01HQWXYZ...",
    "userId": "01HQWXYZ...",
    "occupation": "Engineer",
    "native": "Pune, Maharashtra",
    "relation": "Father",
    "maritalStatus": "MARRIED",
    "mobile": "+919876543210",
    "email": "family@example.com",
    "whatsApp": "+919876543210",
    "createdAt": "2024-01-15T10:20:00.000Z",
    "updatedAt": "2024-01-15T10:20:00.000Z"
  }
}
```

---

### 6. Update Partner Preferences (Optional)

**Endpoint:** `PUT /api/v1/profile/preferences`

**Description:** Step 6 (Optional) - Set partner preferences

**Request Body:**

```json
{
  "ageRangeFrom": 25,
  "ageRangeTo": 35,
  "complexion": "FAIR",
  "education": "Graduate",
  "occupation": "Software Engineer",
  "income": "10-15 LPA",
  "employedIn": "Private",
  "caste": "Maratha",
  "subCaste": "96 Kuli Maratha",
  "gotra": "Kashyap",
  "maritalStatus": "Never Married",
  "manglik": false,
  "patrikPreference": true
}
```

**Response:**

```json
{
  "message": "Preferences updated successfully",
  "data": {
    "id": "01HQWXYZ...",
    "userId": "01HQWXYZ...",
    "ageRangeFrom": 25,
    "ageRangeTo": 35,
    "complexion": "FAIR",
    "education": "Graduate",
    "occupation": "Software Engineer",
    "income": "10-15 LPA",
    "employedIn": "Private",
    "caste": "Maratha",
    "subCaste": "96 Kuli Maratha",
    "gotra": "Kashyap",
    "maritalStatus": "Never Married",
    "manglik": false,
    "patrikPreference": true,
    "createdAt": "2024-01-15T10:25:00.000Z",
    "updatedAt": "2024-01-15T10:25:00.000Z"
  }
}
```

---

### 7. Update Patrika/Horoscope (Optional)

**Endpoint:** `PUT /api/v1/profile/patrika`

**Description:** Step 7 (Optional) - Add horoscope details

**Request Body:**

```json
{
  "rashi": "Mesh (Aries)",
  "nakshatra": "Ashwini",
  "charan": "1",
  "gan": "Dev",
  "nadi": "Aadi",
  "mangal": "No"
}
```

**Response:**

```json
{
  "message": "Patrika information updated successfully",
  "data": {
    "id": "01HQWXYZ...",
    "userId": "01HQWXYZ...",
    "rashi": "Mesh (Aries)",
    "nakshatra": "Ashwini",
    "charan": "1",
    "gan": "Dev",
    "nadi": "Aadi",
    "mangal": "No",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 8. Get Complete Profile

**Endpoint:** `GET /api/v1/profile/complete`

**Description:** Retrieve all profile sections in one response

**Response:**

```json
{
  "user": {
    "id": "01HQWXYZ...",
    "username": "john_doe",
    "email": "john@example.com",
    "mobile": "+919876543210",
    "dateOfBirth": "1995-01-15",
    "gender": "male",
    "isProfileComplete": true,
    "isMobileVerified": true,
    "isEmailVerified": false
  },
  "profile": {
    /* Basic profile data */
  },
  "contactInfo": {
    /* Contact info data */
  },
  "education": {
    /* Education data */
  },
  "religionInfo": {
    /* Religion info data */
  },
  "family": {
    /* Family data */
  },
  "preferences": {
    /* Preferences data */
  },
  "patrika": {
    /* Patrika data */
  }
}
```

---

### 9. Get Profile Completion Status

**Endpoint:** `GET /api/v1/profile/status`

**Description:** Check profile completion status and percentage

**Response:**

```json
{
  "hasProfile": true,
  "hasContactInfo": true,
  "hasEducation": true,
  "hasReligionInfo": true,
  "hasFamily": true,
  "completionPercentage": 100
}
```

---

## Profile Completion Guard

The `ProfileCompletionGuard` is applied globally to enforce profile completion:

### How it Works

1. After registration via OTP, `isProfileComplete` is set to `false`
2. User can only access:
   - Auth endpoints (login, logout, refresh)
   - Profile endpoints (all `/profile/*` routes)
   - Their own profile (`/auth/profile`)
3. Attempting to access other features returns `403 Forbidden`:
   ```json
   {
     "statusCode": 403,
     "message": "Please complete your profile to access this feature. Complete all profile sections: basic info, contact info, education, religion info, and family.",
     "error": "Forbidden"
   }
   ```
4. Once all 5 mandatory sections are filled, `isProfileComplete` becomes `true`
5. User can now access all platform features

---

## Validation Rules

### Height & Weight

- Height: 100-250 cm
- Weight: 30-200 kg

### Age Range (Preferences)

- Min: 18 years
- Max: 100 years

### Mobile Numbers

- Format: International (E.164)
- Pattern: `^\+?[1-9]\d{1,14}$`
- Example: `+919876543210`

### Email

- Valid email format
- Optional field in most sections

### Text Fields

- Most fields have max length constraints (100-500 characters)
- All fields are optional (can be updated incrementally)

---

## Update Flow

### Initial State (After OTP Registration)

```json
{
  "isProfileComplete": false,
  "isMobileVerified": true,
  "isEmailVerified": false
}
```

### After Each Section Update

1. User updates a section (e.g., basic info)
2. System saves the data
3. System checks if all 5 mandatory sections exist
4. If all exist, `isProfileComplete` is set to `true`
5. User can now access all features

### Incremental Updates

- Each section can be updated independently
- Fields within a section are optional
- Updates are partial (only provided fields are updated)
- Previous data is preserved for unspecified fields

---

## Testing Flow

### Step-by-Step Example

1. **Register user via OTP:**

   ```bash
   POST /auth/request-otp
   POST /auth/complete-registration
   ```

2. **Check initial status:**

   ```bash
   GET /profile/status
   # Returns: completionPercentage: 0%
   ```

3. **Update each mandatory section:**

   ```bash
   PUT /profile/basic-info
   # completionPercentage: 20%

   PUT /profile/contact-info
   # completionPercentage: 40%

   PUT /profile/education
   # completionPercentage: 60%

   PUT /profile/religion-info
   # completionPercentage: 80%

   PUT /profile/family
   # completionPercentage: 100%, isProfileComplete: true
   ```

4. **Access platform features:**
   ```bash
   # Now able to access other endpoints without 403 error
   ```

---

## Error Handling

### Common Errors

| Status | Description  | Cause                                          |
| ------ | ------------ | ---------------------------------------------- |
| 401    | Unauthorized | Missing or invalid JWT token                   |
| 403    | Forbidden    | Profile incomplete (for non-profile endpoints) |
| 404    | Not Found    | User not found                                 |
| 400    | Bad Request  | Validation errors in request body              |

---

## Best Practices

1. **Guide Users:** Show completion percentage in UI
2. **Save Progress:** Allow incremental updates
3. **Validate Client-Side:** Match server validation rules
4. **Handle Errors:** Display clear validation messages
5. **Auto-Save:** Consider auto-saving as user fills forms
6. **Progress Indicator:** Visual steps (1/5, 2/5, etc.)

---

## Future Enhancements

- [ ] Profile photo upload
- [ ] Document verification (ID proof, education certificates)
- [ ] Multi-family member support
- [ ] Profile visibility settings
- [ ] Profile completeness score (beyond mandatory fields)
- [ ] Profile verification badges

---

## Support

For API issues or questions, refer to:

- Swagger documentation: `http://localhost:3000/api/docs`
- Main README for setup instructions
