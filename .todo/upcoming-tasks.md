# Upcoming System Updates

## 1. User Soft Deletion Enhancement ✅
- **Task**: Update soft deletion of users to clear sensitive data
- **Requirements**:
  - When user is soft deleted, clear their email, phone number, and nickname
  - Ensure registration endpoint validation remains intact
- **Status**: Completed
- **Implementation**: Updated `AuthService.softDeleteAccount()` to clear email, phone, name, and password fields
- **File**: `src/auth/services/auth.service.ts:160`

## 2. Password Reset with Mobile Deep Link ✅
- **Task**: Implement password reset with mobile app integration
- **Requirements**:
  - Send user an email with a link
  - Link should open mobile app on reset page
- **Status**: Completed
- **Implementation**: 
  - Added mobile app configuration to `.env.example`
  - Updated reset URL to use mobile deep link format: `casino://reset-password?code={code}&email={email}`
  - Updated API documentation
- **Files**: 
  - `.env.example:39-40`
  - `src/auth/auth.controller.ts:438-440`
- **Frontend Requirements**: Mobile app needs to handle deep links with scheme `casino://` and parse reset-password route with query parameters `code` and `email`

## 3. Manual Migration Management ✅
- **Task**: Ensure all migrations are run manually
- **Context**: Stage branch doesn't run migrations automatically (tested yesterday)
- **Requirements**:
  - Manual migration execution process
  - Documentation for deployment workflow
- **Status**: Completed
- **Implementation**: Created comprehensive migration guide
- **File**: `.todo/manual-migration-guide.md`

---
*Created: 2025-08-27*
*Last Updated: 2025-08-27*