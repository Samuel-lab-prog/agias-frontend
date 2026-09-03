# Ágias Design System

This document defines how to evolve the interface without spreading colors, dimensions, or visual
variants across features.

## Core principle

Every recurring visual decision must have a name and an owner. Raw values belong in the theme,
components consume semantic intent, and features compose components without inventing a new visual
language.

## Layers

1. `src/core/themes/foundations.ts`: raw brand values, radii, durations, and structural sizes.
2. `src/core/themes/semanticTokens.ts`: semantic intentions that adapt to light and dark modes.
3. `src/core/themes/recipes.ts`: Chakra component variants.
4. `src/core/components`: reusable primitives and patterns.
5. `src/features`: domain-specific composition and behavior.

Features may import the `@BaseComponents` public API, but they must not import another component's
internal implementation details.

## Available tokens

### Backgrounds

- `bg.canvas`: global application background.
- `bg.surface`: cards, menus, and panels.
- `bg.muted`: low-emphasis areas.
- `bg.interactive`: subtle interactive highlights.

### Content

- `fg.default`: primary text and icons.
- `fg.muted`: secondary text and icons.
- `fg.inverted`: content placed over a strong background.

### Borders and actions

- `border.default` for dividers, `border.surface` for panel outlines, and
  `border.muted`/`border.interactive` for low-emphasis and interactive borders.
- `action.primary`, `action.primaryStrong`, `action.primarySubtle`.
- `action.destructive`.
- `status.error`, `status.errorSubtle`, `status.warning`.
- `focus.ring`.

### Layout and elevation

- `sizes.topBar`, `sizes.sidebar`, `sizes.content`, `sizes.touchTarget`.
- `surface`, `surfaceStrong`, and `floating` shadows.

## Components

### Primitives

`BaseButton` and `Surface` are the main visual primitives. Supported button variants are:

- `primary`: the primary action on a screen or section.
- `secondary`: a neutral action with a border.
- `subtle`: a low-emphasis action.
- `destructive`: an irreversible or dangerous action.

Do not name variants after colors. `solidPurple` stops making sense when the brand changes;
`primary` remains correct.

### Patterns

- `PageRoot`: a consistent page root.
- `SectionHeader`: a section title, description, and optional action.
- `NavigationPageShell`: top bar, sidebar, and content-width management.
- Form fields, empty/error states, and form surfaces are shared patterns.

Components that know about `Student`, `Staff`, `Admin`, or another domain entity must remain inside
their feature.

## Rules for literal values

Hex and RGB colors are forbidden inside `src/features` by ESLint. When a new visual need appears:

1. Check whether an existing semantic token already expresses the intended role.
2. If it does not, add a foundation value only when the raw value is genuinely new.
3. Add the corresponding light and dark semantic token.
4. Add it to `documentedColorTokens` so it appears in the gallery.
5. Use the semantic name in the feature.

Legitimate exceptions include user-provided values, such as a color-picker fallback, and documented
data-visualization palettes. Keep these exceptions in dedicated modules; never scatter them
throughout a screen.

## Public API and naming

- Files must use the component name: `AudioField.tsx`, not `Component.tsx`.
- Export only the public component and its public props.
- Internal hooks, adapters, and utilities do not belong in the global barrel.
- Do not create pages inside `core`; pages belong to a feature.
- Before moving something into `core`, confirm that more than one domain reuses it and that it
  contains no business vocabulary.

## Adding new UI

1. Start by composing existing primitives and patterns.
2. When the same structure appears in two features, extract a domain-neutral pattern.
3. When the difference is only visual, add a recipe variant instead of creating a new component.
4. Add the new state or variant to the development gallery.
5. Run `bun run check:ui`, `bun run typecheck`, `bun run lint`, and `bun run build`.

## Visual review routes

- `/dev/components/colors`
- `/dev/components/typography`
- `/dev/components/buttons`
- `/dev/components/forms`
- `/dev/components/animations`

These pages must consume the same sources used in production. For example, the color gallery is
generated from `documentedColorTokens`.

## Review checklist

- The feature contains no new hex or RGB values.
- Light and dark modes work without duplicated `_dark` declarations when a semantic token exists.
- Variants describe intent, not appearance.
- Components have searchable names.
- The public API does not expose implementation details.
- Loading, empty, error, disabled, focus, and responsive states have been reviewed.
- The gallery covers every new primitive or variant.

## Student subject details

The subject-details flow lives in `src/features/student/use-cases/subject-details` and is available
at `/student/subjects/:enrollmentId`.

- The page reuses the authenticated student dashboard query instead of duplicating a request.
- `useSubjectDetails` owns route and query state.
- `mapSubjectDetails` converts API entities into presentation-ready data and derived statuses.
- View components consume only the view model and existing semantic tokens.
- Fields absent from the backend, such as professor and subject-specific attendance, are not
  fabricated.
- Loading, request failure, invalid identifiers, missing enrollment, empty sessions, and empty
  activities have explicit states.
