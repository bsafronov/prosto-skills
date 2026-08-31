# Security policy

## Supported versions

Only the current `main` branch and latest Git tag receive security fixes. The project has not made its first Stable release.

## Report a vulnerability

Please use [GitHub private vulnerability reporting](https://github.com/bsafronov/prosto-skills/security/advisories/new). Do not open a public issue for an undisclosed vulnerability.

Include the affected Skill or script, impact, reproduction conditions, and any suggested mitigation. You can expect an acknowledgement within seven days.

## Supply-chain boundary

Skill instructions and bundled scripts may execute with an agent's ambient permissions. Review every contribution as executable content. CI uses read-only permissions, receives no pull-request secrets, and pins third-party Actions to commit SHAs.
