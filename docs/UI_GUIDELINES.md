# UI Guidelines

## Design intent

Road to 12% uses a focused, high-contrast dark interface designed for short interactions during training. It should feel energetic and capable without becoming visually noisy. New screens should reuse existing components and spacing before introducing new patterns.

Home follows the Concept B “Training Command Center” direction: a compact brand header, seven-day status strip, dominant workout card, coach recommendation, three existing training metrics, and concise upcoming/history context. Use red for the primary workout action, amber for coach guidance, and green for completion or recovery readiness. Do not introduce wearable-style metrics unless the product actually stores their source data.

## Dark theme

- Use the near-black page background for visual stability in a gym environment.
- Place content in dark elevated cards with subtle borders.
- Avoid large areas of pure white.
- Preserve sufficient contrast in bright rooms and at low screen brightness.
- Do not encode state through color alone; pair color with an icon and text label.

## Color system

Current production tokens are defined in `app.css`:

| Role | Token / value | Usage |
| --- | --- | --- |
| Page background | `--bg: #090b0e` | Application canvas |
| Primary card | `--card: #14181e` | Standard content cards |
| Elevated surface | `--card2: #1b2129` | Controls and secondary surfaces |
| Border | `--line: #2a323d` | Dividers and component outlines |
| Primary text | `--text: #f6f7f9` | Headings and important values |
| Secondary text | `--muted: #9ea7b3` | Supporting information |
| Action red | `--red: #ef3947` | Primary actions and active navigation |
| Success green | `--green: #55df98` | Completion and positive state |

Calendar status colors must remain paired with their named icons. Warning, recovery, and information colors should maintain at least 4.5:1 contrast for normal text.

## Typography

- Use the system stack beginning with `-apple-system` and `BlinkMacSystemFont`.
- Page titles use compact tracking and strong weight.
- Card titles should use responsive `clamp()` sizing and avoid fixed oversized text.
- Supporting copy should be at least 15px on small screens.
- Labels may be uppercase with increased letter spacing, but never for long paragraphs.
- Numeric training values should use tabular figures where changing width would be distracting.
- Do not disable iOS text resizing.

## Spacing

Use a consistent 4px-based rhythm:

- 4–8px: tightly related icon or label spacing
- 10–14px: control and grid gaps
- 14–18px: related content groups
- 20–24px: card padding and major section separation
- 28px or more: distinct page regions

Standard cards have approximately 14px bottom separation. Avoid nested cards unless the inner surface communicates a clear sub-state.

## Cards

- Standard corner radius: 26px.
- Compact inner panels: 13–18px.
- Use a one-pixel `--line` border for separation.
- Keep card padding responsive, approximately 16–22px.
- Cards must never exceed their content container or require page-level horizontal scrolling.
- Use specialized border color sparingly for warnings, recommendations, or completion.
- Historical-data review cards use an amber treatment, explain the exact evidence and affected records, and require a clear user choice before changing saved facts. Provide a non-mutating Keep as recorded alternative.
- Technique-first exercise cards use a subtle red-tinted border, an ordered setup list, and one short high-emphasis cue. Optional activation cards must clearly state that the set does not count toward working volume or records, use a minimum 44px completion control, and collapse multi-column tempo cues to one column on 360px-wide screens.

## Buttons and touch targets

- Long secondary Progress sections use native `details`/`summary` disclosures with visible text labels, plus/minus state indicators, at least 44px touch targets, visible keyboard focus, and no color-only state. Headline progress metrics and primary measurement actions remain outside disclosures.
- Workout Preview exercise rows are full-width buttons with a visible disclosure indicator. Their detail pages remain read-only, reuse the approved exercise-animation presentation, and provide clear Back actions without changing the active workout.
- Primary and secondary buttons are full-width inside their content container by default.
- Standard button radius: 17px.
- Standard vertical padding: 16px.
- Minimum interactive target: 44 × 44 CSS pixels.
- Primary actions use the red gradient and white text.
- Secondary actions use an elevated dark surface and visible border.
- Place the primary action before secondary alternatives in both visual and DOM order.
- Destructive actions require clear wording and confirmation.
- Avoid more than one visually dominant primary action in a single section.
- Disabled controls must remain legible and expose their disabled state semantically.
- External-provider previews must plainly identify themselves as local previews, disclose unmapped or incomplete data, and end with an explicit statement that nothing was sent. A preview action must never imply that an account is connected.
- External-provider posting must remain visually distinct from preview. Show a connected/not-connected text status in Profile, require a confirmation that names the real activity and summarizes exercises, sets, and warnings, and do not expose the posting action while disconnected. Processing, failed, and synced states must use text as well as color; a provider activity link appears only after a confirmed activity ID.
- External-provider connection must show the full privacy/data-use disclosure before authorization and require an explicit acknowledgement. Keep that disclosure available after connection. Disconnect is destructive: name the provider data that will be deleted, preserve local workout history, wait for backend deletion confirmation before local cleanup, and show a clear success or retry message.

## Navigation

The bottom navigation contains exactly five primary destinations:

1. Home
2. Calendar
3. Progress
4. Exercises
5. Profile

Navigation must:

- Remain fixed above the iPhone Home indicator.
- Use `env(safe-area-inset-bottom)`.
- Pair every icon with a visible text label.
- Clearly indicate the active destination.
- Keep labels readable at 320px width.
- Avoid replacing a primary destination without a product decision recorded in `PROJECT_CONTEXT.md`.

Workout actions may use dedicated in-flow controls, but users must always have a clear path back to a primary destination.

## Safe areas and responsive behavior

- The application shell accounts for top, left, right, and bottom safe areas.
- Validate new UI at 320 × 568, 375 × 667, 390 × 844, and 430 × 932.
- Use `minmax(0, 1fr)` in grids containing text or controls.
- Inputs and buttons use `width: 100%` and `max-width: 100%` inside cards.
- Page-level horizontal overflow is a release blocker.
- Internal horizontal scrolling is acceptable only for an intentional control such as a compact date strip.
- Use `100dvh` where viewport height affects layout.

## Motion and transitions

- Keep transitions short, generally 120–220ms.
- Animate opacity or transform rather than layout-heavy properties.
- Never auto-scroll except when the user intentionally advances to the next exercise.
- Restore a workout’s prior scroll position when resuming the same exercise.
- Respect `prefers-reduced-motion` and avoid essential information that depends on animation.

### Exercise movement media

- Show the still motion poster first. Exercise GIFs must not autoplay when an exercise card, workout step, library tile, or enlarged view opens.
- Always start the reviewed animation automatically in a focused exercise view and place an explicit, labelled **Pause animation** control beside or beneath it. When paused, the same control becomes **Play animation** and exposes its pressed state semantically.
- Pause returns to the still poster. Reopening an exercise starts from the poster rather than silently preserving movement.
- Keep Play/Pause controls at least 44px high, full-width where space is constrained, and inside the media container at 320px.
- Reserve one stable square viewport for both the still poster and animated GIF, with `object-fit: contain`, so Play/Pause never changes card height or scroll position.
- Enlarged media dialogs must use safe-area-aware padding, a `100dvh`-bounded panel, a minimum 44px Close control, background isolation, focus trapping, Escape dismissal, and focus return.
- With `prefers-reduced-motion`, remove nonessential interface animation and retain the still poster by default. A user may still explicitly choose Play.
- Never make form, timing, direction, or safety information available only in moving frames; repeat essential instruction in the written guide.
- Identify app-created media as a movement animation or illustration. Show one primary demonstration per exercise screen; keep retained official or reviewed reference attribution in the centralized Image Sources & Licenses view rather than repeating secondary illustrations beneath every workout.

## Accessibility

Adaptive recommendations use amber coach styling, show a plain-language rationale, and require a labelled Apply action. Applied state must be conveyed with text and an icon rather than green alone. Profile health and limitation fields must never imply diagnosis or replace professional care.

Exercise illustrations require meaningful alternative text. App-created artwork must be labelled as an illustration and must not imply that it is licensed footage or a substitute for written coaching.

Exercise animation alternative text should name the movement, important equipment orientation, and safety-relevant start/finish relationship without narrating decorative details. Play/Pause labels must describe the current action, not only show an icon.

- Use semantic headings in a logical hierarchy.
- Every icon-only control requires an accessible name.
- Dialogs require a meaningful label, focus management, and a clear Close action.
- Visible focus styles must remain present for keyboard users.
- Associate labels with inputs and use appropriate `inputmode`.
- Do not rely on placeholder text as the only label.
- Do not rely on color, gesture, hover, or animation alone.
- Use plain language for status and recovery choices.
- Announce saved, completed, or error states where practical.
- Test VoiceOver order for new primary flows.

## UI review checklist

- Does it fit without horizontal overflow at 320px?
- Are safe areas respected in standalone mode?
- Is the primary action obvious and container-bound?
- Are cards, gaps, radii, and typography consistent?
- Are all states named as well as colored?
- Are touch targets at least 44px?
- Is the interaction understandable with reduced motion?
- Can the flow be completed using VoiceOver or keyboard navigation?
