module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.3",
    credits: "RK-PRAJAPAT",
    description: "Bot naye group mein add hone par customized notification photo/video, Kolkata time aur Uptime bhejega",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "moment-timezone": ""
    }
};

module.exports.run = async function({ api, event }) {
    const { threadID, logMessageData } = event;
    const fs = require("fs-extra");
    const path = require("path");
    const moment = require("moment-timezone");

    // Check karna ki kya add hone wala participant bot khud hai
    if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        
        try {
            // Bot ka nickname auto change karega prefix ke sath
            const prefix = global.config.PREFIX || ".";
            const botName = global.config.BOTNAME || "RAVI BOT";
            api.changeNickname(`[ ${prefix} ] • ${botName}`, threadID, api.getCurrentUserID());

            // 1. KOLKATA TIME, DATE AUR DAY LOGIC
            const kolkataTime = moment.tz("Asia/Kolkata");
            const date = kolkataTime.format("DD/MM/YYYY");
            const time = kolkataTime.format("hh:mm:ss A");
            const day = kolkataTime.format("dddd");

            // 2. BOT UPTIME LOGIC
            const uptimeProcess = process.uptime();
            const days = Math.floor(uptimeProcess / (3600 * 24));
            const hours = Math.floor((uptimeProcess % (3600 * 24)) / 3600);
            const minutes = Math.floor((uptimeProcess % 3600) / 60);
            const seconds = Math.floor(uptimeProcess % 60);
            const uptimeString = `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;

            // --- वीडियो/फोटो पाथ सेटिंग्स ---
            const videoPath = path.join(__dirname, "cache", "join.jpg");

            // Shandaar Welcome Message
            let msg = `🍒💙•••Ɓ❍ʈ Ƈøɳɳɛƈʈɛɗ•••💞🌿\n\n` +
                      `🕊️🌸...Ɦɛɭɭ❍ Ɠɣus Ɱɣ Ɲɑɱɛ Is 🍒💙•••✦${botName}✦•••💞🌿\n\n` +
                      `✨💞 Ɱɣ Ꭾɽɛfɪᵡ ɪs [ ${prefix} ]\n\n` +
                      `Ƭɣƥɛ ${prefix}help Ƭ❍ sɛɛ Ɱɣ Ƈøɱɱɑɳɗ ɭɪsʈ...🤍💫\n\n` +
                      `📅 Date: ${date}\n` +
                      `⏰ Time: ${time}\n` +
                      `🌟 Day: ${day}\n` +
                      `⏳ Uptime: ${uptimeString}\n\n` +
                      `Ɛxɑɱƥɭɛ :\n` +
                      `${prefix}shairi ..💜(Text)\n` +
                      `${prefix}video (Song) 🌬️🌳🌊\n\n` +
                      `🦋🌸 Ƭɣƥɛ ${prefix}help2 (All Commands)...☃️💌\n\n` +
                      `${prefix}info (Admin Information) 👀✍️\n` +
                      `...🍫🥀 Ɱɣ ❍wɳɛɽ ɪs Ɱɽ RK-PRAJAPAT...🕊️☃️\n\n` +
                      `${prefix}call 🌺🍃 Call for Any Issue\n` +
                      `<<<<<------------------------------>>>>>\n` +
                      `AND FOR ANY REPORT OR CONTACT BOT DEVELOPER....💙🍫\n\n` +
                      `💝🥀 𝐎𝐖𝐍𝐄𝐑:- ☞ 🆁︎🅺︎-🅿︎🆁︎🅰︎🅳︎🅰︎🅿︎🅰︎🆃︎ ☜ 💫\n` +
                      `🖤 You Can Call Him RK 🖤\n` +
                      `😳 𝐇𝐢𝐬 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐢𝐝 🤓:- ☞ https://www.facebook.com/profile.php?id=61573328623221\n\n` +
                      `👋 For Any Kind Of Help Contact On Telegram 👉 @Ravi23657543 😇\n\n` +
                      `☸🌈━━•🤍•━━\n` +
                      `┏━🕊️━━°❀•°:🎀🧸💙🧸🎀:°•❀°━━💞━┓\n` +
                      `🌸✦✰🍒 🆁︎🅺︎-🅿︎🆁︎🅰︎🅳︎🅰︎🅿︎🅰︎🆃︎ 🌿✰✦🌸\n` +
                      `┗━🕊️━━°❀•°:🎀🧸💙🧸🎀:°•❀°━━💞━┛`;

            // Media file check logic
            if (fs.existsSync(videoPath)) {
                return api.sendMessage({
                    body: msg,
                    attachment: fs.createReadStream(videoPath)
                }, threadID);
            } else {
                console.log("Warning: join.jpg cache folder mein nahi mili, sending text only.");
                return api.sendMessage(msg, threadID);
            }

        } catch (err) {
            console.log("JoinNoti Error:", err.message);
        }
    }
};
