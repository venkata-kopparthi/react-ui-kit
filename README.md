# react-ui-kit

A small set of accessible React components — **Button**, **TextField**, **Dialog** and **Tabs** — with Storybook docs and automated accessibility tests.

The goal is components that behave correctly for keyboard and screen-reader users out of the box, without pulling in a large UI framework. Styling is plain CSS with custom properties, so it's easy to theme or override.

## Components

| Component | What it handles |
| --- | --- |
| `Button` | `type="button"` by default, loading state (`aria-busy`, disabled while busy), four variants, three sizes, forwards refs |
| `TextField` | Label, hint and error wired to the input with `aria-describedby` / `aria-invalid`, unique ids via `useId` |
| `Dialog` | Renders in a portal, traps focus, closes on <kbd>Esc</kbd> and backdrop click, restores focus to the trigger, locks page scroll |
| `Tabs` | WAI-ARIA tabs pattern: roving tabindex, <kbd>←</kbd> <kbd>→</kbd> <kbd>Home</kbd> <kbd>End</kbd>, skips disabled tabs |

## Usage

```tsx
import { Button, Dialog, TextField } from "react-ui-kit";
import "react-ui-kit/styles.css";

function InviteButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite teammate</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Invite teammate"
        footer={<Button onClick={() => setOpen(false)}>Send invite</Button>}
      >
        <TextField label="Email" type="email" hint="They'll get a link that expires in 7 days." />
      </Dialog>
    </>
  );
}
```

Works with React 18 and 19. In a Next.js App Router project, use the components from a Client Component (`"use client"`), since `Dialog` and `Tabs` use state and effects.

### Theming

Override the custom properties anywhere above the components:

```css
:root {
  --ui-accent: #0f766e;
  --ui-accent-hover: #115e59;
  --ui-radius: 4px;
}
```

Dark mode follows `prefers-color-scheme`. Set `data-theme="light"` on `<html>` to force the light palette.

## Development

```bash
npm install
npm run storybook   # component docs at http://localhost:6006
npm test            # unit + accessibility tests
npm run build       # ESM bundle, type declarations and styles.css in dist/
```

Every component has an axe-core check in its test file (see `src/test/axe.ts`) alongside behavior tests written with Testing Library, e.g. that focus stays inside an open dialog and that arrow keys skip disabled tabs. CI runs type-checking, tests, the library build and the Storybook build on every push.

## Notes

- The build uses tsup for the JavaScript bundle and `tsc` for declarations, since tsup's bundled `.d.ts` step doesn't support TypeScript 7 yet.
- `Dialog` doesn't use the native `<dialog>` element yet. It would simplify the focus handling, but jsdom's support is still incomplete, which makes it harder to test.
- Not published to npm. Install from GitHub with `npm install github:venkata-kopparthi/react-ui-kit` (the `prepare` script builds it), or copy the components you need.
