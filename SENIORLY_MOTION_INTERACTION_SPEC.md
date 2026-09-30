# Seniorly — Motion & Interaction Design Specification

## Purpose

This document defines the interaction, animation, navigation, and scroll behavior for Seniorly.

Seniorly is an interview-experience platform where seniors share real interview experiences and juniors discover them for preparation. The product is college-focused but supports off-campus experiences.

The goal is to make Seniorly feel **smooth, premium, calm, connected, and intentional** while preserving the existing Night Library visual identity.

This document is an implementation specification for the coding agent. Follow it when building or polishing UI interactions.

---

# 1. Core Experience Principle

Seniorly should feel like:

> **Discover → Focus → Reveal → Dive deeper → Return**

Avoid making the application feel like a collection of disconnected pages.

The user should feel that content is continuously connected:

```text
Home
  ↓
Search / Explore
  ↓
Experience list
  ↓
Experience detail
  ↓
Interview rounds
  ↓
Questions
  ↓
Preparation / Advice
  ↓
Related experiences
  ↓
Company / College
```

Navigation and animation should reinforce these relationships.

---

# 2. Existing Visual Identity — Preserve This

The existing Seniorly design direction is the **Night Library** theme.

Do NOT replace it with a generic SaaS / AI dashboard aesthetic.

### Visual rules

- Warm olive-black surfaces
- Warm off-white text
- Brass accent used sparingly
- Newsreader for headings
- Source Sans 3 for UI/body text
- Small 8–10px radii
- Quiet cards
- Borders and spacing provide hierarchy
- Shadows are rare and soft
- No purple/indigo theme
- No gradients
- No excessive glow
- No excessive glassmorphism
- No excessive card scaling
- No animation that feels decorative rather than useful

### Current tokens

```text
Background:      #121410
Elevated panel:  #1a1d18
Muted fill:      #22261f
Line:            #31362c
Text:            #eceae3
Muted text:      #a8a292
Faint text:      #7a756b
Brass:           #d4c4a0
Brass hover:     #e6d7b8
Button text:     #121410
Sage:            #9caf96
Clay:            #d4896a
```

Animations must work with this restrained visual language.

---

# 3. Animation Philosophy

Animations should communicate one of these things:

1. Where the user came from
2. Where content is going
3. What content is related
4. What changed
5. What is currently active
6. How far the user has progressed

Do NOT animate everything.

Prefer:

```text
opacity
translateY
translateX
height
width
border-color
background-color
layout
```

Avoid unnecessary:

```text
rotate
bounce
large scale
3D transforms
continuous floating
excessive blur
```

The application should still feel fast.

---

# 4. Recommended Animation Stack

Use:

### Motion for React

Use Motion for:

- page transitions
- shared element transitions
- layout animations
- card interactions
- scroll reveals
- accordions
- timeline animations
- modal/dropdown transitions

### Native CSS / Tailwind

Use CSS transitions for:

- hover states
- focus states
- border changes
- color changes
- small transforms

### Intersection Observer / Motion viewport APIs

Use for:

- section reveal
- timeline activation
- scroll-triggered content

Do not introduce multiple animation libraries.

Recommended stack:

```text
Next.js
+
TypeScript
+
Tailwind CSS
+
Motion
```

---

# 5. Global Motion Rules

Default transition timings:

```text
Micro interaction:  150–200ms
Normal interaction: 200–350ms
Section reveal:     400–600ms
Shared transition:  400–700ms
```

Preferred easing:

```text
ease-out
```

or a smooth custom ease.

Avoid overly springy/bouncy motion.

### Accessibility

Respect:

```text
prefers-reduced-motion
```

When reduced motion is enabled:

- Disable large movement
- Disable shared-element movement
- Disable scroll parallax
- Keep opacity transitions minimal
- Preserve content order and functionality

---

# 6. Global Navigation

## Initial navbar

At the top of the homepage, keep the navbar visually lightweight.

```text
┌──────────────────────────────────────────────┐
│ SENIORLY                         Sign in      │
└──────────────────────────────────────────────┘
```

## After scrolling

Once the user scrolls roughly 60–100px:

- Navbar becomes sticky
- Slightly reduce vertical padding
- Add elevated background
- Add subtle border
- Optionally add a very small backdrop blur
- Do not turn it into heavy glassmorphism

Example:

```text
┌──────────────────────────────────────────────┐
│ S  SENIORLY     Experiences Companies    +  │
└──────────────────────────────────────────────┘
```

Animation:

```text
padding: smooth
background: transparent → #1a1d18
border: transparent → #31362c
```

Duration: ~250ms.

---

# 7. Homepage Hero

The homepage should introduce Seniorly calmly.

Suggested structure:

```text
SENIORLY

Learn from those who've
been there.

[ Search interview experiences ]

            ↓
```

## Scroll behavior

As the user scrolls:

Hero:

```text
opacity: 1 → 0
translateY: 0 → -50px
```

Keep movement subtle.

At the same time, the next section should rise into view.

Do NOT create aggressive parallax.

---

# 8. Search Interaction

Search is one of the most important interactions in Seniorly.

## Default

```text
┌────────────────────────────────┐
│ 🔍 Search interview experiences│
└────────────────────────────────┘
```

## Focused

The search field should expand slightly or gain stronger border contrast.

```text
┌─────────────────────────────────────┐
│ 🔍 HPE Software Engineer            │
└─────────────────────────────────────┘

Recent searches
HPE
Google SDE
Amazon SDE

Popular
HPE · IIIT Kottayam
Google · IIIT Kottayam
```

Dropdown:

- Fade in
- Translate upward/downward by only ~6–10px
- Never pop abruptly

Duration: ~180–250ms.

---

# 9. Search → Experiences Transition

When the user submits search:

Do not make the experience feel like a hard page replacement.

Where possible, visually connect the search field from the homepage to the search/list page.

The user should feel:

```text
Homepage search
      ↓
same search context
      ↓
Experience results
```

Preserve the query in the URL.

The existing application already uses URL query parameters for discovery/filtering. Keep this behavior.

---

# 10. Experience List

Experience cards should enter progressively.

Example:

```text
Google
Software Engineer Intern

IIIT Kottayam · 2026

5 rounds · On Campus
```

## Entrance animation

For cards entering the viewport:

```text
opacity: 0 → 1
translateY: 20px → 0
```

Stagger:

```text
Card 1: 0ms
Card 2: 50ms
Card 3: 100ms
Card 4: 150ms
```

Duration: ~400–500ms.

Do not stagger excessively long lists. Limit the effect to the first visible batch where appropriate.

---

# 11. Experience Card Hover

Default card:

```text
┌──────────────────────────────┐
│ Google                       │
│ Software Engineer Intern     │
│                              │
│ IIIT Kottayam · 2026         │
│ 5 rounds · On Campus         │
└──────────────────────────────┘
```

On hover:

- Move upward by 2–4px
- Border becomes slightly more brass
- Optional very subtle background change
- Reveal a short preview/advice line
- Reveal "View experience →"

Example:

```text
┌──────────────────────────────┐
│ Google                       │
│ Software Engineer Intern     │
│                              │
│ IIIT Kottayam · 2026         │
│ 5 rounds · On Campus         │
│                              │
│ "Focused heavily on DSA..."  │
│                              │
│ View experience →            │
└──────────────────────────────┘
```

Do NOT:

- scale cards heavily
- add large shadows
- rotate cards
- use glow effects

---

# 12. List Filters

Filters should feel like compact controls rather than a large settings form.

```text
[ Company ▾ ] [ Role ▾ ] [ Year ▾ ] [ Round ▾ ]
```

On click:

```text
[ Company ▾ ]

┌───────────────────────┐
│ 🔍 Search companies   │
│                       │
│ Google                │
│ Microsoft             │
│ HPE                   │
│ Amazon                │
└───────────────────────┘
```

Dropdown animation:

```text
opacity: 0 → 1
translateY: -6px → 0
```

Duration: ~180–220ms.

When a filter changes:

- Keep the list position stable where possible
- Update URL search params
- Avoid a full visual page flash
- Use loading/skeleton states if the request takes noticeable time

---

# 13. Critical Interaction: Experience Card → Detail Page

This is one of the most important animations in Seniorly.

When the user clicks an experience card, the card should visually feel like it is **opening into the experience detail page**.

Concept:

```text
Experience card

┌──────────────────────────────┐
│ HPE                          │
│ Software Engineer Intern     │
│ IIIT Kottayam · 2026         │
└──────────────────────────────┘

          ↓

Detail page header

┌──────────────────────────────────────┐
│ HPE                                  │
│                                      │
│ Software Engineer Intern             │
│ IIIT Kottayam · 2026                 │
│                                      │
│ 🟢 Selected                          │
└──────────────────────────────────────┘
```

Use Motion shared-layout/shared-element techniques where practical.

The goal is continuity:

> The card did not disappear. It expanded into the experience.

Keep the transition around 400–700ms.

If a true shared-element transition is impractical with the current routing setup, implement a subtle fade + upward transition rather than forcing a fragile animation.

---

# 14. Experience Detail Page

The detail page should initially present a strong summary.

Example:

```text
HPE

Software Engineer Intern
IIIT Kottayam · 2026

🟢 Selected

5 rounds · 3 weeks

↓ Read experience
```

Then the content unfolds naturally as the user scrolls.

Do not animate every paragraph.

Animate major sections.

---

# 15. Scroll Reveal for Detail Sections

Major sections:

```text
Interview Process
Questions
Preparation
Advice
Related Experiences
```

When entering the viewport:

```text
opacity: 0 → 1
translateY: 20px → 0
```

Duration:

```text
400–600ms
```

Use viewport thresholds so sections do not repeatedly animate every time they enter the screen.

---

# 16. Interview Timeline

The interview timeline should be a signature Seniorly interaction.

Example:

```text
● Resume Shortlisted
│
● Online Assessment
│   DSA · 90 mins
│
● Technical Round 1
│   OS · CN · DSA
│
● Technical Round 2
│   Projects
│
● HR
│
● Selected
```

As the user scrolls through the timeline:

- Timeline line progressively draws
- Current round becomes active
- Previous rounds become completed
- Future rounds remain muted

Visual state:

```text
Completed → brass/sage
Active    → stronger text + brass indicator
Future    → muted/faint
```

Do not make the timeline pulse continuously.

---

# 17. Timeline Scroll Progress

The vertical line should be tied to scroll progress.

Initial:

```text
●
│
○
│
○
│
○
```

Midway:

```text
●
│
●
│
●
│
○
```

Complete:

```text
●
│
●
│
●
│
●
```

The line can animate using a scaleY or SVG path-progress technique.

Keep it subtle.

---

# 18. Interview Round Cards

Each round should have hierarchy.

Example:

```text
Technical Round 1

DSA · OS · CN
45 minutes
Medium

Questions
```

When entering viewport:

- Heading appears first
- Metadata follows very slightly
- Questions appear after

Avoid long cascading animations.

Suggested:

```text
Round heading: 0ms
Metadata:       60ms
Content:        100ms
```

---

# 19. Questions Accordion

Questions should be expandable.

Default:

```text
01  Explain TCP vs UDP                     +
02  Reverse a linked list                  +
03  Explain database indexing              +
```

Expanded:

```text
01  Explain TCP vs UDP                    −
    ─────────────────────────────────────

    Asked during Technical Round 1.

    Topic
    Computer Networks
```

Animation:

- Animate height
- Animate opacity
- Rotate plus/minus icon if desired
- Do not animate from an arbitrary fixed height

Duration: ~250–350ms.

Only one question needs to be open at a time if that creates a cleaner reading experience, but this is optional.

---

# 20. Company Links

Company names should be meaningful navigation points.

Example:

```text
HPE
```

Hover:

```text
HPE
───
View all HPE experiences →
```

Click:

```text
Experience
   ↓
Company page
   ↓
HPE experiences
```

The transition should preserve the feeling that the user is moving deeper into the same knowledge base.

The existing route structure includes:

```text
/companies/[slug]
```

Use it.

---

# 21. Company Page

Suggested structure:

```text
HPE

Software Engineering

18 experiences · 7 colleges

[ On Campus ] [ Off Campus ]

────────────────────────

Recent Experiences
```

As the user scrolls:

- Company header can become a compact sticky header
- Experience cards reveal progressively
- Filters remain accessible
- Avoid excessive animation on repeated cards

Sticky header:

```text
┌────────────────────────────────────┐
│ HPE                    Experiences │
└────────────────────────────────────┘
```

---

# 22. College Page

College-specific discovery is central to Seniorly.

The interface should make the distinction between:

```text
On Campus
Off Campus
```

very obvious.

Suggested interaction:

```text
IIIT Kottayam

128 Experiences
47 Companies

[ On Campus ] [ Off Campus ]
```

Switching tabs should use a small sliding/position animation for the active indicator.

Do not reload the entire visual interface.

---

# 23. Scroll Progress

For long experience pages, add a very subtle reading-progress indicator.

Example:

```text
━━━━━━━━━━━━━━━━░░░░░░░░
```

Possible implementation:

- fixed 1–2px brass line at the top
- width based on page scroll progress

It should be nearly invisible when not needed.

---

# 24. Back Navigation

Back navigation must preserve discovery context.

Example:

```text
Experiences
  ↓
Search: HPE
  ↓
Filter: 2026
  ↓
Open experience
  ↓
Read
  ↓
Back
```

The user should return to:

```text
Search: HPE
Filter: 2026
Same scroll position
```

Do not reset filters.

Because discovery state is represented through URL query parameters, preserve and reuse those parameters.

---

# 25. Page Transitions

Keep page transitions subtle.

Recommended:

```text
Old:
opacity 1

New:
opacity 0 → 1
translateY 8px → 0
```

Duration: ~200–300ms.

Avoid:

- horizontal page slides
- rotations
- zooming
- dramatic fades
- full-screen loaders

Seniorly should feel like a web knowledge product, not a presentation.

---

# 26. Loading States

Use skeletons rather than generic spinners.

Experience list skeleton:

```text
████████████

████████████████████

────────────────────

████████
████████████████
████████
```

Detail skeleton should match the actual detail layout.

When data arrives:

```text
Skeleton → Content
```

Use a short opacity transition so the replacement doesn't feel abrupt.

---

# 27. Submission Flow

The experience submission form should feel progressive rather than overwhelming.

Structure:

```text
Share your experience

1. Basics
2. Interview rounds
3. Preparation
4. Publish
```

Use section transitions when appropriate.

The user should not feel like they are filling a 30-field form.

Required fields remain visible and clear.

Optional information should be visually secondary.

---

# 28. Submit Success

After submitting an experience:

```text
Experience published

Your experience is now part of Seniorly.

[ View experience ]
```

Use a restrained success animation.

Example:

```text
✓
```

with a small scale/opacity reveal.

Do not use confetti.

The brand is calm and premium.

---

# 29. Mobile Behavior

Mobile is not a secondary layout.

Use:

```text
┌───────────────────────────┐
│ Seniorly           🔔 👤 │
│                           │
│ 🔍 Search experiences...  │
│                           │
│ Experience card           │
│                           │
│ Experience card           │
│                           │
├───────────────────────────┤
│ 🏠  🔍  ＋  🔖  👤       │
└───────────────────────────┘
```

Bottom navigation should remain stable.

The central `+` action can be visually emphasized because contribution is important.

---

# 30. Mobile Motion

On mobile:

- Reduce movement distance
- Reduce stagger
- Avoid expensive blur
- Avoid large parallax
- Preserve touch responsiveness
- Keep tap targets comfortable

Card transitions should feel immediate.

---

# 31. Performance Rules

Animations must never make the app feel slower.

Prefer GPU-friendly properties:

```text
transform
opacity
```

Avoid animating expensive layout properties continuously.

Do not run scroll handlers that cause unnecessary React renders.

Prefer:

- Motion's viewport/scroll APIs
- Intersection Observer
- requestAnimationFrame where custom scroll logic is genuinely needed

Lazy-load heavy components.

Do not animate content that is far outside the viewport.

---

# 32. Animation Priority

If implementation time is limited, implement in this order:

### Priority 1 — Must have

1. Experience card → detail transition
2. Scroll reveal
3. Sticky navbar transition
4. Smooth filter dropdowns
5. Question accordion

### Priority 2 — Strongly recommended

6. Interview timeline drawing
7. Active timeline round
8. Search interaction
9. Company navigation transitions
10. Loading skeletons

### Priority 3 — Nice to have

11. Scroll progress
12. Shared-element search transition
13. Advanced mobile transitions
14. Subtle page transitions

Do not delay core functionality to implement Priority 3 animation.

---

# 33. Anti-patterns

Never implement:

```text
❌ Purple/indigo SaaS redesign
❌ Gradient backgrounds everywhere
❌ Glass cards everywhere
❌ Neon glow
❌ Excessive shadows
❌ Bouncy animations
❌ Card rotation
❌ Huge page transitions
❌ Confetti
❌ Constant pulsing
❌ Animating every paragraph
❌ 1-second delays before content
❌ Full-screen spinners
❌ Losing search/filter state
❌ Resetting scroll position unnecessarily
```

The animation system should feel **quietly impressive**, not flashy.

---

# 34. Desired Overall Feeling

The final product should feel like:

> **A premium digital library of real interview knowledge.**

The user should think:

> "Everything is connected."

Not:

> "This website has lots of animations."

The best animation is the one the user barely notices but makes the interface feel natural.

---

# 35. Reference Interaction Flow

The complete intended experience:

```text
                     HOME
                       │
                       │ scroll
                       ↓
              FEATURED EXPERIENCES
                       │
                       │ hover
                       ↓
                EXPERIENCE CARD
                       │
                       │ click
                       ↓
              SHARED TRANSITION
                       │
                       ↓
               EXPERIENCE DETAIL
                       │
                       │ scroll
                       ↓
              INTERVIEW TIMELINE
                       │
                       │ scroll
                       ↓
                  QUESTIONS
                       │
                       │ expand
                       ↓
               PREPARATION / ADVICE
                       │
                       ↓
              RELATED EXPERIENCES
                       │
              ┌────────┴────────┐
              ↓                 ↓
          COMPANY            COLLEGE
           PAGE               PAGE
              │                 │
              └────────┬────────┘
                       ↓
               MORE EXPERIENCES
```

---

# 36. Implementation Rule for the Coding Agent

Before adding an animation, ask:

1. Does it improve understanding?
2. Does it show a relationship between two pieces of content?
3. Does it make navigation feel continuous?
4. Does it preserve the Night Library aesthetic?
5. Does it remain fast?
6. Does it work with reduced motion?

If the answer is no, don't add the animation.

**Do not redesign the existing product architecture just to implement these interactions.**

Work within the existing:

```text
Next.js App Router
TypeScript
Tailwind CSS
Motion
MongoDB / Mongoose
Supabase Auth
```

Keep the existing routes and data model.

Animation should be an enhancement to the existing Seniorly product, not a reason to restructure the application.
