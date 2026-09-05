# Password reset specification

- `REQ-EXPIRY`: A reset token is valid for 15 minutes after creation.
- `REQ-AUDIT`: After a successful reset, emit `password_reset_completed` with the user ID.
- `NON-GOAL-PROFILE`: Do not change the user profile schema.
