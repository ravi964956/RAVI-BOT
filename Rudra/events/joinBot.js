module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.2",
    credits: "RK-PRAJAPAT",
    description: "Bot naye group mein add hone par customized notification video bhejega",
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.run = async function({ api, event }) {
    const { threadID, logMessageData } = event;
    const fs = require("fs-extra");
    const path = require("path");

    // Check karna ki kya add hone wala participant bot khud hai
    if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        
        try {
            // Bot ka nickname auto change karega prefix ke sath
            const prefix = global.config.PREFIX || ".";
            const botName = global.config.BOTNAME || "RAVI BOT";
            api.changeNickname(`[ ${prefix} ] • ${botName}`, threadID, api.getCurrentUserID());

            // --- वीडियो पाथ सेटिंग्स ---
            // Yeh file aapke cache folder mein 'join.jpg' naam se honi chahiye
            const videoPath = path.join(__dirname, "cache", "join.jpg");

            // Shandaar Welcome Message Font aur Styling ke sath
            let msg = `🍒💙•••Ɓ❍ʈ Ƈøɳɳɛƈʈɛɗ•••💞🌿\n\n` +
                      `🕊️🌸...Ɦɛɭɭ❍ Ɠɣus Ɱɣ Ɲɑɱɛ Is 🍒💙•••✦${botName}✦•••💞🌿\n\n` +
                      `✨💞 Ɱɣ Ꭾɽɛfɪᵡ ɪs [ ${prefix} ]\n\n` +
                      `Ƭɣƥɛ ${prefix}help Ƭ❍ sɛɛ Ɱɣ Ƈøɱɱɑɳɗ ɭɪsʈ...🤍💫\n\n` +
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
                      `✮☸✮\n` +
                      `✮┼💞┼✮\n` +
                      `☸🕊️━━•🌸•━━🕊️☸\n` +
                      `✮☸✮\n` +
                      `✮┼🍫┼✮\n` +
                      `☸🎀━━•🧸•━━🎀☸\n` +
                      `✮┼🦢┼✮\n` +
                      `✮☸✮\n` +
                      `☸🌈━━•🤍•━━🌈☸\n` +
                      `✮☸✮\n` +
                      `✮┼❄️┼✮\n\n` +
                      `┏━🕊️━━°❀•°:🎀🧸💙🧸🎀:°•❀°━━💞━┓\n` +
                      `🌸✦✧✧✧✧✰🍒 🆁︎🅺︎-🅿︎🆁︎🅰︎🅳︎🅰︎🅿︎🅰︎🆃︎ 🌿✰✧✧✧✧✦🌸\n` +
                      `┗━🕊️━━°❀•°:🎀🧸💙🧸🎀:°•❀°━━💞━┛`;

            // Agar cache folder mein video milti hai toh video ke sath message bhejega
            if (fs.existsSync(videoPath)) {
                return api.sendMessage({
                    body: msg,
                    attachment: fs.createReadStream(videoPath)
                }, threadID);
            } else {
                // Agar video nahi milti toh bina ruke sirf text message send kar dega
                console.log("Warning: botjoin.mp4 cache folder mein nahi mili, sending text only.");
                return api.sendMessage(msg, threadID);
            }

        } catch (err) {
            console.log("JoinNoti Error:", err.message);
        }
    }
};
