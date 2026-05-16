module.exports.config = {
  name: "inf",
  version: "1.0.8", 
  hasPermssion: 0,
  credits: "RK-PRAJAPAT",
  description: "Bot Info with Messenger Official Profile Share Card (Profile + Message buttons)",
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

    // 1. AAPKI FACEBOOK ACCOUNT ID
    const ownerID = "61573328623221"; 
    const ownerName = "RK-PRAJAPAT";

    // 2. BOT RUNNING TIME & DATE LOGIC
    const uptimeProcess = process.uptime();
    const hours = Math.floor(uptimeProcess / 3600);
    const minutes = Math.floor((uptimeProcess % 3600) / 60);
    const seconds = Math.floor(uptimeProcess % 60);
    const juswa = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || hh:mm:ss A");

    // 3. TEXT DETAILS LAYOUT
    let msgBody = `◁➽▷𝐁𝐎𝐓 💖 𝐈𝐍𝐅𝐎 ◁➽▷\n\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `         😻 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡 😻\n` +
                  `         ✧═════════•❁❀❁•═════════✧\n\n` +
                  `𝗕𝗢𝗧 𝗡𝗔𝗠𝗘   →  🦋😻 [ ${global.config.BOTNAME || "RAVI BOT"} ]😻💞\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `😍👀 𝗢𝘄𝗻𝗲𝗿 :- ${ownerName} 🌸🍒\n` +
                  `✧═════════•❁❀❁•═════════✧\n\n` +
                  `*╔══❖•ೋ° °ೋ•❖══╗\n` +
                  `*💋*★᭄𝗖𝗿𝗲𝗱𝗶𝘁𝘀 :- ℝ𝕂-ℙℝ𝔸𝕁𝔸ℙ𝔸𝕋\n` +
                  `*╚══❖•ೋ° °ೋ•❖══╝*\n\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `😻𝗕𝗢𝗧 𝗣𝗥𝗘𝗙\x49𝗫   → 🍒🦋   [ ${global.config.PREFIX || "."} ]🌸🔙\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `🦋🍒 𝗗𝗔𝗧Ｅ & 𝗧Ｉ𝗠𝗘   → [ ${juswa} ]\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `💞🌸 𝗕𝗢𝗧 𝗥𝗨𝗡𝗡𝗜𝗡𝗚 𝗧𝗜𝗠𝗘 🌞🌸\n` +
                  `   [ ${hours}h : ${minutes}m : ${seconds}s ]\n` +
                  `✧═════════•❁❀❁•═════════✧`;

    try {
        // 4. STEP 1: PEHLE DETAILS WALA TEXT MESSAGE BHEJEGA
        return api.sendMessage(msgBody, threadID, (err, info) => {
            if (err) return console.log("Text Send Error:", err);

            // 5. STEP 2: JAISE HI TEXT JAYEGA, USKE TURANT BAAD METASHARE WALA ACCOUNT CARD TRIGGER HOGA
            api.sendMessage({
                body: "", 
                attachment: [],
                // Messenger Share Content Payload (Direct Account Object)
                share_contents: {
                    type: "user",
                    id: ownerID
                }
            }, threadID);
        }, messageID);

    } catch (e) {
        console.log("Error in inf share card command:", e.message);
    }
};
