// AUTO-MANAGED library component. Self-contained (no sibling imports).
// Rendered by Lesson.tsx as <N8nNode scene={scene} durF={durF} />.
//
// scene contract:
//   scene.nodes?: Array<NodeSpec>   // a row of n8n nodes (left -> right)
//   scene.node?:  NodeSpec          // single node (shorthand)
//   scene.mockup_title?: string     // optional heading, top-left
//   scene.bg?: string               // optional canvas background override
// NodeSpec = {
//   label: string; kind?: string; accent?: string; isTrigger?: boolean;
//   state?: "idle"|"selected"|"running"|"success"|"error"|"disabled";
//   outputLabel?: string; showToolbar?: boolean; showExecuteButton?: boolean;
//   showAddButton?: boolean;
// }
import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

type NodeSpec = {
	label?: string;
	kind?: string;
	accent?: string;
	isTrigger?: boolean;
	state?: "idle" | "selected" | "running" | "success" | "error" | "disabled";
	outputLabel?: string;
	showToolbar?: boolean;
	showExecuteButton?: boolean;
	showAddButton?: boolean;
};

const C = {
	canvas: "#111114",
	dot: "#232329",
	node: "#39393f",
	nodeBorder: "rgba(255,255,255,0.13)",
	label: "#dfe0e3",
	heading: "#e8e8ec",
	bolt: "#f5852b",
	execute: "#f26a2c",
	handleDot: "#7d7f86",
	handleText: "#9a9ca3",
	line: "#4a4a51",
	plusFill: "#2b2b30",
	plusStroke: "#4a4a51",
	plusGlyph: "#9a9ca3",
	toolbarBg: "#26262b",
	toolbarBorder: "rgba(255,255,255,0.10)",
	toolbarIcon: "#b5b7bd",
	running: "#ff6d3d",
	success: "#35b77e",
	error: "#e45157",
};
const FONT = "'Open Sans', Inter, 'Padauk', 'Noto Sans Myanmar', ui-sans-serif, system-ui, sans-serif";
const SIZE = 96;

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
	<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true">{children}</svg>
);
const s = {fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};

const ICONS: Record<string, {icon: React.ReactNode; accent: string}> = {
	webhook: {accent: "#ff5cb1", icon: (
		<Svg>
			<circle cx="12" cy="7" r="1.5" fill="currentColor" /><circle cx="6.5" cy="16.5" r="1.5" fill="currentColor" /><circle cx="17.5" cy="16.5" r="1.5" fill="currentColor" />
			<path stroke="currentColor" strokeWidth="1.5" d="M15.248 8.875a3.748 3.748 0 0 0-1.373-5.123 3.75 3.75 0 1 0-3.75 6.496L6.5 16.5" />
			<path stroke="currentColor" strokeWidth="1.5" d="M6.5 12.75a3.75 3.75 0 1 0 3.75 3.75h7.25" />
			<path stroke="currentColor" strokeWidth="1.5" d="M14.252 18.375a3.75 3.75 0 1 0 1.373-5.123L12 7" />
		</Svg>)},
	manualTrigger: {accent: "#b0b3bb", icon: <Svg><path {...s} d="M5 3l14 8-6 1.5L10 19 5 3z" /></Svg>},
	schedule: {accent: "#9aa0aa", icon: <Svg><circle {...s} cx="12" cy="12" r="9" /><path {...s} d="M12 7v5l3.5 2.5" /></Svg>},
	wait: {accent: "#9aa0aa", icon: <Svg><path {...s} d="M7 3h10M7 21h10M8 3c0 4 8 5 8 9s-8 5-8 9M16 3c0 4-8 5-8 9" /></Svg>},
	set: {accent: "#4e9bf5", icon: <Svg><path {...s} d="M4 20l4-1 9.5-9.5a2 2 0 0 0-2.83-2.83L5.17 15.17 4 20z" /><path {...s} d="M13.5 6.5l4 4" /></Svg>},
	if: {accent: "#3f9e4d", icon: <Svg><circle {...s} cx="6" cy="6" r="2.5" /><circle {...s} cx="6" cy="18" r="2.5" /><circle {...s} cx="18" cy="12" r="2.5" /><path {...s} d="M8.5 6H12a3.5 3.5 0 0 1 3.5 3.5V10M8.5 18H12a3.5 3.5 0 0 0 3.5-3.5V14" /></Svg>},
	filter: {accent: "#3f9e4d", icon: <Svg><path {...s} d="M3 5h18l-7 8v6l-4 2v-8L3 5z" /></Svg>},
	httpRequest: {accent: "#0ea5c6", icon: <Svg><circle {...s} cx="12" cy="12" r="9" /><path {...s} d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" /></Svg>},
	code: {accent: "#7a5af8", icon: <Svg><path {...s} d="M9 8l-4 4 4 4M15 8l4 4-4 4" /></Svg>},
	merge: {accent: "#5c6bc0", icon: <Svg><circle {...s} cx="6" cy="6" r="2.5" /><circle {...s} cx="6" cy="18" r="2.5" /><circle {...s} cx="18" cy="12" r="2.5" /><path {...s} d="M8.5 6.6C9 10 11 12 15.5 12M8.5 17.4C9 14 11 12 15.5 12" /></Svg>},
	gmail: {accent: "#ea4335", icon: <Svg><rect {...s} x="3" y="5" width="18" height="14" rx="2" /><path {...s} d="M4 7l8 6 8-6" /></Svg>},
	slack: {accent: "#e01e5a", icon: <Svg><path {...s} d="M9 3v9m6 0V9M3 9h9m0 6h6" /><circle {...s} cx="9" cy="15" r="2" /><circle {...s} cx="15" cy="9" r="2" /></Svg>},
	default: {accent: "#9aa0aa", icon: <Svg><circle cx="7" cy="9" r="1.6" fill="currentColor" /><circle cx="12" cy="9" r="1.6" fill="currentColor" /><circle cx="17" cy="9" r="1.6" fill="currentColor" /><circle cx="7" cy="15" r="1.6" fill="currentColor" /><circle cx="12" cy="15" r="1.6" fill="currentColor" /><circle cx="17" cy="15" r="1.6" fill="currentColor" /></Svg>},
};
const getIcon = (k?: string) => (k && ICONS[k]) || ICONS.default;

const TOOLBAR = [
	"M5.52 2.122c.322-.175.713-.16 1.021.037l14 9a1 1 0 0 1 0 1.682l-14 9A1.001 1.001 0 0 1 5 21V3a1 1 0 0 1 .52-.878",
	"M16.645 5.907a1.5 1.5 0 0 1 2.122.028 9.77 9.77 0 0 1 2.585 4.953 9.9 9.9 0 0 1-.53 5.579 9.66 9.66 0 0 1-3.476 4.357 9.36 9.36 0 0 1-5.28 1.657 9.36 9.36 0 0 1-5.292-1.623 9.66 9.66 0 0 1-3.504-4.335 9.9 9.9 0 0 1-.564-5.576 9.77 9.77 0 0 1 2.556-4.97l.11-.105a1.501 1.501 0 0 1 2.05 2.187l-.166.178a6.8 6.8 0 0 0-1.602 3.266 6.9 6.9 0 0 0 .393 3.884 6.66 6.66 0 0 0 2.413 2.989 6.36 6.36 0 0 0 3.595 1.105 6.36 6.36 0 0 0 3.59-1.128 6.66 6.66 0 0 0 2.394-3.005 6.9 6.9 0 0 0 .37-3.887 6.77 6.77 0 0 0-1.79-3.433 1.5 1.5 0 0 1 .026-2.12M12.035 1.481a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-3 0v-9a1.5 1.5 0 0 1 1.5-1.5",
	"M21 6a1 1 0 1 1 0 2h-1v12.125c0 .817-.424 1.534-.941 2.019-.522.488-1.256.856-2.059.856H7c-.803 0-1.537-.368-2.059-.856C4.424 21.659 4 20.943 4 20.125V8H3a1 1 0 0 1 0-2zm-7-5a3 3 0 0 1 3 3H7a3 3 0 0 1 3-3z",
	"M4.5 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5m7.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5m7.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5",
];

const borderFor = (st: string) =>
	st === "running" ? C.running : st === "success" ? C.success : st === "error" ? C.error : st === "selected" ? "#ff6d3d" : C.nodeBorder;

const OneNode: React.FC<{spec: NodeSpec; enterAt: number}> = ({spec, enterAt}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const state = spec.state || "idle";
	const isTrigger = !!spec.isTrigger;
	const {icon: regIcon, accent: regAccent} = getIcon(spec.kind);
	const accent = spec.accent || regAccent;
	const disabled = state === "disabled";
	const border = borderFor(state);
	const bw = state === "idle" || disabled ? 1 : 2;
	const showToolbar = !!spec.showToolbar || state === "selected";
	const showAdd = spec.showAddButton !== false;

	const enter = spring({frame: frame - enterAt, fps, config: {damping: 200, mass: 0.7}});
	const opacity = disabled ? 0.55 : interpolate(enter, [0, 1], [0, 1]);
	const popScale = interpolate(enter, [0, 1], [0.82, 1]);
	const spin = (frame * 6) % 360;
	const boltScale = 1 + 0.08 * Math.sin((frame / fps) * Math.PI * 2);

	return (
		<div style={{display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT, opacity, transform: `scale(${popScale})`}}>
			<div style={{position: "relative"}}>
				{showToolbar && (
					<div style={{position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 10, display: "flex", gap: 2, padding: 3, background: C.toolbarBg, border: `1px solid ${C.toolbarBorder}`, borderRadius: 7, color: C.toolbarIcon}}>
						{TOOLBAR.map((d, i) => (
							<div key={i} style={{width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center"}}>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d={d} /></svg>
							</div>
						))}
					</div>
				)}
				{isTrigger && (
					<div style={{position: "absolute", right: "100%", top: "50%", transform: `translateY(-50%) scale(${boltScale})`, marginRight: 14, color: C.bolt, display: "flex"}}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fillOpacity={0.95} d="M13.225 1.023a1.5 1.5 0 0 1 .866.096l.115.056.109.065a1.5 1.5 0 0 1 .506.551l.055.115.045.119a1.5 1.5 0 0 1 .023.87l-.01.039-1.92 6.02-.018.046H20a2 2 0 0 1 1.556 3.26l-.059.066-9.9 10.2a1.5 1.5 0 0 1-1.803.3 1.5 1.5 0 0 1-.738-1.721l.01-.04 1.92-6.019.017-.046H4a2.002 2.002 0 0 1-1.555-3.26l.058-.067 9.9-10.2c.22-.233.507-.392.823-.45" /></svg>
					</div>
				)}
				<div style={{position: "relative", width: SIZE, height: SIZE, background: C.node, border: `${bw}px ${disabled ? "dashed" : "solid"} ${border}`, borderRadius: isTrigger ? "32px 8px 8px 32px" : "8px", boxShadow: state === "idle" || disabled ? "none" : `0 0 0 4px ${border}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, lineHeight: 0, color: disabled ? "#7b7b82" : accent}}>
					{regIcon}
					{state === "running" && (
						<svg width={SIZE + 16} height={SIZE + 16} viewBox="0 0 112 112" style={{position: "absolute", top: -8, left: -8, transform: `rotate(${spin}deg)`}}>
							<circle cx="56" cy="56" r="53" fill="none" stroke={C.running} strokeWidth="3" strokeLinecap="round" strokeDasharray="70 300" />
						</svg>
					)}
					{(state === "success" || state === "error") && (
						<div style={{position: "absolute", top: -8, right: -8, width: 26, height: 26, borderRadius: "50%", background: state === "success" ? C.success : C.error, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center"}}>
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none">
								{state === "success" ? <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />}
							</svg>
						</div>
					)}
				</div>
				<div style={{position: "absolute", left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: -1, display: "flex", alignItems: "center"}}>
					<div style={{width: 9, height: 9, borderRadius: "50%", background: C.handleDot}} />
					{spec.outputLabel && <span style={{fontSize: 12, color: C.handleText, margin: "0 6px 0 8px"}}>{spec.outputLabel}</span>}
					{showAdd && (
						<svg viewBox="0 0 84 24" style={{width: 84, height: 24, marginLeft: spec.outputLabel ? 0 : 6}}>
							<line x1="0" y1="12" x2="60" y2="12" stroke={C.line} strokeWidth="2" />
							<g transform="translate(59,0)"><rect x="2" y="2" width="20" height="20" rx="4" fill={C.plusFill} stroke={C.plusStroke} strokeWidth="2" /><path d="M8 12h8m-4-4v8" stroke={C.plusGlyph} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></g>
						</svg>
					)}
				</div>
			</div>
			<div style={{marginTop: 10, fontSize: 15, color: C.label, textAlign: "center", whiteSpace: "nowrap"}}>{spec.label || ""}</div>
			{spec.showExecuteButton && isTrigger && (
				<div style={{display: "flex", alignItems: "center", gap: 8, marginTop: 30, padding: "10px 16px", background: C.execute, color: "#fff", borderRadius: 7, fontSize: 14, fontWeight: 500}}>
					<svg viewBox="0 0 24 24" width="16" height="16"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2M6.453 15h11.094M8.5 2h7" /></svg>
					Execute workflow
				</div>
			)}
		</div>
	);
};

const N8nNode: React.FC<{scene?: any; durF?: number}> = ({scene}) => {
	const nodes: NodeSpec[] =
		(scene && Array.isArray(scene.nodes) && scene.nodes.length && scene.nodes) ||
		(scene && scene.node && [scene.node]) ||
		[{label: "Webhook", kind: "webhook", isTrigger: true, state: "selected", outputLabel: "GET", showExecuteButton: true}];
	const heading = scene && (scene.mockup_title || scene.title);
	const multi = nodes.length > 1;

	return (
		<AbsoluteFill style={{background: (scene && scene.bg) || C.canvas, backgroundImage: `radial-gradient(${C.dot} 1.5px, transparent 1.5px)`, backgroundSize: "26px 26px", fontFamily: FONT}}>
			{heading && (
				<div style={{position: "absolute", left: 90, top: 70, color: C.heading, fontSize: 40, fontWeight: 700, letterSpacing: -0.3}}>{heading}</div>
			)}
			<AbsoluteFill style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: multi ? 90 : 0}}>
				{nodes.map((n, i) => (
					<OneNode key={i} enterAt={i * 4} spec={multi ? {showAddButton: i === nodes.length - 1, ...n} : n} />
				))}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

export default N8nNode;
