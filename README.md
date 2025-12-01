### TODO:

### Authentication

> Note: we will use Prisma 6.16.1 this version specifically.

* [x] Prisma model:
    * [x] User
    * [x] Talent
    * [x] Employer
    * [x] RefreshToken (Hashed)
    * [x] Job
    * [x] Application
* [x] Implement register `/auth/register`
    * [x] Implement Email verification `/auth/verify` system.
* [x] Implement login `/auth/login` return access token, set `jwt` cookie (HttpOnly, Secure)
* [x] Implement `/auth/logout`, `/auth/logout/all`
* [x] Implement `/auth/refresh` with refresh-token rotation:
    * On use, mark old refresh token revoked, insert new refresh token row, return new access token & set cookie.
    * If a refresh token is replayed (used twice) revoke all user refresh tokens.
* [x] Reset password `/auth/reset`
* [x] Implement `auth/me`
* [x] Middleware: `requireAuth` checks access token from `Authorization: Bearer <token>`
* [x] Rate-limit auth endpoints (`express-rate-limit`)

---

## Talent module

* [ ] GET `/talent/profile`
* [ ] PUT `/talent/profile`
* [ ] POST `/talent/profile/avatar`
* [ ] GET/PUT `/talent/resume`, POST `/talent/resume/upload`
* [ ] GET `/talent/recommendations/jobs?limit=10`

---

## Employer module

* [ ] GET/PUT `/employer/profile`
* [ ] POST `/employer/logo`
* [ ] Jobs CRUD: GET `/employer/jobs`, POST `/employer/jobs`, GET/PUT/DELETE `/employer/jobs/:jobId`
* [ ] Applications listing & status update endpoints

---

## Moderator endpoints

* [ ] GET `/moderation/jobs` (paged)
* [ ] PATCH `/moderation/jobs/:jobId` (approve/reject)
* [ ] GET `/moderation/talent` + PATCH endpoints
* [ ] GET `/moderation/employers` + PATCH endpoints

---

### Errors

* [x] Configure logger wrapper + request log middleware (Pino)
* [x] Implement centralized error handler + HTTP error utility
* [x] Add helmet, cors, rate-limiter middleware

---

### **Recommended Style**

| Action | Message Example     |
|--------|---------------------|
| Create | `"user created"`    |
| Fetch  | `"user fetched"`    |
| Update | `"user updated"`    |
| Delete | `"user deleted"`    |
| Login  | `"user logged in"`  |
| Logout | `"user logged out"` |
| Error  | `"user not found"`  |


