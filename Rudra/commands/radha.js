const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");
const googleTTS = require("google-tts-api");

module.exports.config = {
    name: "radha",
    version: "ABSOLUTE-FINAL-VOICE-UPGRADED",
    hasPermssion: 0,
    credits: "Rudra + ChatGPT Fix",
    description: "Radha AI Perfect System",
    commandCategory: "ai",
    usages: "[message]",
    cooldowns: 3,
};

const GROQ_API_KEY = "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";
const MODEL_NAME = "llama-3.3-70b-versatile";

const BASE_DIR = path.join(__dirname, "temporary");
const HISTORY_FILE = path.join(BASE_DIR, "history.json");
const USER_FILE = path.join(BASE_DIR, "users.json");

const SYSTEM_PROMPT = `Tum Radha ho — flirty, naughty, teasing GF style Hinglish 😏🔥
Short reply dena.`;

// ---------- SETUP ----------
function ensureFiles() {
  if (!fs.existsSync(BASE_DIR)) fs.mkdirSync(BASE_DIR, { recursive: true });
  if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, "{}");
  if (!fs.existsSync(USER_FILE)) fs.writeFileSync(USER_FILE, "{}");
}

// ---------- USER ----------
function getUser(id) {
  ensureFiles();
  return JSON.parse(fs.readFileSync(USER_FILE))[id] || {};
}

function setUser(id, update) {
  ensureFiles();
  const data = JSON.parse(fs.readFileSync(USER_FILE));
  data[id] = { ...(data[id] || {}), ...update };
  fs.writeFileSync(USER_FILE, JSON.stringify(data, null, 2));
}

// ---------- HISTORY ----------
function getHistory(id) {
  ensureFiles();
  return JSON.parse(fs.readFileSync(HISTORY_FILE))[id] || [];
}

function saveHistory(id, history) {
  const data = JSON.parse(fs.readFileSync(HISTORY_FILE));
  data[id] = history.slice(-10);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
}

// ---------- CLEAN ----------
function cleanText(text) {
  return text
    .replace(/radha/gi, "")
    .replace(/voice on/gi, "")
    .replace(/voice off/gi, "")
    .trim();
}

// ---------- REMOVE EMOJI ----------
function removeEmoji(text) {
  return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
}

// ---------- HINDI ----------
function toHindiSpeech(text) {
  return text
    .replace(/main/g, "मैं")
    .replace(/mai/g, "मैं")
    .replace(/tum/g, "तुम")
    .replace(/kya/g, "क्या")
    .replace(/kr/g, "कर")
    .replace(/raha/g, "रहा")
    .replace(/rahi/g, "रही")
    .replace(/ho/g, "हो")
    .replace(/hu/g, "हूँ")
    .replace(/hai/g, "है");
}

// ---------- VOICE IMPROVE ----------
function makeVoiceHuman(text) {
  return text
    .replace(/\./g, " . ")
    .replace(/,/g, " , ")
    .replace(/\?/g, " ? ")
    .replace(/\!/g, " ! ")
    .replace(/\s+/g, " ")
    .trim();
}

function addEmotion(text) {
  return text
    .replace(/acha/gi, "अच्छा...")
    .replace(/haan/gi, "हाँ...")
    .replace(/kya/gi, "क्या...")
