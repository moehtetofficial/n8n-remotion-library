/**
 * n8n node icons — extracted from
 * n8n-io/n8n@master design-system/src/components/N8nIcon/nodes/*.svg
 *
 * DO NOT hand-edit. All paths use `currentColor`, so colour is
 * controlled by the parent element's `color` style.
 */
import React from "react";

export type NodeIconName =
  | "ai-agent"
  | "code"
  | "edit-fields"
  | "execute-sub-workflow"
  | "filter"
  | "http-request"
  | "if"
  | "loop-over-items"
  | "manual-trigger"
  | "merge"
  | "respond-to-webhook"
  | "schedule-trigger"
  | "switch"
  | "wait"
  | "webhook";

const PATHS: Record<NodeIconName, React.ReactNode> = {
  "ai-agent": (
    <><path d="M3.75 10C3.75 7.10051 6.10051 4.75 9 4.75H15C17.8995 4.75 20.25 7.10051 20.25 10C20.25 12.8995 17.8995 15.25 15 15.25H9C6.10051 15.25 3.75 12.8995 3.75 10Z" stroke="currentColor" strokeWidth="1.5"/> <rect x="6.75" y="7.75" width="10.5" height="4.5" rx="2.25" stroke="currentColor" strokeWidth="1.5"/> <path d="M21.25 21V20.5C21.25 17.6005 18.8995 15.25 16 15.25H8C5.10051 15.25 2.75 17.6005 2.75 20.5V21" stroke="currentColor" strokeWidth="1.5"/> <path d="M12 1V4.75" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "code": (
    <><path d="M9 3.75H6.25C5.42157 3.75 4.75 4.42157 4.75 5.25V9.37868C4.75 9.7765 4.59197 10.158 4.31066 10.4393L2.75 12L4.31066 13.5607C4.59196 13.842 4.75 14.2235 4.75 14.6213V18.75C4.75 19.5784 5.42157 20.25 6.25 20.25H9" stroke="currentColor" strokeWidth="1.5"/> <path d="M15 3.75H17.75C18.5784 3.75 19.25 4.42157 19.25 5.25V9.37868C19.25 9.7765 19.408 10.158 19.6893 10.4393L21.25 12L19.6893 13.5607C19.408 13.842 19.25 14.2235 19.25 14.6213V18.75C19.25 19.5784 18.5784 20.25 17.75 20.25H15" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "edit-fields": (
    <><path d="M12.2676 4.34277L11.1113 5.5H5.75C5.33579 5.5 5 5.83579 5 6.25V18.25C5 18.6642 5.33579 19 5.75 19H17.75C18.1642 19 18.5 18.6642 18.5 18.25V12.8887L19.6562 11.7324H20V18.25C20 19.4926 18.9926 20.5 17.75 20.5H5.75C4.50736 20.5 3.5 19.4926 3.5 18.25V6.25C3.5 5.00736 4.50736 4 5.75 4H12.2676V4.34277Z" fill="currentColor"/> <path d="M17.1893 3.31066C17.7751 2.72487 18.7249 2.72487 19.3107 3.31066L20.6893 4.68934C21.2751 5.27513 21.2751 6.22487 20.6893 6.81066L12.6893 14.8107C12.408 15.092 12.0265 15.25 11.6287 15.25H8.75V12.3713C8.75 11.9735 8.90804 11.592 9.18934 11.3107L17.1893 3.31066Z" stroke="currentColor" strokeWidth="1.5"/> <path d="M15.75 4.75L19.25 8.25" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "execute-sub-workflow": (
    <><path d="M8 20.25L5.25 20.25C4.42157 20.25 3.75 19.5784 3.75 18.75L3.75 5.25C3.75 4.42157 4.42157 3.75 5.25 3.75L8 3.75" stroke="currentColor" strokeWidth="1.5"/> <path d="M15 17.5L20.5 12L15 6.5" stroke="currentColor" strokeWidth="1.5"/> <path d="M20.5 12L7 12" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "filter": (
    <><path d="M2 6.75H22" stroke="currentColor" strokeWidth="1.5"/> <path d="M5 12.75H19" stroke="currentColor" strokeWidth="1.5"/> <path d="M8 18.75H16" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "http-request": (
    <><circle cx="12" cy="12" r="8.75" stroke="currentColor" strokeWidth="1.5"/> <ellipse cx="12" cy="12" rx="3.75" ry="8.75" stroke="currentColor" strokeWidth="1.5"/> <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "if": (
    <><path d="M21.5 5.75H2" stroke="currentColor" strokeWidth="1.5"/> <path d="M21.5 18.25H14.4399C13.1353 18.25 11.9802 17.4069 11.5826 16.1643L8.91742 7.83568C8.5198 6.59314 7.36475 5.75 6.06014 5.75H2" stroke="currentColor" strokeWidth="1.5"/> <path d="M18.5 2.75L21.5 5.75L18.5 8.75" stroke="currentColor" strokeWidth="1.5"/> <path d="M18.5 15.25L21.5 18.25L18.5 21.25" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "loop-over-items": (
    <><path d="M10.5 10.25L14 6.75L10.5 3.25" stroke="currentColor" strokeWidth="1.5"/> <path d="M14 6.75H8C5.10051 6.75 2.75 9.10051 2.75 12C2.75 14.8995 5.10051 17.25 8 17.25H16C18.8995 17.25 21.25 14.8995 21.25 12C21.25 9.44246 19.4212 7.31205 17 6.84512" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "manual-trigger": (
    <><path d="M20.5204 14.248L21.0507 14.7783L21.9223 13.9067L20.7476 13.5332L20.5204 14.248ZM18.3466 16.4218L17.8162 15.8914L17.2859 16.4218L17.8162 16.9521L18.3466 16.4218ZM21.021 19.0962L21.5513 19.6265L22.0817 19.0962L21.5513 18.5659L21.021 19.0962ZM19.0965 21.0207L18.5662 21.551L19.0965 22.0814L19.6268 21.551L19.0965 21.0207ZM16.422 18.3463L16.9524 17.8159L16.422 17.2856L15.8917 17.8159L16.422 18.3463ZM14.2476 20.5208L13.5328 20.748L13.9063 21.9227L14.7779 21.0511L14.2476 20.5208ZM11.3231 11.3235L11.5504 10.6088L10.1692 10.1696L10.6084 11.5508L11.3231 11.3235ZM20.5204 14.248L19.99 13.7176L17.8162 15.8914L18.3466 16.4218L18.8769 16.9521L21.0507 14.7783L20.5204 14.248ZM18.3466 16.4218L17.8162 16.9521L20.4907 19.6265L21.021 19.0962L21.5513 18.5659L18.8769 15.8914L18.3466 16.4218ZM21.021 19.0962L20.4907 18.5659L18.5662 20.4904L19.0965 21.0207L19.6268 21.551L21.5513 19.6265L21.021 19.0962ZM19.0965 21.0207L19.6268 20.4904L16.9524 17.8159L16.422 18.3463L15.8917 18.8766L18.5662 21.551L19.0965 21.0207ZM16.422 18.3463L15.8917 17.8159L13.7172 19.9904L14.2476 20.5208L14.7779 21.0511L16.9524 18.8766L16.422 18.3463ZM14.2476 20.5208L14.9623 20.2935L12.0379 11.0963L11.3231 11.3235L10.6084 11.5508L13.5328 20.748L14.2476 20.5208ZM11.3231 11.3235L11.0959 12.0383L20.2931 14.9627L20.5204 14.248L20.7476 13.5332L11.5504 10.6088L11.3231 11.3235Z" fill="currentColor"/> <path d="M7.6249 19.5793C5.00958 18.0664 3.25 15.2387 3.25 12C3.25 7.16751 7.16751 3.25 12 3.25C15.2231 3.25 18.0391 4.99263 19.5574 7.5871" stroke="currentColor" strokeWidth="1.5"/> <path d="M9.62446 16.1142C8.20498 15.2928 7.25 13.7579 7.25 12C7.25 9.37665 9.37665 7.25 12 7.25C13.7524 7.25 15.2832 8.19898 16.1064 9.61107" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "merge": (
    <><path d="M2 5.75H21.5" stroke="currentColor" strokeWidth="1.5"/> <path d="M2 18.25H6.06014C7.36475 18.25 8.5198 17.4069 8.91742 16.1643L11.5826 7.83568C11.9802 6.59314 13.1352 5.75 14.4399 5.75H21.5" stroke="currentColor" strokeWidth="1.5"/> <path d="M18.5 2.75L21.5 5.75L18.5 8.75" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "respond-to-webhook": (
    <><circle cx="12" cy="7" r="1.5" fill="currentColor"/> <circle cx="6.5" cy="16.5" r="1.5" fill="currentColor"/> <circle cx="17.5" cy="16.5" r="1.5" fill="currentColor"/> <path d="M15.2476 8.875C15.5892 8.28336 15.7512 7.63732 15.7506 6.99998C15.7494 5.70521 15.077 4.44635 13.875 3.75241C12.0814 2.71687 9.78794 3.3314 8.75241 5.125C7.71687 6.9186 8.3314 9.21206 10.125 10.2476L6.5 16.5" stroke="currentColor" strokeWidth="1.5"/> <path d="M6.5 12.75C4.42893 12.75 2.75 14.4289 2.75 16.5C2.75 18.5711 4.42893 20.25 6.5 20.25C8.57107 20.25 10.25 18.5711 10.25 16.5H17.5" stroke="currentColor" strokeWidth="1.5"/> <path d="M14.2524 18.375C15.2879 20.1686 17.5814 20.7831 19.375 19.7476C21.1686 18.7121 21.7831 16.4186 20.7476 14.625C19.7121 12.8314 17.4186 12.2169 15.625 13.2524L12 7" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "schedule-trigger": (
    <><circle cx="12" cy="12" r="8.75" stroke="currentColor" strokeWidth="1.5"/> <path d="M12 6V12L8.5 14" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "switch": (
    <><path d="M21.5 5.25H2" stroke="currentColor" strokeWidth="1.5"/> <path d="M21.5 18.75H14.49C13.1614 18.75 11.9911 17.8761 11.6136 16.6023L8.88637 7.39773C8.50893 6.12387 7.33857 5.25 6.00997 5.25H2" stroke="currentColor" strokeWidth="1.5"/> <path d="M21.5 12H12.49C11.1614 12 9.99107 11.1261 9.61363 9.85227L8.88637 7.39773C8.50893 6.12387 7.33857 5.25 6.00997 5.25H2" stroke="currentColor" strokeWidth="1.5"/> <path d="M19 9.5L21.5 12L19 14.5" stroke="currentColor" strokeWidth="1.5"/> <path d="M19 2.75L21.5 5.25L19 7.75" stroke="currentColor" strokeWidth="1.5"/> <path d="M19 16.25L21.5 18.75L19 21.25" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "wait": (
    <><path d="M18.25 20.25H5.75V17.6213C5.75 17.2235 5.90803 16.842 6.18934 16.5607L9.89645 12.8536C10.1228 12.6272 10.25 12.3201 10.25 12C10.25 11.6799 10.1228 11.3728 9.89645 11.1464L6.18934 7.43934C5.90803 7.15803 5.75 6.7765 5.75 6.37868V3.75H18.25V6.37868C18.25 6.7765 18.092 7.15804 17.8107 7.43934L14.1036 11.1464C13.8772 11.3728 13.75 11.6799 13.75 12C13.75 12.3201 13.8772 12.6272 14.1036 12.8536L17.8107 16.5607C18.092 16.842 18.25 17.2235 18.25 17.6213V20.25Z" stroke="currentColor" strokeWidth="1.5"/></>
  ),
  "webhook": (
    <><circle cx="12" cy="7" r="1.5" fill="currentColor"/> <circle cx="6.5" cy="16.5" r="1.5" fill="currentColor"/> <circle cx="17.5" cy="16.5" r="1.5" fill="currentColor"/> <path d="M15.2476 8.875C15.5892 8.28336 15.7512 7.63732 15.7506 6.99998C15.7494 5.70521 15.077 4.44635 13.875 3.75241C12.0814 2.71687 9.78794 3.3314 8.75241 5.125C7.71687 6.9186 8.3314 9.21206 10.125 10.2476L6.5 16.5" stroke="currentColor" strokeWidth="1.5"/> <path d="M6.5 12.75C4.42893 12.75 2.75 14.4289 2.75 16.5C2.75 18.5711 4.42893 20.25 6.5 20.25C8.57107 20.25 10.25 18.5711 10.25 16.5H17.5" stroke="currentColor" strokeWidth="1.5"/> <path d="M14.2524 18.375C15.2879 20.1686 17.5814 20.7831 19.375 19.7476C21.1686 18.7121 21.7831 16.4186 20.7476 14.625C19.7121 12.8314 17.4186 12.2169 15.625 13.2524L12 7" stroke="currentColor" strokeWidth="1.5"/></>
  ),
};

/** Map an n8n node `type` string to an icon name. */
export const TYPE_TO_ICON: Record<string, NodeIconName> = {
  "n8n-nodes-base.webhook": "webhook",
  "n8n-nodes-base.respondToWebhook": "respond-to-webhook",
  "n8n-nodes-base.httpRequest": "http-request",
  "n8n-nodes-base.code": "code",
  "n8n-nodes-base.if": "if",
  "n8n-nodes-base.switch": "switch",
  "n8n-nodes-base.set": "edit-fields",
  "n8n-nodes-base.merge": "merge",
  "n8n-nodes-base.scheduleTrigger": "schedule-trigger",
  "n8n-nodes-base.manualTrigger": "manual-trigger",
  "n8n-nodes-base.splitInBatches": "loop-over-items",
  "n8n-nodes-base.wait": "wait",
  "n8n-nodes-base.filter": "filter",
  "n8n-nodes-base.executeWorkflow": "execute-sub-workflow",
  "@n8n/n8n-nodes-langchain.agent": "ai-agent",
};

/** Node types that render with the trigger (rounded-left) shape. */
export const TRIGGER_TYPES = new Set([
  "n8n-nodes-base.webhook",
  "n8n-nodes-base.scheduleTrigger",
  "n8n-nodes-base.manualTrigger",
  "n8n-nodes-base.errorTrigger",
  "n8n-nodes-base.formTrigger",
  "@n8n/n8n-nodes-langchain.chatTrigger",
]);

export const NodeIcon: React.FC<{
  name: NodeIconName;
  size?: number;
  color?: string;
}> = ({ name, size = 36, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ color }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {PATHS[name]}
  </svg>
);

/** Resolve an icon straight from a node type, with a safe fallback. */
export function iconForType(type: string): NodeIconName {
  return TYPE_TO_ICON[type] ?? "code";
}
