---
name: copy-options-before-implementing
description: For user-facing copy (toasts, labels, messages), propose a few options and let the user pick before implementing.
metadata:
  type: feedback
---

When a task involves user-facing copy (toast text, button labels, error/status messages), present a few concrete wording options and let the user choose BEFORE writing the implementation.

**Why:** The user has twice explicitly asked "дай пару идей для копирайта перед тем как делать" / "придумай копирайты до имплементации, дай выбрать" — they want to own the wording.

**How to apply:** Use AskUserQuestion with 3-4 lowercase options (brand voice is terse, all lowercase; the `Text` toast component force-lowercases anyway). Wire the chosen copy via i18n keys under the `toaster` namespace in `messages/*.json` (all 7 locales: en, de, fr, it, ja, zh, ko), not hardcoded strings.
