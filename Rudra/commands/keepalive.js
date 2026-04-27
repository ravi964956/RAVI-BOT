/**
 * AUTO KEEPALIVE COMMAND
 * Render Anti-Sleep System
 * FULL AUTO MODE
 * No manual action needed
 * URL: https://rudra-new.onrender.com
 *
 * Just paste in keepalive.js
 */

const axios = require("axios");

// ---------- YOUR RENDER URL ----------
const targetUrl = "https://rudra-new.onrender.com";

// ---------- GLOBAL SYSTEM ----------
if (!global.keepAliveSystem) {
  global.keepAliveSystem = {
    enabled: true,
    interval: null,
    startedAt: Date.now(),
    pingCount: 0
  };
}

// ---------- AUTO START ON BOT LAUNCH ----------
if (!global.keepAliveSystem.interval) {
  global.keepAliveSystem.interval = setInterval(async () => {
    try {
      await axios.get(targetUrl);

      global.keepAliveSystem.pingCount++;

      console.log(
        `🔄 Auto KeepAlive Ping #${global.keepAliveSystem.pingCount} successful`
      );
    } catch (err) {
      console.log("❌ Auto KeepAlive failed:", err.message);
    }
  }, 180000); // Every 3 minutes

  console.log("🚀 Auto KeepAlive System Activated (3 min interval)");
}

module.exports = {
  config: {
    name: "keepalive",
    aliases: ["ka", "selfping", "antislp"],
    description: "Automatic anti-sleep self-ping system",
    usages: "{prefix}keepalive [status/on/off]",
    credit: "Rudra + ChatGPT",
    category: "GENERAL",
    hasPrefix: true,
    permission: "PUBLIC",
    cooldowns: 5
  },

  run: async function ({ api, message, args }) {
    const { threadID, messageID } = message;

    const action = (args[0] || "").toLowerCase();

    // ---------- ON ----------
    if (action === "on") {

      if (global.keepAliveSystem.enabled) {
        return api.sendMessage(
          `⚡ KeepAlive already ON\n🌐 URL: ${targetUrl}\n⏱️ Interval: 3 minutes`,
          threadID,
          messageID
        );
      }

      global.keepAliveSystem.enabled = true;
      global.keepAliveSystem.startedAt = Date.now();

      global.keepAliveSystem.interval = setInterval(async () => {
        try {
          await axios.get(targetUrl);

          global.keepAliveSystem.pingCount++;

          console.log(
            `🔄 KeepAlive Ping #${global.keepAliveSystem.pingCount} successful`
          );
        } catch (err) {
          console.log("❌ KeepAlive Ping failed:", err.message);
        }
      }, 180000); // Every 3 minutes

      return api.sendMessage(
        `🟢 KeepAlive ENABLED\n\n` +
          `🌐 URL: ${targetUrl}\n` +
          `⏱️ Ping Interval: Every 3 minutes\n` +
          `🚀 Anti-sleep protection active`,
        threadID,
        messageID
      );
    }

    // ---------- OFF ----------
    if (action === "off") {

      if (!global.keepAliveSystem.enabled) {
        return api.sendMessage(
          "⚠️ KeepAlive already OFF",
          threadID,
          messageID
        );
      }

      clearInterval(global.keepAliveSystem.interval);

      global.keepAliveSystem.enabled = false;
      global.keepAliveSystem.interval = null;

      return api.sendMessage(
        `🔴 KeepAlive DISABLED\n⏹️ Self-ping stopped.`,
        threadID,
        messageID
      );
    }

    // ---------- STATUS ----------
    let uptime = "0s";

    if (global.keepAliveSystem.startedAt) {
      const ms = Date.now() - global.keepAliveSystem.startedAt;

      const seconds = Math.floor((ms / 1000) % 60);
      const minutes = Math.floor((ms / (1000 * 60)) % 60);
      const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));

      uptime = "";
      if (days > 0) uptime += `${days}d `;
      if (hours > 0) uptime += `${hours}h `;
      if (minutes > 0) uptime += `${minutes}m `;
      uptime += `${seconds}s`;
    }

    return api.sendMessage(
      `🚀 AUTO KEEPALIVE STATUS 🚀\n\n` +
        `🟢 Enabled: ${global.keepAliveSystem.enabled ? "Yes" : "No"}\n` +
        `🌐 URL: ${targetUrl}\n` +
        `🔄 Total Pings: ${global.keepAliveSystem.pingCount}\n` +
        `⏱️ Active Time: ${uptime}\n` +
        `📌 Interval: 3 minutes\n\n` +
        `✅ Auto-start active on every restart`,
      threadID,
      messageID
    );
  }
};
