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

/** Fade + rise, the app's own entrance curve. */
function rise(frame: number, start: number, dur = 18) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return { opacity: p, translate: `0px ${(1 - p) * 22}px` };
}

/** Warp threads + drifting cobalt glow — the loom stage, quietly alive. */
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 46) * 7;
  return (
    <AbsoluteFill style={{ backgroundColor: T.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1100px 620px at ${28 + sway}% -12%, rgba(110,160,255,0.20), transparent 62%), radial-gradient(900px 560px at ${88 - sway}% 108%, rgba(110,160,255,0.11), transparent 62%)`,
        }}
      />
      <AbsoluteFill style={{ opacity: 0.07 }}>
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
          {Array.from({ length: 34 }, (_, i) => {
            const x = (i + 1) * (1920 / 35);
            const bow = Math.sin(i * 0.6 + frame / 60) * 9;
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

/** 1 — the mark draws itself, then the name. */
const SceneLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [6, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const word = rise(frame, 30, 20);
  const tag = rise(frame, 44, 20);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
      <Mark size={190} draw={draw} />
      <div style={{ ...word, fontFamily: SANS, fontSize: 104, fontWeight: 600, color: T.ink, letterSpacing: "-0.03em" }}>
        Change<span style={{ color: T.cobalt, fontStyle: "italic" }}>loom</span>
      </div>
      <div style={{ ...tag, fontFamily: MONO, fontSize: 38, color: T.muted }}>
        weave a repo into a changelog
      </div>
    </AbsoluteFill>
  );
};

/** 2 — paste a repo. The URL types itself into the reed. */
const ScenePaste: React.FC = () => {
  const frame = useCurrentFrame();
  const target = "honojs/hono";
  const typed = target.slice(
    0,
    Math.round(interpolate(frame, [16, 52], [0, target.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })),
  );
  const head = rise(frame, 0, 18);
  const bar = rise(frame, 10, 18);
  const caret = frame > 52 || Math.floor(frame / 8) % 2 === 0;
  const glow = interpolate(frame, [54, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 64 }}>
      <div style={{ ...head, fontFamily: SANS, fontSize: 90, fontWeight: 600, color: T.ink, letterSpacing: "-0.03em" }}>
        Paste any repo.
      </div>
      <div
        style={{
          ...bar,
          display: "flex",
          alignItems: "center",
          gap: 22,
          backgroundColor: T.card,
          border: `2px solid ${glow > 0 ? T.cobalt : T.border}`,
          borderRadius: 22,
          padding: "26px 30px",
          width: 1180,
          boxShadow: glow > 0 ? `0 0 ${44 * glow}px rgba(110,160,255,${0.5 * glow})` : "none",
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 42, color: T.muted }}>github.com/</span>
        <span style={{ fontFamily: MONO, fontSize: 42, color: T.ink }}>{typed}</span>
        {caret && <span style={{ width: 4, height: 46, backgroundColor: T.cobalt, borderRadius: 2 }} />}
        <div style={{ flex: 1 }} />
        <div style={{ backgroundColor: T.cobalt, color: "#0f1420", fontFamily: SANS, fontWeight: 600, fontSize: 34, padding: "16px 40px", borderRadius: 14 }}>
          Weave
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 3 — the loom weaves: a shuttle binds one row per pass. */
const SceneWeave: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [0, 1, 2, 3, 4];
  const perRow = 13;
  const L = 460;
  const R = 1460;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 70 }}>
      <div style={{ fontFamily: MONO, fontSize: 36, color: T.muted }}>weaving 4 213 commits…</div>
      <svg width={1120} height={360} viewBox="400 0 1120 360">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={480 + i * 96} y1={16} x2={480 + i * 96} y2={344} stroke={T.ink} strokeWidth={2} opacity={0.14} />
        ))}
        {rows.map((r) => {
          const start = r * perRow;
          const p = interpolate(frame, [start, start + perRow], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          });
          const ltr = r % 2 === 0;
          const y = 44 + r * 68;
          const x1 = ltr ? L : R - (R - L) * p;
          const x2 = ltr ? L + (R - L) * p : R;
          return (
            <line key={r} x1={x1} y1={y} x2={x2} y2={y} stroke={T.cobalt} strokeWidth={11} strokeLinecap="round" opacity={0.55 + 0.45 * p} />
          );
        })}
        {(() => {
          const total = rows.length * perRow;
          const t = Math.min(frame, total);
          const r = Math.min(rows.length - 1, Math.floor(t / perRow));
          const local = (t % perRow) / perRow;
          const ltr = r % 2 === 0;
          const cx = ltr ? L + (R - L) * local : R - (R - L) * local;
          return <circle cx={cx} cy={44 + r * 68} r={17} fill={T.signal} />;
        })()}
      </svg>
    </AbsoluteFill>
  );
};

const ENTRIES = [
  { cat: T.cat.feature, tag: "feat", scope: "router", text: "Match empty wildcard remainder" },
  { cat: T.cat.fix, tag: "fix", scope: "client", text: "Merge headers per request" },
  { cat: T.cat.breaking, tag: "break", scope: "config", text: "Drop the legacy adapter" },
  { cat: T.cat.perf, tag: "perf", scope: "core", text: "40% faster cold start" },
  { cat: T.cat.docs, tag: "docs", scope: "guide", text: "Add the migration guide" },
];

/** 4 — the changelog binds into place, row by row. */
const SceneChangelog: React.FC = () => {
  const frame = useCurrentFrame();
  const head = rise(frame, 0, 16);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 44 }}>
      <div style={{ ...head, fontFamily: SANS, fontSize: 76, fontWeight: 600, color: T.ink, letterSpacing: "-0.03em" }}>
        Categorized. Automatically.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 1220 }}>
        {ENTRIES.map((e, i) => {
          const s = rise(frame, 14 + i * 9, 16);
          return (
            <div
              key={e.text}
              style={{
                ...s,
                display: "flex",
                alignItems: "center",
                gap: 26,
                backgroundColor: T.panel,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: "24px 30px",
              }}
            >
              <div style={{ width: 7, height: 46, borderRadius: 4, backgroundColor: e.cat }} />
              <div style={{ fontFamily: MONO, fontSize: 30, color: e.cat, width: 130 }}>{e.tag}</div>
              <div style={{ fontFamily: MONO, fontSize: 30, color: T.cobalt }}>{e.scope}:</div>
              <div style={{ fontFamily: SANS, fontSize: 32, color: T.ink }}>{e.text}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** 5 — the Loom Score dial fills. */
const SceneScore: React.FC = () => {
  const frame = useCurrentFrame();
  const head = rise(frame, 0, 16);
  const p = interpolate(frame, [12, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const R = 150;
  const C = 2 * Math.PI * R;
  const arc = C * 0.78;
  const shown = Math.round(91 * p);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 52 }}>
      <div style={{ ...head, fontFamily: SANS, fontSize: 76, fontWeight: 600, color: T.ink, letterSpacing: "-0.03em" }}>
        And graded.
      </div>
      <div style={{ position: "relative", width: 400, height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={400} height={400} style={{ position: "absolute", rotate: "-130deg" }}>
          <circle cx={200} cy={200} r={R} fill="none" stroke={T.raised} strokeWidth={20} strokeLinecap="round" strokeDasharray={`${arc} ${C}`} />
          <circle cx={200} cy={200} r={R} fill="none" stroke={T.cat.feature} strokeWidth={20} strokeLinecap="round" strokeDasharray={`${arc * p} ${C}`} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: SANS, fontSize: 130, fontWeight: 700, color: T.cat.feature, lineHeight: 1 }}>A</div>
          <div style={{ fontFamily: MONO, fontSize: 34, color: T.muted, marginTop: 10 }}>{shown} / 100</div>
        </div>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 32, color: T.muted }}>Loom Score · changelog hygiene</div>
    </AbsoluteFill>
  );
};

/** 6 — the close. */
const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const mark = rise(frame, 0, 18);
  const url = rise(frame, 14, 18);
  const sub = rise(frame, 26, 18);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 44 }}>
      <div style={{ ...mark }}>
        <Mark size={130} />
      </div>
      <div style={{ ...url, fontFamily: SANS, fontSize: 82, fontWeight: 600, color: T.ink, letterSpacing: "-0.03em" }}>
        changeloom.vercel.app
      </div>
      <div style={{ ...sub, fontFamily: MONO, fontSize: 36, color: T.muted }}>
        open source · no account · no install
      </div>
    </AbsoluteFill>
  );
};

export const Demo: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = (n: number) => Math.round(n * fps);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Sequence durationInFrames={s(2.9)}><SceneLogo /></Sequence>
      <Sequence from={s(2.9)} durationInFrames={s(3.1)}><ScenePaste /></Sequence>
      <Sequence from={s(6.0)} durationInFrames={s(2.6)}><SceneWeave /></Sequence>
      <Sequence from={s(8.6)} durationInFrames={s(3.4)}><SceneChangelog /></Sequence>
      <Sequence from={s(12.0)} durationInFrames={s(3.0)}><SceneScore /></Sequence>
      <Sequence from={s(15.0)} durationInFrames={s(3.0)}><SceneOutro /></Sequence>
    </AbsoluteFill>
  );
};
