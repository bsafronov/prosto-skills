# Password reset specification

- `REQ-EXPIRY`: A reset token remains valid through exactly 15 minutes after creation
  and becomes invalid only after that point.
- `REQ-AUDIT`: After a successful reset, emit `password_reset_completed` with the user ID.
- `NON-GOAL-PROFILE`: Do not change the user profile schema.
