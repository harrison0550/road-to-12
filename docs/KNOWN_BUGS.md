# Known Bugs

Use this file as the durable defect tracker. Do not delete resolved records; update their status and add regression coverage.

## Active

No confirmed production defects are currently documented.

## Resolved

### BUG-001 — Workout page scroll jumps

- Status: Resolved in v13.2.0
- Severity: High
- Area: Workout
- Report: Returning to a workout caused the page to jump upward unexpectedly.
- Resolution: Removed unintended viewport-anchor correction and restore the saved position only when resuming the same exercise. Intentional next-exercise navigation starts at the top.
- Regression test needed: Yes

### BUG-002 — Save Check-In exceeds screen width

- Status: Resolved in v13.2.0
- Severity: High
- Area: Progress
- Report: The Save Check-In button could extend beyond the content width on smaller iPhones.
- Resolution: The button now spans the full grid container with safe, constrained input sizing.
- Regression test needed: Yes

## Bug template

```markdown
### BUG-000 — Short description

- Status: Reported | Confirmed | In progress | Resolved
- Severity: Critical | High | Medium | Low
- Area:
- First observed:
- Environment:
- Reproduction:
  1.
- Expected:
- Actual:
- Workaround:
- Resolution:
- Regression test:
```

