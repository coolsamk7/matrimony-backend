# Flutter Client Integration Guide

This guide explains how to use the auto-generated Flutter/Dart API client for the Matrimony Backend.

## 📦 Generated Client

The Flutter client is auto-generated from the OpenAPI specification using the `dart-dio` generator. The generated code is located in the `generated/flutter/` directory.

## 🔄 Regenerating the Client

When you make changes to the backend API, regenerate the Flutter client:

```bash
# Method 1: Using the combined script
yarn openapi:generate

# Method 2: Step by step
# 1. Ensure the server is running
yarn start:dev

# 2. Download the OpenAPI spec
yarn openapi:download

# 3. Generate the Flutter client
npx @openapitools/openapi-generator-cli generate -i openapi.json -g dart-dio -o ./generated/flutter --additional-properties pubName=matrimony_api,pubVersion=1.0.0,nullableFields=true,dateLibrary=core
```

## 📁 Using in Your Flutter Project

### Option 1: Copy to Flutter Project

1. Copy the `generated/flutter` folder to your Flutter project:

```bash
cp -r generated/flutter path/to/your/flutter/project/packages/matrimony_api
```

2. Add it as a path dependency in your `pubspec.yaml`:

```yaml
dependencies:
  matrimony_api:
    path: ./packages/matrimony_api
```

### Option 2: Git Submodule (Recommended)

1. Add as a git submodule in your Flutter project:

```bash
cd path/to/your/flutter/project
git submodule add <backend-repo-url> packages/matrimony_backend
```

2. Reference the generated client:

```yaml
dependencies:
  matrimony_api:
    path: ./packages/matrimony_backend/generated/flutter
```

## 🚀 Quick Start

### Installation

Add required dependencies to your Flutter project's `pubspec.yaml`:

```yaml
dependencies:
  dio: ^5.0.0
  built_value: ^8.0.0
  built_collection: ^5.0.0

dev_dependencies:
  build_runner: ^2.0.0
  built_value_generator: ^8.0.0
```

### Basic Usage

```dart
import 'package:matrimony_api/matrimony_api.dart';
import 'package:dio/dio.dart';

void main() async {
  // Initialize the API client
  final dio = Dio(BaseOptions(
    baseUrl: 'http://localhost:3000',
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 3),
  ));

  final api = MatrimonyApi(dio: dio);

  // Use the authentication API
  final authApi = api.getAuthenticationApi();

  // Example: Register a new user
  try {
    final registerDto = RegisterDto((b) => b
      ..username = 'john_doe'
      ..email = 'john.doe@example.com'
      ..mobile = '+919876543210'
      ..password = 'SecurePass123!');

    final response = await authApi.authControllerRegister(registerDto: registerDto);

    if (response.statusCode == 201) {
      print('User registered successfully!');
      print('Access Token: ${response.data?.accessToken}');
      print('User ID: ${response.data?.user?.id}');
    }
  } on DioException catch (e) {
    print('Error: ${e.response?.data}');
  }
}
```

## 🔐 Authentication Examples

### Register

```dart
final registerDto = RegisterDto((b) => b
  ..username = 'john_doe'
  ..email = 'john.doe@example.com'
  ..mobile = '+919876543210'
  ..password = 'SecurePass123!');

final response = await authApi.authControllerRegister(
  registerDto: registerDto,
);

final authData = response.data;
final accessToken = authData?.accessToken;
final refreshToken = authData?.refreshToken;
```

### Login

```dart
final loginDto = LoginDto((b) => b
  ..emailOrUsername = 'john_doe'
  ..password = 'SecurePass123!');

final response = await authApi.authControllerLogin(
  loginDto: loginDto,
);

final authData = response.data;
```

### Authenticated Requests

```dart
// Add Bearer token to Dio headers
dio.options.headers['Authorization'] = 'Bearer $accessToken';

// Get user profile
final profileResponse = await authApi.authControllerGetProfile();
print('Username: ${profileResponse.data?.username}');
```

### Refresh Token

```dart
final refreshDto = RefreshTokenDto((b) => b
  ..refreshToken = storedRefreshToken);

final response = await authApi.authControllerRefreshToken(
  refreshTokenDto: refreshDto,
);

final newAccessToken = response.data?.accessToken;
final newRefreshToken = response.data?.refreshToken;
```

### Logout

```dart
final refreshDto = RefreshTokenDto((b) => b
  ..refreshToken = currentRefreshToken);

await authApi.authControllerLogout(
  refreshTokenDto: refreshDto,
);
```

## 🛡️ Token Management with Dio Interceptor

Create a token management interceptor for automatic token refresh:

```dart
class AuthInterceptor extends Interceptor {
  final Dio _dio;
  String? _accessToken;
  String? _refreshToken;

  AuthInterceptor(this._dio);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    if (_accessToken != null) {
      options.headers['Authorization'] = 'Bearer $_accessToken';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401 && _refreshToken != null) {
      try {
        // Attempt to refresh token
        final authApi = MatrimonyApi(dio: _dio).getAuthenticationApi();
        final refreshDto = RefreshTokenDto((b) => b..refreshToken = _refreshToken!);

        final response = await authApi.authControllerRefreshToken(
          refreshTokenDto: refreshDto,
        );

        _accessToken = response.data?.accessToken;
        _refreshToken = response.data?.refreshToken;

        // Retry the failed request
        final opts = err.requestOptions;
        opts.headers['Authorization'] = 'Bearer $_accessToken';

        final retryResponse = await _dio.fetch(opts);
        return handler.resolve(retryResponse);
      } catch (e) {
        // Refresh failed - user needs to login again
        _accessToken = null;
        _refreshToken = null;
        return handler.next(err);
      }
    }
    handler.next(err);
  }

  void setTokens(String accessToken, String refreshToken) {
    _accessToken = accessToken;
    _refreshToken = refreshToken;
  }

  void clearTokens() {
    _accessToken = null;
    _refreshToken = null;
  }
}

// Usage
final authInterceptor = AuthInterceptor(dio);
dio.interceptors.add(authInterceptor);

// After login
authInterceptor.setTokens(accessToken, refreshToken);
```

## 📱 Complete Example: Authentication Flow

```dart
import 'package:matrimony_api/matrimony_api.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  late final Dio _dio;
  late final AuthenticationApi _authApi;
  final _storage = const FlutterSecureStorage();

  AuthService() {
    _dio = Dio(BaseOptions(
      baseUrl: 'http://your-backend-url:3000',
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 3),
    ));

    final api = MatrimonyApi(dio: _dio);
    _authApi = api.getAuthenticationApi();
  }

  Future<void> register({
    required String username,
    required String email,
    required String mobile,
    required String password,
  }) async {
    final dto = RegisterDto((b) => b
      ..username = username
      ..email = email
      ..mobile = mobile
      ..password = password);

    final response = await _authApi.authControllerRegister(registerDto: dto);
    await _saveTokens(response.data!);
  }

  Future<void> login({
    required String emailOrUsername,
    required String password,
  }) async {
    final dto = LoginDto((b) => b
      ..emailOrUsername = emailOrUsername
      ..password = password);

    final response = await _authApi.authControllerLogin(loginDto: dto);
    await _saveTokens(response.data!);
  }

  Future<void> logout() async {
    final refreshToken = await _storage.read(key: 'refresh_token');
    if (refreshToken != null) {
      final dto = RefreshTokenDto((b) => b..refreshToken = refreshToken);
      await _authApi.authControllerLogout(refreshTokenDto: dto);
    }
    await _clearTokens();
  }

  Future<void> _saveTokens(AuthResponseDto data) async {
    await _storage.write(key: 'access_token', value: data.accessToken);
    await _storage.write(key: 'refresh_token', value: data.refreshToken);
    _dio.options.headers['Authorization'] = 'Bearer ${data.accessToken}';
  }

  Future<void> _clearTokens() async {
    await _storage.delete(key: 'access_token');
    await _storage.delete(key: 'refresh_token');
    _dio.options.headers.remove('Authorization');
  }

  Future<String?> getAccessToken() async {
    return await _storage.read(key: 'access_token');
  }
}
```

## 🔧 Configuration

### Base URL

Set the base URL when initializing Dio:

```dart
final dio = Dio(BaseOptions(
  baseUrl: 'https://api.matrimony.com', // Production
  // baseUrl: 'http://localhost:3000',  // Development
));
```

### Timeouts

```dart
final dio = Dio(BaseOptions(
  connectTimeout: const Duration(seconds: 5),
  receiveTimeout: const Duration(seconds: 3),
  sendTimeout: const Duration(seconds: 3),
));
```

### Logging

```dart
import 'package:dio/dio.dart';

dio.interceptors.add(LogInterceptor(
  requestBody: true,
  responseBody: true,
  error: true,
));
```

## 📚 API Reference

The generated client includes:

### Models

- `RegisterDto` - User registration data
- `LoginDto` - Login credentials
- `RefreshTokenDto` - Refresh token request
- `AuthResponseDto` - Authentication response with tokens
- `UserResponseDto` - User information

### API Endpoints

- `authControllerRegister()` - Register new user
- `authControllerLogin()` - Login user
- `authControllerRefreshToken()` - Refresh access token
- `authControllerLogout()` - Logout user
- `authControllerRevokeAllTokens()` - Revoke all refresh tokens
- `authControllerGetProfile()` - Get authenticated user profile

## 🐛 Error Handling

```dart
try {
  final response = await authApi.authControllerLogin(loginDto: dto);
  // Success
} on DioException catch (e) {
  if (e.response?.statusCode == 401) {
    print('Invalid credentials');
  } else if (e.response?.statusCode == 409) {
    print('User already exists');
  } else {
    print('Error: ${e.message}');
  }
}
```

## 📝 Validation

The DTOs enforce the same validation rules as the backend:

- **Username**: 3-30 characters, alphanumeric + underscore only
- **Email**: Valid email format
- **Mobile**: International format (e.g., +919876543210)
- **Password**: Minimum 8 characters, must include uppercase, lowercase, number, and special character

## 🔄 CI/CD Integration

Add to your backend CI/CD pipeline:

```yaml
# .github/workflows/generate-client.yml
name: Generate Flutter Client

on:
  push:
    branches: [main, develop]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: yarn install
      - run: yarn start:dev &
      - run: sleep 10
      - run: yarn openapi:generate
      - uses: actions/upload-artifact@v3
        with:
          name: flutter-client
          path: generated/flutter
```

## 📄 License

Generated code inherits the license from the backend project.
