import { createHyperSubLayers, LayerCommand } from "./utils";

type HyperLayers = Parameters<typeof createHyperSubLayers>[0];
type Row =
  | { kind: "label"; key: string; label: string; isApp: boolean }
  | { kind: "remap"; key: string; output: string };

const keyLabels: Record<string, string> = {
  quote: "'",
  escape: "esc",
  grave_accent_and_tilde: "`",
  open_bracket: "[",
  close_bracket: "]",
  backslash: "\\",
  hyphen: "-",
  equal_sign: "=",
  period: ".",
  comma: ",",
  delete_or_backspace: "⌫",
  spacebar: "space",
  left_arrow: "←",
  down_arrow: "↓",
  up_arrow: "↑",
  right_arrow: "→",
};

function keyLabel(key: string) {
  return keyLabels[key] ?? key.toUpperCase();
}

function toRow(key: string, command: LayerCommand): Row {
  const [first] = command.to;
  const app = first?.shell_command?.match(/^open -a '(.+)\.app'$/)?.[1];
  if (app) return { kind: "label", key: keyLabel(key), label: app, isApp: true };
  if (command.to.length === 1 && first.key_code && !first.modifiers) {
    return { kind: "remap", key: keyLabel(key), output: keyLabel(first.key_code) };
  }
  return { kind: "label", key: keyLabel(key), label: command.description ?? "", isApp: false };
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderList(rows: Row[]) {
  if (rows.length === 0) return "";
  const items = rows.map((row) => {
    const value =
      row.kind === "remap"
        ? `<span class="arrow">→</span> <span class="output">${escapeHtml(row.output)}</span>`
        : escapeHtml(row.label);
    return `<li><kbd>${escapeHtml(row.key)}</kbd><span class="value">${value}</span></li>`;
  });
  return `<ul>${items.join("")}</ul>`;
}

function renderGroup(title: string, columns: string[]) {
  return `<section>
      <h2>${escapeHtml(title)}</h2>
      <div class="columns">${columns.map((column) => `<div>${column}</div>`).join("")}</div>
    </section>`;
}

export function createCheatSheet(layers: HyperLayers) {
  const mainRows: Row[] = [];
  const subLayers: string[] = [];

  for (const [key, value] of Object.entries(layers)) {
    if ("to" in value) {
      mainRows.push(toRow(key, value));
      continue;
    }
    const rows = Object.entries(value).map(([subKey, command]) => toRow(subKey, command));
    subLayers.push(renderGroup(`Hyper + ${keyLabel(key)}`, [renderList(rows)]));
  }

  const apps = mainRows.filter((row) => row.kind === "label" && row.isApp);
  const actions = mainRows.filter((row) => row.kind === "label" && !row.isApp);
  const remaps = mainRows.filter((row) => row.kind === "remap");
  const isDigit = (row: Row) => row.kind === "remap" && /^\d$/.test(row.output);

  const mainGroup = renderGroup("Hyper + …", [
    renderList(apps) + renderList(actions),
    renderList(remaps.filter(isDigit)),
    renderList(remaps.filter((row) => !isDigit(row))),
  ]);

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Hyper shortcuts</title>
<style>
  :root {
    --surface: #1c1c21;
    --ring: rgba(255, 255, 255, 0.1);
    --rule: rgba(255, 255, 255, 0.08);
    --text: #ececf1;
    --text-muted: #8e8e9a;
    --key: #2c2c33;
    --key-ring: rgba(255, 255, 255, 0.09);
    --key-edge: rgba(0, 0, 0, 0.55);
    --shadow: rgba(0, 0, 0, 0.5);
  }
  @media (prefers-color-scheme: light) {
    :root {
      --surface: #f6f6f8;
      --ring: rgba(0, 0, 0, 0.1);
      --rule: rgba(0, 0, 0, 0.08);
      --text: #1d1d22;
      --text-muted: #686874;
      --key: #ffffff;
      --key-ring: rgba(0, 0, 0, 0.1);
      --key-edge: rgba(0, 0, 0, 0.14);
      --shadow: rgba(0, 0, 0, 0.22);
    }
  }
  html, body { margin: 0; height: 100%; background: transparent; }
  body {
    display: grid;
    place-items: center;
    font: 14px/1.4 -apple-system, BlinkMacSystemFont, sans-serif;
    font-variant-numeric: tabular-nums;
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    -webkit-user-select: none;
    cursor: default;
  }
  main {
    padding: 20px 28px 26px;
    background: var(--surface);
    border-radius: 14px;
    box-shadow: 0 0 0 1px var(--ring), 0 24px 64px -8px var(--shadow);
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
    margin-bottom: 20px;
    color: var(--text-muted);
    font-size: 12px;
  }
  .layout {
    display: grid;
    grid-template-columns: auto auto;
    column-gap: 28px;
  }
  .sublayers {
    display: grid;
    align-content: start;
    row-gap: 22px;
    padding-left: 28px;
    border-left: 1px solid var(--rule);
  }
  h2 {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 600;
  }
  .columns { display: flex; gap: 32px; }
  .columns > div { display: grid; align-content: start; row-gap: 14px; }
  ul {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: start;
    gap: 6px 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li { display: contents; }
  kbd {
    justify-self: end;
    min-width: 12px;
    padding: 0 6px;
    font: 600 12px/22px -apple-system, BlinkMacSystemFont, sans-serif;
    text-align: center;
    background: var(--key);
    border-radius: 5px;
    box-shadow: inset 0 0 0 1px var(--key-ring), 0 1px 0 var(--key-edge);
  }
  header kbd { font-size: 11px; line-height: 18px; padding: 0 5px; color: var(--text); }
  .value { align-self: center; white-space: nowrap; }
  .arrow { color: var(--text-muted); }
  .output { font-weight: 600; }
</style>
</head>
<body>
<main>
  <header>
    <span>Hyper is Caps Lock</span>
    <span><kbd>esc</kbd> to close</span>
  </header>
  <div class="layout">
    ${mainGroup}
    <div class="sublayers">
    ${subLayers.join("\n    ")}
    </div>
  </div>
</main>
</body>
</html>
`;
}
