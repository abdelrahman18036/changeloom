import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Mark } from "./Mark";
import { MONO, SANS, T } from "./theme";

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

function rise(frame: number, start: number, dur = 16) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return { opacity: p, translate: `0px ${(1 - p) * 20}px` };
}

/** Every scene sits on this: one headline slot, one visual slot. */
const Scene: React.FC<{
  title: string;
  kicker?: string;
  children?: React.ReactNode;
}> = ({ title, kicker, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: 52,
        padding: "0 140px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {kicker && (
          <div style={{ ...rise(frame, 0, 14), fontFamily: MONO, fontSize: 30, color: T.cobalt }}>
            {kicker}
          </div>
        )}
        <div
          style={{
            ...rise(frame, 3, 16),
            fontFamily: SANS,
            fontSize: 78,
            fontWeight: 600,
            color: T.ink,
            letterSpacing: "-0.03em",
            textAlign: "center",
          }}
        >
          {title}
        </div>
      </div>
      {children}
    </AbsoluteFill>
  );
};

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 50) * 6;
  return (
    <AbsoluteFill style={{ backgroundColor: T.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 640px at ${30 + sway}% -10%, rgba(110,160,255,0.19), transparent 62%), radial-gradient(900px 560px at ${86 - sway}% 108%, rgba(110,160,255,0.10), transparent 62%)`,
        }}
      />
      <AbsoluteFill style={{ opacity: 0.06 }}>
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
          {Array.from({ length: 30 }, (_, i) => {
            const x = (i + 1) * (1920 / 31);
            const bow = Math.sin(i * 0.6 + frame / 65) * 8;
            return (
              <path
                key={i}
                d={`M ${x} 0 C ${x + bow} 360, ${x - bow} 720, ${x} 1080`}
                stroke={T.ink}
                strokeWidth={1.4}
                fill="none"
              />
            );
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Panel: React.FC<{ children: React.ReactNode; width?: number; pad?: number }> = ({
  children,
  width = 1240,
  pad = 34,
}) => (
  <div
    style={{
      width,
      backgroundColor: T.panel,
      border: `1px solid ${T.border}`,
      borderRadius: 18,
      padding: pad,
      display: "flex",
      flexDirection: "column",
      gap: 18,
    }}
  >
    {children}
  </div>
);

/* ─── 1. intro ─────────────────────────────────────────────────────────── */
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [5, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 38 }}>
      <Mark size={180} draw={draw} />
      <div style={{ ...rise(frame, 28, 18), fontFamily: SANS, fontSize: 100, fontWeight: 600, color: T.ink, letterSpacing: "-0.03em" }}>
        Change<span style={{ color: T.cobalt, fontStyle: "italic" }}>loom</span>
      </div>
      <div style={{ ...rise(frame, 40, 18), fontFamily: MONO, fontSize: 36, color: T.muted }}>
        weave a repo into a changelog
      </div>
    </AbsoluteFill>
  );
};

/* ─── 2. the problem ───────────────────────────────────────────────────── */
const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = ["Merge pull request #482 from x/y", "Update index.ts", "fix", "wip", "Merge branch 'main'"];
  return (
    <Scene kicker="today" title="A changelog shouldn't look like this.">
      <Panel>
        {rows.map((r, i) => (
          <div
            key={r}
            style={{
              ...rise(frame, 16 + i * 5, 14),
              fontFamily: MONO,
              fontSize: 30,
              color: T.muted,
              padding: "10px 4px",
            }}
          >
            {r}
          </div>
        ))}
      </Panel>
    </Scene>
  );
};

/* ─── 3. paste ─────────────────────────────────────────────────────────── */
const Paste: React.FC = () => {
  const frame = useCurrentFrame();
  const target = "honojs/hono";
  const typed = target.slice(
    0,
    Math.round(interpolate(frame, [18, 50], [0, target.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
  );
  const lit = frame > 54;
  return (
    <Scene kicker="one step" title="Paste any repo.">
      <div
        style={{
          ...rise(frame, 10, 16),
          display: "flex",
          alignItems: "center",
          gap: 20,
          backgroundColor: T.card,
          border: `2px solid ${lit ? T.cobalt : T.border}`,
          borderRadius: 20,
          padding: "24px 28px",
          width: 1140,
          boxShadow: lit ? "0 0 46px rgba(110,160,255,0.45)" : "none",
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 40, color: T.muted }}>github.com/</span>
        <span style={{ fontFamily: MONO, fontSize: 40, color: T.ink }}>{typed}</span>
        {Math.floor(frame / 8) % 2 === 0 && (
          <span style={{ width: 4, height: 44, backgroundColor: T.cobalt, borderRadius: 2 }} />
        )}
        <div style={{ flex: 1 }} />
        <div style={{ backgroundColor: T.cobalt, color: "#0f1420", fontFamily: SANS, fontWeight: 600, fontSize: 32, padding: "14px 36px", borderRadius: 13 }}>
          Weave
        </div>
      </div>
    </Scene>
  );
};

/* ─── 4. the loom ──────────────────────────────────────────────────────── */
const Weaving: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [0, 1, 2, 3, 4];
  const per = 12;
  const L = 470;
  const R = 1450;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 60 }}>
      <div style={{ fontFamily: MONO, fontSize: 34, color: T.muted }}>reading commits, PRs and releases…</div>
      <svg width={1060} height={350} viewBox="410 0 1100 350">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={490 + i * 94} y1={14} x2={490 + i * 94} y2={336} stroke={T.ink} strokeWidth={2} opacity={0.13} />
        ))}
        {rows.map((r) => {
          const p = interpolate(frame, [r * per, r * per + per], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
          const ltr = r % 2 === 0;
          const y = 42 + r * 66;
          return (
            <line
              key={r}
              x1={ltr ? L : R - (R - L) * p}
              y1={y}
              x2={ltr ? L + (R - L) * p : R}
              y2={y}
              stroke={T.cobalt}
              strokeWidth={11}
              strokeLinecap="round"
              opacity={0.55 + 0.45 * p}
            />
          );
        })}
        {(() => {
          const t = Math.min(frame, rows.length * per);
          const r = Math.min(rows.length - 1, Math.floor(t / per));
          const local = (t % per) / per;
          const ltr = r % 2 === 0;
          return <circle cx={ltr ? L + (R - L) * local : R - (R - L) * local} cy={42 + r * 66} r={16} fill={T.signal} />;
        })()}
      </svg>
    </AbsoluteFill>
  );
};

/* ─── 5. categorized ───────────────────────────────────────────────────── */
const ENTRIES = [
  { c: T.cat.feature, tag: "feat", scope: "router", text: "Match empty wildcard remainder" },
  { c: T.cat.fix, tag: "fix", scope: "client", text: "Merge headers per request" },
  { c: T.cat.breaking, tag: "break", scope: "config", text: "Drop the legacy adapter" },
  { c: T.cat.perf, tag: "perf", scope: "core", text: "40% faster cold start" },
  { c: T.cat.docs, tag: "docs", scope: "guide", text: "Add the migration guide" },
];

const Categorized: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene kicker="the changelog" title="Categorized. Automatically.">
      <Panel>
        {ENTRIES.map((e, i) => (
          <div key={e.text} style={{ ...rise(frame, 14 + i * 7, 15), display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 7, height: 42, borderRadius: 4, backgroundColor: e.c }} />
            <div style={{ fontFamily: MONO, fontSize: 28, color: e.c, width: 120 }}>{e.tag}</div>
            <div style={{ fontFamily: MONO, fontSize: 28, color: T.cobalt, width: 150 }}>{e.scope}:</div>
            <div style={{ fontFamily: SANS, fontSize: 30, color: T.ink }}>{e.text}</div>
          </div>
        ))}
      </Panel>
      <div style={{ ...rise(frame, 56, 16), fontFamily: MONO, fontSize: 28, color: T.muted }}>
        works even with no commit convention
      </div>
    </Scene>
  );
};

/* ─── 6. should I upgrade ──────────────────────────────────────────────── */
const Upgrade: React.FC = () => {
  const frame = useCurrentFrame();
  const chips = ["2 breaking changes", "major version bump", "4 files removed"];
  const p = interpolate(frame, [14, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <Scene kicker="the question nobody answers" title="Should I upgrade?">
      <Panel width={1180}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={140} height={140} style={{ position: "absolute", rotate: "-90deg" }}>
              <circle cx={70} cy={70} r={58} fill="none" stroke={T.raised} strokeWidth={12} />
              <circle cx={70} cy={70} r={58} fill="none" stroke={T.cat.breaking} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${364 * 0.72 * p} 364`} />
            </svg>
            <div style={{ fontFamily: MONO, fontSize: 42, fontWeight: 700, color: T.cat.breaking }}>{Math.round(72 * p)}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontFamily: SANS, fontSize: 40, fontWeight: 600, color: T.cat.breaking }}>Upgrade carefully</div>
            <div style={{ fontFamily: MONO, fontSize: 26, color: T.muted }}>upgrade risk · high</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
            {chips.map((c, i) => (
              <div key={c} style={{ ...rise(frame, 26 + i * 7, 14), fontFamily: MONO, fontSize: 24, color: T.cat.breaking, backgroundColor: "rgba(240,112,95,0.13)", padding: "10px 18px", borderRadius: 10 }}>
                {c}
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </Scene>
  );
};

/* ─── 7. loom score ────────────────────────────────────────────────────── */
const Score: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [12, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const R = 132;
  const C = 2 * Math.PI * R;
  const factors = [
    ["Conventional commits", 91],
    ["PR linkage", 91],
    ["Scoped changes", 82],
    ["Breaking changes explained", 100],
  ] as const;
  return (
    <Scene kicker="new" title="Every repo gets a grade.">
      <div style={{ display: "flex", alignItems: "center", gap: 70 }}>
        <div style={{ position: "relative", width: 320, height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={320} height={320} style={{ position: "absolute", rotate: "-130deg" }}>
            <circle cx={160} cy={160} r={R} fill="none" stroke={T.raised} strokeWidth={18} strokeLinecap="round" strokeDasharray={`${C * 0.78} ${C}`} />
            <circle cx={160} cy={160} r={R} fill="none" stroke={T.cat.feature} strokeWidth={18} strokeLinecap="round" strokeDasharray={`${C * 0.78 * p} ${C}`} />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontFamily: SANS, fontSize: 108, fontWeight: 700, color: T.cat.feature, lineHeight: 1 }}>A</div>
            <div style={{ fontFamily: MONO, fontSize: 28, color: T.muted }}>{Math.round(91 * p)} / 100</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 560 }}>
          {factors.map(([label, v], i) => (
            <div key={label} style={{ ...rise(frame, 18 + i * 6, 14), display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 26, color: T.ink }}>
                <span>{label}</span>
                <span style={{ fontFamily: MONO, color: T.muted }}>{v}%</span>
              </div>
              <div style={{ height: 8, backgroundColor: T.raised, borderRadius: 4, display: "flex" }}>
                <div style={{ width: `${v * p}%`, backgroundColor: T.cobalt, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* ─── 8. insights ──────────────────────────────────────────────────────── */
const Insights: React.FC = () => {
  const frame = useCurrentFrame();
  const stats = [
    ["100", "releases"],
    ["5d", "median gap"],
    ["5.4", "per month"],
    ["19d", "longest"],
  ] as const;
  return (
    <Scene kicker="insights" title="How this project actually ships.">
      <Panel width={1240}>
        <div style={{ display: "flex", gap: 64 }}>
          {stats.map(([v, l], i) => (
            <div key={l} style={{ ...rise(frame, 14 + i * 6, 14), display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontFamily: MONO, fontSize: 46, fontWeight: 700, color: T.ink }}>{v}</span>
              <span style={{ fontFamily: SANS, fontSize: 24, color: T.muted }}>{l}</span>
            </div>
          ))}
        </div>
        <svg width={1170} height={120}>
          {Array.from({ length: 56 }, (_, i) => {
            const h = 22 + ((i * 37) % 74);
            const p = interpolate(frame, [22 + i, 34 + i], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return <line key={i} x1={16 + i * 20.6} y1={108} x2={16 + i * 20.6} y2={108 - h * p} stroke={T.cobalt} strokeWidth={5} strokeLinecap="round" opacity={0.45 + (h / 96) * 0.55} />;
          })}
        </svg>
        <div style={{ fontFamily: MONO, fontSize: 24, color: T.muted }}>denser weave = more frequent releases</div>
      </Panel>
    </Scene>
  );
};

/* ─── 9. people ────────────────────────────────────────────────────────── */
const People: React.FC = () => {
  const frame = useCurrentFrame();
  const people = [
    ["yusukebe", 73, T.cat.fix],
    ["Arman-Luthra", 11, T.cat.feature],
    ["usualoma", 9, T.cat.perf],
    ["codebybilal18", 7, T.cat.docs],
  ] as const;
  return (
    <Scene kicker="people" title="Who actually built this release.">
      <Panel width={1180}>
        {people.map(([name, pct, c], i) => {
          const p = interpolate(frame, [16 + i * 7, 36 + i * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
          return (
            <div key={name} style={{ ...rise(frame, 14 + i * 7, 14), display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: T.raised }} />
              <div style={{ fontFamily: MONO, fontSize: 28, color: T.ink, width: 330 }}>{name}</div>
              <div style={{ flex: 1, height: 10, backgroundColor: T.raised, borderRadius: 5, display: "flex" }}>
                <div style={{ width: `${pct * p}%`, backgroundColor: c, borderRadius: 5 }} />
              </div>
              <div style={{ fontFamily: MONO, fontSize: 26, color: T.muted, width: 70, textAlign: "right" }}>{pct}%</div>
            </div>
          );
        })}
        <div style={{ fontFamily: MONO, fontSize: 24, color: T.muted, marginTop: 6 }}>
          scoped to this release — GitHub can&apos;t show you this
        </div>
      </Panel>
    </Scene>
  );
};

/* ─── 10. export ───────────────────────────────────────────────────────── */
const Export: React.FC = () => {
  const frame = useCurrentFrame();
  const items = ["Markdown", "Keep a Changelog", "JSON", "Atom feed", "llms.txt", "README badge", "OG card", "CI API"];
  return (
    <Scene kicker="export" title="Then take it anywhere.">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, width: 1180, justifyContent: "center" }}>
        {items.map((it, i) => (
          <div
            key={it}
            style={{
              ...rise(frame, 12 + i * 5, 14),
              fontFamily: MONO,
              fontSize: 30,
              color: T.ink,
              backgroundColor: T.panel,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: "18px 30px",
            }}
          >
            {it}
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* ─── 11. open source ──────────────────────────────────────────────────── */
const OpenSource: React.FC = () => {
  const frame = useCurrentFrame();
  const points = ["No account", "No install", "No AI key needed", "MIT licensed", "Self-hostable"];
  return (
    <Scene kicker="free forever" title="Open source, all of it.">
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {points.map((p, i) => (
          <div key={p} style={{ ...rise(frame, 12 + i * 7, 14), display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: T.cobalt }} />
            <div style={{ fontFamily: SANS, fontSize: 42, color: T.ink }}>{p}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* ─── 12. outro ────────────────────────────────────────────────────────── */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
      <div style={rise(frame, 0, 18)}>
        <Mark size={128} />
      </div>
      <div style={{ ...rise(frame, 12, 18), fontFamily: SANS, fontSize: 78, fontWeight: 600, color: T.ink, letterSpacing: "-0.03em" }}>
        changeloom.vercel.app
      </div>
      <div style={{ ...rise(frame, 24, 18), fontFamily: MONO, fontSize: 34, color: T.muted }}>
        paste a repo · get a changelog
      </div>
    </AbsoluteFill>
  );
};

/**
 * The scenes are authored on a 1920×1080 stage. This scales that stage to fit
 * whatever the composition actually is, so a 1:1 or 9:16 cut letterboxes
 * cleanly instead of overflowing fixed-width panels off the edges.
 */
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useVideoConfig();
  const scale = Math.min(width / 1920, height / 1080);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 1920,
          height: 1080,
          scale: String(scale),
          position: "relative",
          flexShrink: 0,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

export const Tour: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = (n: number) => Math.round(n * fps);
  let at = 0;
  const cut = (dur: number, el: React.ReactNode) => {
    const node = (
      <Sequence key={at} from={s(at)} durationInFrames={s(dur)}>
        {el}
      </Sequence>
    );
    at += dur;
    return node;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: T.bg }}>
      <Backdrop />
      <Stage>
      {cut(3.2, <Intro />)}
      {cut(4.0, <Problem />)}
      {cut(3.6, <Paste />)}
      {cut(2.4, <Weaving />)}
      {cut(4.4, <Categorized />)}
      {cut(4.2, <Upgrade />)}
      {cut(4.2, <Score />)}
      {cut(4.0, <Insights />)}
      {cut(4.2, <People />)}
      {cut(3.8, <Export />)}
      {cut(3.8, <OpenSource />)}
      {cut(3.6, <Outro />)}
      </Stage>
    </AbsoluteFill>
  );
};
