# `install/` — bootstrap layer

These files are the thin shell around the `founderos` CLI. They exist so the
`curl | bash` and `irm | iex` install paths work even before anything is on the
user's machine.

| File | Role |
|---|---|
| `install.sh` | macOS / Linux entry point. Checks Node, picks a runner, hands off to the CLI. |
| `install.ps1` | Windows / PowerShell equivalent. |
| `validate-env.js` | Zero-dependency environment check. Runs standalone — no build step. |
| `bootstrap.ts` | Thin entrypoint to the bootstrap pipeline (real logic lives in `cli/src/bootstrap.ts`). |
| `setup-wizard.ts` | Thin entrypoint to the interactive wizard (real logic lives in `cli/src/setup-wizard.ts`). |

## How the handoff works

```
curl|bash  ──►  install.sh  ──►  npx @aadhib/founderos install --from-bootstrap
                                        │
                                        ▼
                                  cli/src/bootstrap.ts
                                  ├─ utils/env.ts        (validate)
                                  ├─ integrations/       (detect tools)
                                  └─ installers/         (place skills)
```

The shell scripts deliberately contain **no skill logic** — they only ensure a
Node runtime exists and then defer to the `founderos` CLI. The real bootstrap
and wizard logic lives **inside the CLI package** so there is one source of
truth, it ships compiled with `founderos`, and it is covered by the CLI's
build and tests. The `bootstrap.ts` / `setup-wizard.ts` files here are thin
standalone entrypoints for local use.

## Running directly

```bash
node install/validate-env.js          # standalone env check — no build needed

# These two need the CLI built first (they import from cli/dist):
pnpm --filter @aadhib/founderos build
pnpm tsx install/bootstrap.ts         # full bootstrap pipeline
pnpm tsx install/setup-wizard.ts      # interactive wizard
```
