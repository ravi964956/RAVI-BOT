module.exports.config = {
  name: "inf",
  version: "1.0.5", 
  hasPermssion: 0,
  credits: "RK-PRAJAPAT",
  description: "Bot Info with Direct Clickable Facebook Profile Option",
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

    // 1. AAPKI FB PROFILE DETAILS
    const ownerID = "61573328623221"; 
    const ownerName = "RK-PRAJAPAT";
    const profileLink = `https://www.facebook.com/profile.php?id=${ownerID}`;

    // 2. BOT RUNNING TIME & DATE LOGIC
    const uptimeProcess = process.uptime();
    const hours = Math.floor(uptimeProcess / 3600);
    const minutes = Math.floor((uptimeProcess % 3600) / 60);
    const seconds = Math.floor(uptimeProcess % 60);
    const juswa = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || hh:mm:ss A");

    // 3. SHANDAAR TEXT LAYOUT
    let msgBody = `◁➽▷𝐁𝐎𝐓 💖 𝐈𝐍𝐅𝐎 ◁➽▷\n\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `         😻 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡 😻\n` +
                  `         ✧═════════•❁❀❁•═════════✧\n\n` +
                  `𝗕𝗢𝗧 𝗡𝗔𝗠block   →  🦋😻 [ ${global.config.BOTNAME || "RAVI BOT"} ]😻💞\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `😍👀 𝗢𝘄𝗻𝗲𝗿 :- ${ownerName} 🌸🍒\n` +
                  `✧═════════•❁❀❁•═════════✧\n\n` +
                  `*╔══❖•ೋ° °ೋ•❖══╗\n` +
                  `*💋*★᭄𝗖𝗿𝗲δ𝗶𝘁𝘀 :- ℝ𝕂-ℙℝ𝔸𝕁𝔸ℙ𝔸𝕋\n` +
                  `*╚══❖•ೋ° °ೋ•❖══╝*\n\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `😻𝗕𝗢𝗧 𝗣𝗥𝗘𝗙𝗜𝗫   → 🍒🦋   [ ${global.config.PREFIX || "."} ]🌸🔙\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `🦋🍒 𝗗𝗔𝗧𝗘 & 𝗧𝗜𝗠𝗘   → [ ${juswa} ]\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `💞🌸 𝗕𝗢𝗧 𝗥𝗨𝗡𝗡𝗜Ｎ𝗚 𝗧𝗜𝗠𝗘 🌞🌸\n` +
                  `   [ ${hours}h : ${minutes}m : ${seconds}s ]\n` +
                  `✧═════════•❁❀❁•═════════✧\n` +
                  `👇🏻 TOUCH OR CLICK BELOW TO VISIT PROFILE 👇🏻\n` +
                  `🔗 ${profileLink}\n` +
                  `✧═════════•❁❀❁•═════════✧`;

    try {
        // 4. SMART MESSAGE OBJECT (Text + Clickable Link Preview)
        // Is tarike se bina canvas error ke user link par touch karke direct profile par ja sakta hai
        return api.sendMessage({
            body: msgBody,
            mentions: [{
                tag: ownerName,
                id: ownerID
            }]
        }, threadID, (err, info) => {
            if (err) console.log("Info Command Error:", err);
        });

    } catch (e) {
        console.log("Error in inf command:", e.message);
    }
};
