module.exports.config = {
  name: "antibd",
  eventType: ["log:user-nickname"],
  version: "1.0.1",
  credits: "RK-PRAJAPAT",
  description: "Bot ka nickname change karne walo ko rokna aur auto reset karna"
};

module.exports.run = async function({ api, event, Users }) {
    const { logMessageData, threadID, author } = event;
    const botID = api.getCurrentUserID();
    
    // Config se details nikalna
    const prefix = global.config.PREFIX || ".";
    const botName = global.config.BOTNAME || "RAVI BOT";
    const adminBot = global.config.ADMINBOT || [];
    
    // Jo name hamesha bot ka hona chahiye
    const officialNickname = `[ ${prefix} ] • ${botName}`;

    // Agar bot ka nickname badla gaya hai
    if (logMessageData.participant_id == botID) {
        
        // 1. Agar change karne wala khud BOT hai ya BOT ADMIN hai, toh use badalne do (return kar jao)
        if (author == botID || adminBot.includes(author)) return;

        // 2. Agar koi aur change karta hai, toh turant nickname reset karo
        try {
            // Nickname wapas wahi set karna jo bot ka default hai
            await api.changeNickname(officialNickname, threadID, botID);
            
            // Name badalne wale bande ka real name nikalna
            let userInfo = await api.getUserInfo(author);
            let changerName = userInfo[author]?.name || await Users.getNameUser(author) || "User";
            
            // Warning message send karna
            return api.sendMessage({ 
                body: `⚠️ ${changerName} - 𝙏𝙐𝙈 𝘽𝙊𝙏 𝙆𝘼 𝙉𝙄𝘾𝙆𝙉𝘼𝙈𝙀 𝘾𝙃𝘼𝙉𝙂𝙀 𝙉𝙄 𝙆𝘼𝙍 𝙎𝘼𝙆𝙏𝘼𝙔 😹🖐`
            }, threadID);

        } catch (err) {
            console.log("AntiBD Error:", err.message);
        }
    }  
};
