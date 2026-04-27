// ========================== RADHA ABSOLUTE FINAL UPGRADE ==========================
// OLD CODE SAFE + ALL FEATURES ADDED
// Added:
// - Normal Mode
// - Flirty Mode
// - Bold Mode
// - Romantic Mode
// - Savage Mode
// - Voice Mode
// - Mode Memory
// - Zero old feature removed

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");
const googleTTS = require("google-tts-api");

module.exports.config = {
    name: "radha",
    version: "ABSOLUTE-FINAL-VOICE-UPGRADED-MULTIMODE",
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
Natural spoken Hinglish.`
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

  // ---------- VOICE ----------
  if (body.toLowerCase().includes("voice on")) {
    setUser(senderID, { voice: true });
    return api.sendMessage("Voice ON 😏🎤", threadID, messageID);
  }

  if (body.toLowerCase().includes("voice off")) {
    setUser(senderID, { voice: false });
    return api.sendMessage("Voice OFF 😌", threadID, messageID);
  }

  // ---------- MODE ----------
  const newMode = detectMode(body);
  if (newMode) {
    setUser(senderID, { mode: newMode });
    return api.sendMessage(`${newMode.toUpperCase()} mode activated 😏`, threadID, messageID);
  }

  // ---------- GENDER ----------
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

  // ---------- VOICE SEND ----------
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
    }, threadID, (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: senderID
      });
    }, messageID);
  }

  // ---------- TEXT SEND ----------
  return api.sendMessage(reply, threadID, (err, info) => {
    global.client.handleReply.push({
      name: module.exports.config.name,
      messageID: info.messageID,
      author: senderID
    });
  }, messageID);
};

// ---------- HANDLE ----------
module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, senderID, body } = event;

  if (senderID == api.getCurrentUserID()) return;
  if (senderID !== handleReply.author) return;

  // ---------- GENDER ----------
  if (handleReply.askGender) {
    const text = body.toLowerCase();

    if (text.includes("ladka")) setUser(senderID, { gender: "male" });
    else if (text.includes("ladki")) setUser(senderID, { gender: "female" });
    else return api.sendMessage("Seedha bol — ladka ya ladki 😒", threadID, messageID);

    return api.sendMessage("Samajh gayi 😏 ab baat kar", threadID, (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: senderID
      });
    }, messageID);
  }

  // ---------- MODE ----------
  const newMode = detectMode(body);
  if (newMode) {
    setUser(senderID, { mode: newMode });
    return api.sendMessage(`${newMode.toUpperCase()} mode activated 😈`, threadID, messageID);
  }

  const user = getUser(senderID);
  let clean = cleanText(body);

  const reply = await getReply(senderID, clean);

  // ---------- VOICE ----------
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
    }, threadID, (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: senderID
      });
    }, messageID);
  }

  // ---------- TEXT ----------
  return api.sendMessage(reply, threadID, (err, info) => {
    global.client.handleReply.push({
      name: module.exports.config.name,
      messageID: info.messageID,
      author: senderID
    });
  }, messageID);
};
