module.exports.config = {
  name: "antibd",
  eventType: ["log:user-nickname"],
  version: "1.0.5",
  credits: "RK-PRAJAPAT",
  description: "Bot ka nickname change hote hi bina shart auto reset karna"
};

module.exports.run = async function({ api, event, Users }) {
    const { logMessageData, threadID, author } = event;
    const botID = api.getCurrentUserID();
    
    if (!logMessageData || !logMessageData.participant_id) return;

    // Check karo ki kya target bot khud hai
    if (logMessageData.participant_id == botID) {
        
        const prefix = global.config.PREFIX || ".";
        const botName = global.config.BOTNAME || "RAVI BOT";
        const adminBot = global.config.ADMINBOT || [];
        
        const officialNickname = `[ ${prefix} ] • ${botName}`;

        // Agar badalane wala khud bot hai ya bot admin hai toh use karne do
        if (author == botID || adminBot.includes(author)) return;

        // Agar koi aur chhede, toh turant bina condition match kiye badlo
        try {
            // Pehle nickname reset karo hamesha ke liye
            await api.changeNickname(officialNickname, threadID, botID);
            
            // Name fetch logic with double protection
            let changerName = "User";
            try {
                let userInfo = await api.getUserInfo(author);
                changerName = userInfo[author]?.name || "User";
            } catch (e) {
                changerName = await Users.getNameUser(author) || "User";
            }
            
            return api.sendMessage({ 
                body: `⚠️ ${changerName} - 𝙏𝙐𝙈 𝘽𝙊𝙏 𝙆𝘼 𝙉𝙄𝘾𝙆𝙉𝘼𝙈𝙀 𝘾𝙃𝘼𝙉𝙂𝙀 𝙉𝙄 𝙆𝘼𝙍 𝙎𝘼𝙆𝙏AY 😹🖐`
            }, threadID);

        } catch (err) {
            console.log("AntiBD Force-Reset Error:", err.message);
        }
    }  
};
