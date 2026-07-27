// Icônes SVG inline (traits fins, cohérentes avec le design "canvas BI")
const ICONS = {
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19V9M11 19V4M18 19v-7"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke-linejoin="round"/></svg>',
  brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3M9 4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3M15 4a3 3 0 0 0-3 3"/></svg>',
  network: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="5" cy="6" r="2.4"/><circle cx="19" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M6.9 7.6 10 15M17.1 7.6 14 15M7.4 6h9.2"/></svg>',
  window: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 9h17"/><circle cx="6.3" cy="6.7" r="0.6" fill="currentColor" stroke="none"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 9 6 6 6-6"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.29 9.29 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.79-4.58 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3.5 8.75h3.9V20H3.5V8.75Zm6.6 0h3.74v1.54h.05c.52-.98 1.8-2.02 3.7-2.02 3.96 0 4.7 2.6 4.7 5.99V20h-3.9v-5.13c0-1.22-.02-2.8-1.7-2.8-1.7 0-1.96 1.33-1.96 2.7V20h-3.9V8.75Z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v13m0 0-4.5-4.5M12 16l4.5-4.5M4 20h16"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>',
  unlock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V7a4 4 0 0 1 7-2.6"/></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17 17 7M9 7h8v8"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
};
