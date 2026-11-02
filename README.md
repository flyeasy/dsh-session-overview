# dsh-session-overview

English | [中文](README.zh.md)

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) community plugin: one **recent sessions** list across **all workspaces**, with a color-coded badge showing which workspace each session belongs to.

![icon](icon.svg)

## Why

The built-in sidebar groups sessions under their workspaces, so finding "that session from the other project" means clicking through every workspace. This plugin gives you a single recency-sorted view of every session, with the workspace always visible.

## Features

- **Sidebar section** — an expandable "Recent sessions" block above the sidebar foot showing the 10 most recent sessions; collapse state persists.
- **Full panel** — a "All sessions" icon in the sidebar rail opens a complete view: search by session title or workspace name, show-more paging, one-click filtering by workspace badge.
- **Workspace color badges** — a deterministic 10-hue palette hashed from each workspace folder path; the same workspace always carries the same color, everywhere.
- **Selection highlight** — the session currently open in the main area is highlighted in the list, live.
- **Running spinner** — running sessions show an animated open-ring marker instead of a static dot.
- **Right-click menu** — the same verbs as the built-in session rows: pin/unpin, rename, fork, copy title / session id, archive/unarchive. All operations go through the same host channels, so state stays in sync with the native sidebar.

## Install

```bash
dsh plugin --profile <your-profile> add dsh-session-overview
```

Or point a local checkout at your profile: install this directory as a bundle through the Harness plugin manager, or add it to your profile's bundle stack manually.

Requires the standard web client composition (sidebar + workspace browser + layout).

## How it works

The client half registers three slot entries:

| Slot | Entry |
|---|---|
| `sidebar.panellist` + `main` (key `session-overview`) | the full overview panel |
| `sidebar.footer.action` | the collapsible sidebar section |
| — | context menu overlay lives inside each list component |

Data comes from the same client stores the native sidebar uses (`sessions.list`, `workspaces.list`), so lists update live without polling. No Host-side logic beyond an empty plugin body.

## Compatibility

Developed against DeepSeek Harness 0.2.1-rc.5 (desktop, macOS). Slot contracts used: `sidebar.panellist`, `main`, `sidebar.footer.action`; client services: `sessions`, `workspaces`, `uiWorkspace`, `layout`, `locale`.

## License

[MIT](LICENSE)
