/**
 * Shared store link for all pages — same as playable_7_art_2 / playable_08 / playable_09.
 * AppsFlyer Smart Script: src/core/appfly_script.js (sync from main repo playables).
 */
import afSmartScriptSource from "@playable/af/appfly_script.js?raw";
import {
  ensureMraidReadyHooks,
  openUrlWithMraid,
  whenMraidReady,
} from "@playable/core/mraid-open.js";

const FALLBACK_URL =
  "https://chatsmith.onelink.me/t7vO?af_js_web=true&af_ss_ver=2_10_0&pid=metaweb_int&c=%7B%7Bcampaign.name%7D%7D&af_ad=%7B%7Bad.name%7D%7D&af_adset=%7B%7Badset.name%7D%7D&af_sub1=%7B%7Bfbc%7D%7D&af_c_id=%7B%7Bcampaign.id%7D%7D&af_adset_id=%7B%7Badset.id%7D%7D&af_ad_id=%7B%7Bad.id%7D%7D&af_ss_ui=true&fbclid=%7B%7Bfbc%7D%7D";

let oneLinkUrl = FALLBACK_URL;
let storeInitDone = false;

function injectSmartScript() {
  try {
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.text = `${afSmartScriptSource}\n;`;
    document.head.appendChild(s);
  } catch (e) {
    console.error("[AF_SMART_SCRIPT] inject error", e);
  }
}

function pollSmartScriptUrl() {
  const clickURL = window.AF_SMART_SCRIPT_RESULT?.clickURL;
  if (typeof clickURL === "string" && clickURL.trim()) {
    oneLinkUrl = clickURL.trim();
    return true;
  }
  return false;
}

/** AppsFlyer OneLink + MRAID — wait for ready before open */
export function initStoreLink() {
  if (storeInitDone) return;
  storeInitDone = true;
  ensureMraidReadyHooks();
  whenMraidReady(() => {});
  injectSmartScript();
  if (pollSmartScriptUrl()) return;
  const interval = setInterval(() => {
    if (pollSmartScriptUrl()) {
      clearInterval(interval);
      clearTimeout(timeout);
    }
  }, 200);
  const timeout = setTimeout(() => clearInterval(interval), 5000);
}

export function resolveStoreClickUrl() {
  const smart = window.AF_SMART_SCRIPT_RESULT?.clickURL;
  if (typeof smart === "string" && smart.trim()) return smart.trim();
  if (typeof window.ONELINK_URL === "string" && window.ONELINK_URL.trim()) {
    return window.ONELINK_URL.trim();
  }
  return oneLinkUrl || FALLBACK_URL;
}

export function openStoreClickUrl(url) {
  openUrlWithMraid(url);
}

export function openAppStore() {
  openStoreClickUrl(resolveStoreClickUrl());
}
