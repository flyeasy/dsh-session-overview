window.__ModuleLoader__.load({
  id: '@local/session-overview',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'session-overview';
    const PANEL_ID = 'session-overview';

    // Deterministic per-workspace badge colors (fixed palette, hash → hue family).
    const PALETTE = [
      { hue: 210, name: 'blue' },
      { hue: 160, name: 'green' },
      { hue: 25, name: 'orange' },
      { hue: 280, name: 'purple' },
      { hue: 345, name: 'red' },
      { hue: 190, name: 'cyan' },
      { hue: 55, name: 'olive' },
      { hue: 320, name: 'pink' },
      { hue: 125, name: 'lime' },
      { hue: 245, name: 'indigo' },
    ];
    function hashString(text) {
      let hash = 5381;
      for (let i = 0; i < text.length; i += 1) hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
      return Math.abs(hash);
    }
    function workspaceColor(path) {
      return PALETTE[hashString(String(path)) % PALETTE.length];
    }
    function basenameOf(path) {
      const clean = String(path || '').replace(/[\\/]+$/, '');
      const index = Math.max(clean.lastIndexOf('/'), clean.lastIndexOf('\\'));
      return index >= 0 ? clean.slice(index + 1) : clean;
    }
    function relativeTime(ms) {
      if (!ms) return '';
      const diff = Date.now() - ms;
      const minute = 60_000, hour = 3_600_000, day = 86_400_000;
      if (diff < minute) return '<1m';
      if (diff < hour) return `${Math.floor(diff / minute)}m`;
      if (diff < day) return `${Math.floor(diff / hour)}h`;
      if (diff < 30 * day) return `${Math.floor(diff / day)}d`;
      return new Date(ms).toLocaleDateString();
    }

    const CSS = `
      .${NS} { height: 100%; overflow-y: auto; box-sizing: border-box; padding: 20px 24px 32px; color: var(--dsw-alias-label-primary); }
      .${NS}-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 12px; }
      .${NS}-head h2 { margin: 0; font-size: 16px; font-weight: 600; }
      .${NS}-head .${NS}-count { color: var(--dsw-alias-label-secondary); font-size: 12px; }
      .${NS}-search { width: 100%; box-sizing: border-box; margin-bottom: 12px; padding: 7px 12px; font-size: 13px;
        color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-1);
        border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; outline: none; }
      .${NS}-search:focus { border-color: var(--dsw-alias-brand-primary); }
      .${NS}-list { display: flex; flex-direction: column; border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 10px; background: var(--dsw-alias-bg-layer-1); overflow: hidden; }
      .${NS}-row { display: flex; align-items: center; gap: 10px; width: 100%; box-sizing: border-box; text-align: left;
        padding: 9px 14px; font: inherit; font-size: 13px; color: inherit; background: transparent; border: none;
        border-bottom: 1px solid var(--dsw-alias-border-l1); cursor: pointer; }
      .${NS}-row:last-child { border-bottom: none; }
      .${NS}-row:hover { background: var(--dsw-alias-bg-layer-2); }
      .${NS}-row.selected { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 9%, transparent); }
      .${NS}-row.selected:hover { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent); }
      .${NS}-row-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .${NS}-row-title.running { font-weight: 600; }
      .${NS}-row-time { color: var(--dsw-alias-label-secondary); font-size: 11px; flex: none; }
      .${NS}-badge { display: inline-flex; align-items: center; gap: 5px; flex: none; max-width: 180px;
        padding: 2px 8px 2px 6px; border-radius: 999px; font-size: 11px; color: var(--dsw-alias-label-secondary);
        background: var(--dsw-alias-bg-layer-2); }
      .${NS}-badge-dot { width: 8px; height: 8px; border-radius: 999px; flex: none; }
      .${NS}-badge-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .${NS}-run { width: 10px; height: 10px; color: var(--dsw-alias-state-success-primary); flex: none; }
      @keyframes ${NS}-spin { to { transform: rotate(360deg); } }
      .${NS}-run svg { display: block; animation: ${NS}-spin 0.9s linear infinite; }
      @media (prefers-reduced-motion: reduce) { .${NS}-run svg { animation: none; } }
      .${NS}-empty { padding: 40px 0; text-align: center; color: var(--dsw-alias-label-secondary); font-size: 13px; }
      .${NS}-more { margin-top: 12px; align-self: center; padding: 6px 14px; font: inherit; font-size: 12px;
        color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-1);
        border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; cursor: pointer; }
      .${NS}-more:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
      .${NS}-side { border-top: 1px solid var(--dsw-alias-border-l1); }
      .${NS}-side-head { display: flex; align-items: center; gap: 6px; width: auto; box-sizing: border-box;
        margin: 8px 8px 4px; padding: 6px 10px; font: inherit; font-size: 14px; font-weight: 600;
        color: var(--dsw-alias-brand-primary); background: color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent);
        border: none; border-radius: var(--dsw-radius-md, 8px); cursor: pointer; text-align: left; }
      .${NS}-side-head:hover { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent); }
      .${NS}-side-head:focus-visible { outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-alias-brand-primary); outline-offset: -2px; }
      .${NS}-side-chev { flex: none; transition: transform 0.15s ease; font-size: 10px; }
      .${NS}-side-chev.open { transform: rotate(90deg); }
      .${NS}-side-count { margin-left: auto; font-weight: 400; opacity: 0.7; }
      .${NS}-side-list { display: flex; flex-direction: column; padding-bottom: 6px; }
      .${NS}-side-row { display: flex; align-items: center; gap: 8px; width: 100%; box-sizing: border-box; text-align: left;
        padding: 6px 14px 6px 18px; font: inherit; font-size: 14px; line-height: 22px; color: inherit; background: transparent;
        border: none; cursor: pointer; }
      .${NS}-side-row:hover { background: var(--dsw-alias-bg-layer-2); }
      .${NS}-side-row.selected { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 9%, transparent); }
      .${NS}-side-row.selected:hover { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent); }
      .${NS}-side-row-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .${NS}-side-row-title.running { font-weight: 600; }
      .${NS}-side-dot { width: 7px; height: 7px; border-radius: 999px; flex: none; }
      .${NS}-side-time { color: var(--dsw-alias-label-secondary); font-size: 12px; flex: none; }
      .${NS}-side-empty { padding: 4px 14px 8px 18px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
    `;

    function useObservable(observable) {
      const [, setTick] = React.useState(0);
      React.useEffect(() => {
        if (!observable || typeof observable.subscribe !== 'function') return undefined;
        return observable.subscribe(() => setTick((tick) => tick + 1));
      }, [observable]);
      return observable && typeof observable.getSnapshot === 'function' ? observable.getSnapshot() : undefined;
    }

    function PanelIcon(props) {
      const size = (props && props.size) || 18;
      const active = Boolean(props && props.active);
      return h('svg', {
        viewBox: '0 0 64 64', width: size, height: size, 'aria-hidden': true,
        style: { display: 'block', opacity: active ? 1 : 0.85 },
      }, [
        h('rect', { x: 6, y: 6, width: 52, height: 52, rx: 12, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 }),
        h('rect', { x: 16, y: 20, width: 20, height: 4, rx: 2, fill: 'currentColor' }),
        h('rect', { x: 16, y: 30, width: 26, height: 4, rx: 2, fill: 'currentColor', opacity: 0.7 }),
        h('rect', { x: 16, y: 40, width: 16, height: 4, rx: 2, fill: 'currentColor', opacity: 0.7 }),
      ]);
    }

    /** Spinning open ring marking a running session. */
    function RunMark(key) {
      return h('span', { className: `${NS}-run`, key }, h('svg', {
        viewBox: '0 0 10 10', width: 10, height: 10, 'aria-hidden': true,
      }, h('circle', {
        cx: 5, cy: 5, r: 3.5, fill: 'none', stroke: 'currentColor',
        'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-dasharray': '16 6',
      })));
    }

    /** Recent non-blank, non-subagent sessions, newest first, each mapped to its workspace. */
    function useRecentRows(ctx) {
      const sessionsService = ctx.get('sessions');
      const workspacesService = ctx.get('workspaces');
      const sessionList = useObservable(sessionsService && sessionsService.list);
      const workspaceList = useObservable(workspacesService && workspacesService.list);
      const workspaceBySession = new Map();
      const workspaces = (workspaceList && Array.isArray(workspaceList.items)) ? workspaceList.items : [];
      for (const workspace of workspaces) {
        const label = workspace.title || basenameOf(workspace.path);
        const color = workspaceColor(workspace.path || workspace.id);
        for (const sessionId of workspace.sessionIds || []) {
          workspaceBySession.set(sessionId, { label, path: workspace.path || '', color });
        }
      }
      const rows = [];
      if (sessionList && sessionList.byId) {
        for (const sessionId of sessionList.ids || []) {
          const summary = sessionList.byId[sessionId];
          if (!summary || summary.blank || summary.origin === 'subagent') continue;
          rows.push({ summary, workspace: workspaceBySession.get(sessionId) });
        }
      }
      rows.sort((a, b) => b.summary.updatedAt - a.summary.updatedAt);
      const pinnedIds = new Set(workspaceList && workspaceList.pinnedSessionIds || []);
      const archivedIds = new Set(workspaceList && workspaceList.archivedSessionIds || []);
      return { rows, pinnedIds, archivedIds };
    }

    /** The session currently open in the main area: the one holding the main view reference. */
    function useCurrentSessionId(ctx) {
      const sessionsService = ctx.get('sessions');
      const sessionList = useObservable(sessionsService && sessionsService.list);
      if (!sessionList || !sessionList.byId) return undefined;
      for (const sessionId of sessionList.ids || []) {
        const summary = sessionList.byId[sessionId];
        if (summary && summary.retainedBy && (summary.retainedBy.mainView ?? 0) > 0) return sessionId;
      }
      return undefined;
    }

    // ---- Right-click session menu (same verbs as the workspace browser rows) ----

    const MENU_CSS = `
      .${NS}-menu { position: fixed; z-index: 1200; min-width: 200px; box-sizing: border-box; padding: 4px;
        background: var(--dsw-alias-bg-overlay); border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px;
        box-shadow: 0 8px 24px color-mix(in srgb, var(--dsw-alias-label-primary) 18%, transparent); }
      .${NS}-menu-item { display: flex; align-items: center; gap: 8px; width: 100%; box-sizing: border-box;
        padding: 6px 10px; font: inherit; font-size: 13px; color: var(--dsw-alias-label-primary);
        background: transparent; border: none; border-radius: 6px; cursor: pointer; text-align: left; }
      .${NS}-menu-item:hover { background: var(--dsw-alias-bg-layer-2); }
      .${NS}-menu-item[disabled] { opacity: 0.45; cursor: default; }
      .${NS}-menu-sep { height: 1px; margin: 4px 6px; background: var(--dsw-alias-border-l1); }
      .${NS}-rename-mask { position: fixed; inset: 0; z-index: 1300; display: flex; align-items: center; justify-content: center;
        background: color-mix(in srgb, var(--dsw-alias-label-primary) 25%, transparent); }
      .${NS}-rename-card { box-sizing: border-box; width: 340px; padding: 16px;
        background: var(--dsw-alias-bg-overlay); border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px;
        box-shadow: 0 12px 32px color-mix(in srgb, var(--dsw-alias-label-primary) 24%, transparent); }
      .${NS}-rename-title { margin: 0 0 10px; font-size: 14px; font-weight: 600; color: var(--dsw-alias-label-primary); }
      .${NS}-rename-input { width: 100%; box-sizing: border-box; padding: 7px 10px; font: inherit; font-size: 13px;
        color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-1);
        border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; outline: none; }
      .${NS}-rename-input:focus { border-color: var(--dsw-alias-brand-primary); }
      .${NS}-rename-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
      .${NS}-rename-btn { padding: 5px 14px; font: inherit; font-size: 13px; border-radius: 8px; cursor: pointer;
        border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); }
      .${NS}-rename-btn:hover { background: var(--dsw-alias-bg-layer-2); }
      .${NS}-rename-primary { background: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary);
        color: var(--dsw-alias-bg-base); }
    `;

    function copyText(text) {
      try { navigator.clipboard.writeText(text).catch(() => {}); } catch { /* clipboard unavailable */ }
    }

    /**
     * Context menu / rename dialog for one session row.
     * `state`: {kind:'menu', x, y, row} or {kind:'rename', row, value}; cleared by onClose().
     */
    function SessionMenuOverlay(props) {
      const ctx = props.ctx;
      const state = props.state;
      const setState = props.setState;
      const onClose = () => setState(null);
      const t = ctx.locale.bind(NS);
      const uiWorkspace = ctx.get('uiWorkspace');
      const sessions = ctx.get('sessions');
      const closeRef = React.useRef(null);
      closeRef.current = onClose;

      React.useEffect(() => {
        if (!state) return undefined;
        const onKey = (event) => { if (event.key === 'Escape') closeRef.current(); };
        const onDown = (event) => {
          if (state.kind === 'rename') return;
          if (event.target.closest && event.target.closest(`.${NS}-menu, .${NS}-rename-card`)) return;
          closeRef.current();
        };
        const onScroll = () => { if (state.kind === 'menu') closeRef.current(); };
        window.addEventListener('keydown', onKey);
        window.addEventListener('mousedown', onDown, true);
        window.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onScroll);
        return () => {
          window.removeEventListener('keydown', onKey);
          window.removeEventListener('mousedown', onDown, true);
          window.removeEventListener('scroll', onScroll, true);
          window.removeEventListener('resize', onScroll);
        };
      }, [state]);

      if (!state) return null;

      const row = state.row;
      const id = row.summary.id;
      const pinned = props.pinnedIds.has(id);
      const archived = props.archivedIds.has(id);
      const title = row.summary.title || row.summary.displayTitle || '';

      const run = (promise) => { try { Promise.resolve(promise).catch((error) => console.error(`[${NS}]`, error)); } catch (error) { console.error(`[${NS}]`, error); } };

      if (state.kind === 'rename') {
        const commit = () => {
          const next = String(state.value || '').trim();
          onClose();
          if (!next || next === title) return;
          run(sessions.using(id, { source: 'workspaceOperation' }, (reference) => reference.binding.session.rename(next)));
        };
        return h('div', {
          className: `${NS}-rename-mask`, onMouseDown: (event) => { if (event.target === event.currentTarget) onClose(); },
        }, h('div', { className: `${NS}-rename-card` }, [
          h('h3', { className: `${NS}-rename-title`, key: 'title' }, t('rename')),
          h('input', {
            key: 'input', className: `${NS}-rename-input`, value: state.value, autoFocus: true,
            onChange: (event) => setState({ kind: 'rename', row, value: event.target.value }),
            onKeyDown: (event) => { if (event.key === 'Enter') commit(); },
          }),
          h('div', { className: `${NS}-rename-actions`, key: 'actions' }, [
            h('button', { className: `${NS}-rename-btn`, key: 'cancel', type: 'button', onClick: onClose }, t('cancel')),
            h('button', { className: `${NS}-rename-btn ${NS}-rename-primary`, key: 'ok', type: 'button', onClick: commit }, t('ok')),
          ]),
        ]));
      }

      const items = [
        { key: 'pin', label: t(pinned ? 'unpin' : 'pin'), action: () => run(pinned ? uiWorkspace.unpinSession(id) : uiWorkspace.pinSession(id)) },
        { key: 'rename', label: t('rename'), action: () => setState({ kind: 'rename', row, value: title }) },
        { key: 'fork', label: t('fork'), action: () => run(uiWorkspace.forkSession(id)) },
        { key: 'sep1', separator: true },
        { key: 'copyTitle', label: t('copyTitle'), disabled: !title, action: () => copyText(title) },
        { key: 'copyId', label: t('copyId'), action: () => copyText(id) },
        { key: 'sep2', separator: true },
        { key: 'archive', label: t(archived ? 'unarchive' : 'archive'), action: () => run(archived ? uiWorkspace.unarchiveSession(id) : uiWorkspace.archiveSession(id)) },
      ];

      const left = Math.min(state.x, window.innerWidth - 230);
      const top = Math.min(state.y, window.innerHeight - items.length * 34 - 20);
      return h('div', { className: `${NS}-menu`, role: 'menu', style: { left, top } }, items.map((item) => item.separator
        ? h('div', { className: `${NS}-menu-sep`, key: item.key, role: 'separator' })
        : h('button', {
          key: item.key, type: 'button', role: 'menuitem', className: `${NS}-menu-item`,
          disabled: item.disabled, onClick: () => { onClose(); item.action(); },
        }, item.label)));
    }

    /** Shared right-click handler for session rows. */
    function useSessionMenu(ctx, pinnedIds, archivedIds) {
      const [state, setState] = React.useState(null);
      const onRowContextMenu = (event, row) => {
        event.preventDefault();
        setState({ kind: 'menu', x: event.clientX, y: event.clientY, row });
      };
      const overlay = h(SessionMenuOverlay, {
        key: 'menu', ctx, state, setState, pinnedIds, archivedIds,
      });
      return { onRowContextMenu, overlay };
    }

    function OverviewPage() {
      const ctx = this && this.ctx;
      const t = ctx.locale.bind(NS);
      const uiWorkspace = ctx.get('uiWorkspace');

      const { rows, pinnedIds, archivedIds } = useRecentRows(ctx);
      const currentId = useCurrentSessionId(ctx);
      const menu = useSessionMenu(ctx, pinnedIds, archivedIds);
      const [query, setQuery] = React.useState('');
      const [limit, setLimit] = React.useState(100);

      const needle = query.trim().toLowerCase();
      const filtered = needle
        ? rows.filter((row) => {
          const title = (row.summary.title || row.summary.displayTitle || '').toLowerCase();
          const workspaceLabel = row.workspace ? row.workspace.label.toLowerCase() : '';
          return title.includes(needle) || workspaceLabel.includes(needle);
        })
        : rows;
      const visible = filtered.slice(0, limit);

      return h('div', { className: NS }, [
        h('div', { className: `${NS}-head`, key: 'head' }, [
          h('h2', { key: 'title' }, t('title')),
          h('span', { className: `${NS}-count`, key: 'count' }, t('count').replace('{n}', String(filtered.length))),
        ]),
        h('input', {
          key: 'search', className: `${NS}-search`, type: 'search',
          placeholder: t('search'), value: query,
          onChange: (event) => { setQuery(event.target.value); setLimit(100); },
        }),
        visible.length === 0
          ? h('div', { className: `${NS}-empty`, key: 'empty' }, rows.length === 0 ? t('empty') : t('noMatch'))
          : h('div', { className: `${NS}-list`, key: 'list' }, visible.map((row) => h('button', {
            key: row.summary.id, type: 'button',
            className: `${NS}-row${row.summary.id === currentId ? ' selected' : ''}`,
            'aria-current': row.summary.id === currentId || undefined,
            title: row.workspace ? row.workspace.path : '',
            onClick: () => {
              if (archivedIds.has(row.summary.id)) return;
              if (uiWorkspace && typeof uiWorkspace.openSession === 'function') uiWorkspace.openSession(row.summary.id);
            },
            onContextMenu: (event) => menu.onRowContextMenu(event, row),
          }, [
            row.summary.running ? RunMark('run') : null,
            h('span', { className: `${NS}-row-title${row.summary.running ? ' running' : ''}`, key: 'title' },
              row.summary.title || row.summary.displayTitle || row.summary.id),
            h('span', { className: `${NS}-row-time`, key: 'time' }, relativeTime(row.summary.updatedAt)),
            h('span', {
              className: `${NS}-badge`, key: 'badge',
              onClick: (event) => {
                event.stopPropagation();
                if (row.workspace) setQuery(row.workspace.label);
              },
            }, [
              h('span', {
                className: `${NS}-badge-dot`, key: 'dot',
                style: {
                  background: `hsl(${row.workspace ? row.workspace.color.hue : 0}, 65%, 55%)`,
                  opacity: row.workspace ? 1 : 0.4,
                },
              }),
              h('span', { className: `${NS}-badge-label`, key: 'label' },
                row.workspace ? row.workspace.label : t('ungrouped')),
            ]),
          ]))),
        filtered.length > limit
          ? h('button', {
            key: 'more', type: 'button', className: `${NS}-more`,
            onClick: () => setLimit((value) => value + 100),
          }, t('showMore'))
          : null,
        limit > 100 && filtered.length <= limit
          ? h('button', {
            key: 'less', type: 'button', className: `${NS}-more`,
            onClick: () => setLimit(100),
          }, t('showLess'))
          : null,
        menu.overlay,
      ]);
    }

    const SIDE_LIMIT = 10;
    const SIDE_EXPAND_KEY = `${NS}.sidebar-expanded`;

    /** Expandable recent-sessions section rendered at the sidebar foot, above Settings. */
    function SidebarRecent(props) {
      const ctx = this && this.ctx;
      const t = ctx.locale.bind(NS);
      const wide = Boolean(props && props.wide);
      const layout = ctx.get('layout');
      const uiWorkspace = ctx.get('uiWorkspace');

      const [expanded, setExpanded] = React.useState(() => {
        try { return window.localStorage.getItem(SIDE_EXPAND_KEY) === '1'; } catch { return false; }
      });
      const toggle = () => setExpanded((value) => {
        const next = !value;
        try { window.localStorage.setItem(SIDE_EXPAND_KEY, next ? '1' : '0'); } catch { /* private mode */ }
        return next;
      });

      const { rows, pinnedIds, archivedIds } = useRecentRows(ctx);
      const currentId = useCurrentSessionId(ctx);
      const menu = useSessionMenu(ctx, pinnedIds, archivedIds);
      const visible = rows.slice(0, SIDE_LIMIT);

      if (!wide) {
        // Collapsed rail: one icon that opens the full overview panel.
        return h('button', {
          type: 'button', className: `${NS}-side-head`, style: { padding: '8px 12px' },
          title: t('panel'), 'aria-label': t('panel'),
          onClick: () => { if (layout && typeof layout.selectPanel === 'function') layout.selectPanel(PANEL_ID); },
        }, h('svg', {
          viewBox: '0 0 64 64', width: 16, height: 16, 'aria-hidden': true,
          style: { display: 'block', color: 'var(--dsw-alias-label-secondary)' },
        }, [
          h('rect', { x: 6, y: 6, width: 52, height: 52, rx: 12, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 }),
          h('rect', { x: 16, y: 20, width: 20, height: 5, rx: 2, fill: 'currentColor' }),
          h('rect', { x: 16, y: 31, width: 26, height: 5, rx: 2, fill: 'currentColor', opacity: 0.7 }),
          h('rect', { x: 16, y: 42, width: 16, height: 5, rx: 2, fill: 'currentColor', opacity: 0.7 }),
        ]));
      }

      return h('div', { className: `${NS}-side` }, [
        h('button', {
          key: 'head', type: 'button', className: `${NS}-side-head`,
          onClick: toggle, 'aria-expanded': expanded,
        }, [
          h('span', { className: `${NS}-side-chev${expanded ? ' open' : ''}`, key: 'chev', 'aria-hidden': true }, '▶'),
          h('span', { key: 'label' }, t('title')),
          h('span', { className: `${NS}-side-count`, key: 'count' }, String(rows.length)),
        ]),
        expanded ? (visible.length === 0
          ? h('div', { className: `${NS}-side-empty`, key: 'empty' }, t('empty'))
          : h('div', { className: `${NS}-side-list`, key: 'list' }, visible.map((row) => h('button', {
            key: row.summary.id, type: 'button',
            className: `${NS}-side-row${row.summary.id === currentId ? ' selected' : ''}`,
            'aria-current': row.summary.id === currentId || undefined,
            title: (row.summary.title || row.summary.displayTitle || '')
              + (row.workspace ? ` · ${row.workspace.path}` : ''),
            onClick: () => {
              if (archivedIds.has(row.summary.id)) return;
              if (uiWorkspace && typeof uiWorkspace.openSession === 'function') uiWorkspace.openSession(row.summary.id);
            },
            onContextMenu: (event) => menu.onRowContextMenu(event, row),
          }, [
            row.summary.running
              ? RunMark('run')
              : h('span', {
                className: `${NS}-side-dot`, key: 'dot',
                style: {
                  background: row.workspace ? `hsl(${row.workspace.color.hue}, 65%, 55%)` : 'transparent',
                  border: row.workspace ? 'none' : '1px solid var(--dsw-alias-border-l2)',
                },
              }),
            h('span', { className: `${NS}-side-row-title${row.summary.running ? ' running' : ''}`, key: 'title' },
              row.summary.title || row.summary.displayTitle || row.summary.id),
            h('span', { className: `${NS}-side-time`, key: 'time' }, relativeTime(row.summary.updatedAt)),
          ]))))
          : null,
        menu.overlay,
      ]);
    }

    const LOCALE_ZH = {
      panel: '全部会话', title: '最近会话', search: '搜索会话或工作区…',
      empty: '还没有会话', noMatch: '没有匹配的会话', ungrouped: '未分组',
      showMore: '显示更多', showLess: '收起', count: '{n} 个会话',
      pin: '置顶', unpin: '取消置顶', rename: '重命名', fork: '创建分支',
      copyTitle: '复制标题', copyId: '复制会话 ID',
      archive: '归档', unarchive: '取消归档', ok: '确定', cancel: '取消',
    };
    const LOCALE_EN = {
      panel: 'All sessions', title: 'Recent sessions', search: 'Search sessions or workspaces…',
      empty: 'No sessions yet', noMatch: 'No matching sessions', ungrouped: 'Ungrouped',
      showMore: 'Show more', showLess: 'Show less', count: '{n} sessions',
      pin: 'Pin', unpin: 'Unpin', rename: 'Rename', fork: 'Fork',
      copyTitle: 'Copy Title', copyId: 'Copy Session ID',
      archive: 'Archive', unarchive: 'Unarchive', ok: 'OK', cancel: 'Cancel',
    };

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        let removeStyle;
        const allCss = CSS + MENU_CSS;
        if (typeof styles !== 'undefined' && styles && typeof styles.insert === 'function') {
          removeStyle = styles.insert(allCss);
        } else {
          const element = document.createElement('style');
          element.dataset.sessionOverview = '';
          element.textContent = allCss;
          document.head.appendChild(element);
          removeStyle = () => element.remove();
        }
        const unregisterZh = ctx.locale.register(NS, 'zh', LOCALE_ZH);
        const unregisterEn = ctx.locale.register(NS, 'en', LOCALE_EN);
        const disposeSlots = ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist', id: PANEL_ID, order: 60,
          label: () => ctx.locale.bind(NS)('panel'), locale: NS,
        }, PanelIcon));
        const disposePage = ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main', key: PANEL_ID, locale: NS,
          inject: () => ({ ctx }),
        }, function OverviewPageBound(props) {
          return OverviewPage.call({ ctx }, props);
        }));
        const disposeSide = ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
          name: 'sidebar.footer.action', id: PANEL_ID, order: 10,
          label: () => ctx.locale.bind(NS)('title'), locale: NS,
        }, function SidebarRecentBound(props) {
          return SidebarRecent.call({ ctx }, props);
        }));
        return () => { disposeSlots(); disposePage(); disposeSide(); removeStyle(); unregisterZh(); unregisterEn(); };
      },
    };
  },
});
