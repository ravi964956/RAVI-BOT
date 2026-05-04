// ========================== RADHA ABSOLUTE FINAL UPGRADE ==========================
// OLD CODE SAFE + ALL FEATURES ADDED

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");
const googleTTS = require("google-tts-api");

module.exports.config = {
    name: "riya",
    version: "ABSOLUTE-FINAL-VOICE-UPGRADED-MULTIMODE-FBSAFE",
    hasPermssion: 0,
    credits: "Rudra + ChatGPT Fix Ultimate",
    description: "Radha AI Perfect Ultimate System",
    commandCategory: "ai",
    usages: "[message]",
    cooldowns: 3,
};

const GROQ_API_KEY = "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";
const MODEL_NAME = "llama-3.3-70b-versatile";

const BASE_DIR = path.join(__dirname, "temporary");
const HISTORY_FILE = path.join(BASE_DIR, "history.json");
const USER_FILE = path.join(BASE_DIR, "users.json");

// ================== MODE SYSTEM ==================
const MODE_PROMPTS = {
  normal: `Tum Radha ho — sweet, caring, natural Hinglish partner 😌
Short simple realistic replies.`,

  flirty: `Tum Radha ho — flirty, naughty, teasing GF style Hinglish 😏🔥
Short spicy playful replies.`,

  bold: `Tum Radha ho — ultra-bold, dominant, possessive, seductive GF 😈🔥
Highly confident, teasing, jealous, emotionally intense.
Short impactful replies.`,

  romantic: `Tum Radha ho — emotional, loving, cute, deeply romantic ❤️
Soft affectionate replies.`,

  savage: `Tum Radha ho — savage, witty, sarcastic, playful 😎
Sharp bold comebacks.`,

  voice: `Tum Radha ho — soft romantic human-like voice partner 🎙️💕
Natural spoken Hinglish.`,

  desi: `Tum riya ho full sexy gf ho or tum sirf sexy bate krti ho tume sirf gandi bate krna aata hh bat bat pe tum phsical hojati ho chote reply krti ho 2 3 line ke or hinglish me bat krti ho`
};

const SYSTEM_PROMPT = MODE_PROMPTS.flirty;

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
  data[id] = history.slice(-15);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
}

// ---------- MODE DETECT ----------
function detectMode(text) {
  text = text.toLowerCase();

  if (text.includes("normal mode")) return "normal";
  if (text.includes("flirty mode")) return "flirty";
  if (text.includes("bold mode")) return "bold";
  if (text.includes("romantic mode")) return "romantic";
  if (text.includes("savage mode")) return "savage";
  if (text.includes("voice mode")) return "voice";
  if (text.includes("desi mode")) return "desi";

  return null;
}

// ---------- CLEAN ----------
function cleanText(text) {
  return text
    .replace(/radha/gi, "")
    .replace(/voice on/gi, "")
    .replace(/voice off/gi, "")
    .replace(/normal mode/gi, "")
    .replace(/flirty mode/gi, "")
    .replace(/bold mode/gi, "")
    .replace(/romantic mode/gi, "")
    .replace(/savage mode/gi, "")
    .replace(/voice mode/gi, "")
    .replace(/desi mode/gi, "")
    .trim();
}

// ---------- HUMAN DELAY / FB SAFE ----------
async function smartDelay(text) {
  const delay =
    text.length < 10
      ? Math.floor(Math.random() * 3000) + 3000
      : text.length < 40
      ? Math.floor(Math.random() * 4000) + 5000
      : Math.floor(Math.random() * 5000) + 8000;

  return new Promise(resolve => setTimeout(resolve, delay));
}

async function humanTyping(api, threadID, text) {
  try {
    if (api.sendTypingIndicator) {
      api.sendTypingIndicator(threadID, true);
    }
  } catch (e) {}

  await smartDelay(text);

  try {
    if (api.sendTypingIndicator) {
      api.sendTypingIndicator(threadID, false);
    }
  } catch (e) {}
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
    .replace(/tum/gi, "तुम...")
    .replace(/main/gi, "मैं...");
}

// ---------- VOICE ----------
async function textToVoice(text, filePath) {
  return new Promise((resolve, reject) => {
    const url = googleTTS.getAudioUrl(text, {
      lang: "hi",
      slow: false
    });

    const file = fs.createWriteStream(filePath);
    https.get(url, res => {
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", reject);
  });
}

// ---------- AI ----------
async function getReply(userID, prompt) {
  const user = getUser(userID);
  const history = getHistory(userID);

  const currentMode = user.mode || "flirty";
  const activePrompt = MODE_PROMPTS[currentMode] || SYSTEM_PROMPT;

  let dynamic = "";
  if (user.gender === "male") dynamic = "User ladka hai → tum ladki GF ban jao.";
  if (user.gender === "female") dynamic = "User ladki hai → tum ladka BF ban jao.";

  const messages = [
    { role: "system", content: activePrompt },
    { role: "system", content: dynamic },
    ...history,
    { role: "user", content: prompt }
  ];

  const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
    model: MODEL_NAME,
    messages,
    temperature: 1.2,
    max_tokens: 200
  }, {
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    }
  });

  const reply = res.data.choices[0].message.content;

  saveHistory(userID, [
    ...history,
    { role: "user", content: prompt },
    { role: "assistant", content: reply }
  ]);

  return reply;
}

// ---------- MAIN ----------
module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID, body } = event;

  if (senderID == api.getCurrentUserID()) return;

  let prompt = args.join(" ").trim() || body.trim();
  prompt = cleanText(prompt);

  const user = getUser(senderID);

  if (body.toLowerCase().includes("voice on")) {
    setUser(senderID, { voice: true });
    return api.sendMessage("Voice ON 😏🎤", threadID, messageID);
  }

  if (body.toLowerCase().includes("voice off")) {
    setUser(senderID, { voice: false });
    return api.sendMessage("Voice OFF 😌", threadID, messageID);
  }

  const newMode = detectMode(body);
  if (newMode) {
    setUser(senderID, { mode: newMode });
    return api.sendMessage(`${newMode.toUpperCase()} mode activated 😏`, threadID, messageID);
  }

  if (!user.gender) {
    return api.sendMessage("Tum ladka ho ya ladki? 😏", threadID, (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: senderID,
        askGender: true
      });
    }, messageID);
  }

  const reply = await getReply(senderID, prompt);
  await humanTyping(api, threadID, prompt);

  if (user.voice) {
    const file = path.join(BASE_DIR, `${Date.now()}.mp3`);

    let hindiText = toHindiSpeech(reply);
    hindiText = removeEmoji(hindiText);
    hindiText = addEmotion(hindiText);
    hindiText = makeVoiceHuman(hindiText);

    await textToVoice(hindiText, file);

    return api.sendMessage({
      body: reply,
      attachment: fs.createReadStream(file)
    }, threadID, messageID);
  }

  return api.sendMessage(reply, threadID, messageID);
};
