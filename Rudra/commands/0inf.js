module.exports.config = {
  name: "inf",
  version: "1.0.9", 
  hasPermssion: 0,
  credits: "RK-PRAJAPAT",
  description: "Bot Info with 100% Working Messenger Profile Share Card",
  usePrefix: true,
  commandCategory: "INFORMATION",
  cooldowns: 1,
  dependencies: {
    "moment-timezone": ""
  }
};

module.exports.run = async function({ api, event, messageID }) {
    const { threadID } = event;
    const moment = require("moment-timezone");

    // 1. AAPKI FACEBOOK ID (Jiska contact card banna hai)
    const ownerID = "61573328623221"; 
    const ownerName = "RK-PRAJAPAT";

    // 2. BOT TIME & RUNNING TIME LOGIC
    const uptimeProcess = process.uptime();
    const hours = Math.floor(uptimeProcess / 3600);
    const minutes = Math.floor((uptimeProcess % 3600) / 60);
    const seconds = Math.floor(uptimeProcess % 60);
    const juswa = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || hh:mm:ss A");

    // 3. TEXT INFO LAYOUT
    let msgBody = `◁➽▷𝐁𝐎𝐓 💖 𝐈𝐍𝐅𝐎 ◁➽▷\n\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `         😻 🇮🇳🇫🇴🇷🇲🇦🇹🇮🇴🇳 😻\n` +
                  `         ✧═════════•❁❀❁•═════════✧\n\n` +
                  `𝗕𝗢𝗧 𝗡𝗔𝗠𝗘   →  🦋😻 [ ${global.config.BOTNAME || "RAVI BOT"} ]😻💞\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `😍👀 𝗢𝘄𝗻𝗲𝗿 :- ${ownerName} 🌸🍒\n` +
                  `✧═════════•❁❀❁•═════════✧\n\n` +
                  `*╔══❖•ೋ° °ೋ•❖══╗\n` +
                  `*💋*★᭄𝗖𝗿𝗲𝗱𝗶𝘁ｓ :- ℝ𝕂-ℙℝ𝔸𝕁𝔸ℙ𝔸𝕋\n` +
                  `*╚══❖•ೋ° °ೋ•❖══╝*\n\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `😻𝗕𝗢𝗧 𝗣𝗥𝗘𝗙𝗜𝗫   → 🍒🦋   [ ${global.config.PREFIX || "."} ]🌸🔙\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `🦋🍒 𝗗𝗔𝗧Ｅ & 𝗧𝗜𝗠𝗘   → [ ${juswa} ]\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `💞🌸 𝗕𝗢𝗧 𝗥𝗨𝗡𝗡Ｉ𝗡𝗚 𝗧𝗜𝗠𝗘 🌞🌸\n` +
                  `   [ ${hours}h : ${minutes}m : ${seconds}s ]\n` +
                  `✧═════════•❁❀❁•═════════✧`;

    try {
        // STEP 1: Pehle Text Information Message group me send hoga
        return api.sendMessage(msgBody, threadID, async (err, info) => {
            if (err) return console.log("Text Send Error:", err);

            // STEP 2: Text send hote hi, 1 second ka delay dekar user profile card trigger hoga
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Facebook Ka Real Profile-Share Function Object
            const cardObject = {
                attachment: {
                    type: "share",
                    payload: {
                        template_type: "user",
                        id: ownerID
                    }
                }
            };

            // Agar module advance h toh direct share function chalega, nahi toh fallback use hoga
            if (typeof api.shareMessage === "function") {
                return api.shareMessage(cardObject, threadID);
            } else {
                // Alternating alternative payload targeting official Facebook Graph UI
                return api.sendMessage({
                    body: "",
                    attachment: [],
                    metaShareAPI: true,
                    share_contents: {
                        type: "user",
                        id: ownerID
                    }
                }, threadID);
            }
        }, messageID);

    } catch (e) {
        console.log("Error in inf contact card:", e.message);
    }
};
