module.exports.config = {
    name: "leaveCard",
    eventType: ["log:unsubscribe"],
    version: "1.0.0",
    credits: "Ravi Kumar Prajapat",
    description: "Notify when someone leaves or is kicked from the group",
};

module.exports.run = async function({ api, event, Users, Threads }) {
    const { threadID, logMessageData } = event;
    const axios = require("axios");
    const fs = require("fs-extra");
    const path = require("path");
    const moment = require("moment-timezone");

    // Agar bot khud leave hota hai toh reply nahi karega
    if (logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

    try {
        const userID = logMessageData.leftParticipantFbId;

        // 1. ASLI NAAM FETCH KARNA (Fix for Facebook User)
        let userInfo = await api.getUserInfo(userID);
        let name = userInfo[userID]?.name || await Users.getNameUser(userID) || "A Member";

        // 2. GROUP INFO AUR BACHE HUYE MEMBERS
        let threadInfo = await api.getThreadInfo(threadID);
        let threadName = threadInfo.threadName || "इस ग्रुप";
        let remainingMembers = threadInfo.participantIDs.length;

        // 3. KOLKATA TIME, DATE AUR DAY
        const kolkataTime = moment.tz("Asia/Kolkata");
        const date = kolkataTime.format("DD/MM/YYYY");
        const time = kolkataTime.format("hh:mm:ss A");
        const day = kolkataTime.format("dddd");

        // 4. LEAVE TYPE (Khud gaya ya nikala gaya)
        const type = (event.author == userID) ? "khud leave le liya" : "ko admin ne dhakka maar ke nikaal diya";

        // AGAR AAP PHOTO USE KARNA CHAHTE HAIN (Optional)
        // Maine image generation ka code welcomeCard jaisa rakha hai agar aap background.jpg rakhte ho toh
        const cacheDir = path.join(__dirname, "cache");
        const bgPath = path.join(cacheDir, "leave_background.jpg"); // Leave ke liye alag photo rakh sakte ho
        const pathImg = path.join(cacheDir, `leave_${userID}.png`);

        let msg = `[❗] 👉🏻 ${name} 👈🏻 ${type}!\n\n` +
                  `📌 Group: ${threadName}\n` +
                  `👥 Ab group mein sirf ${remainingMembers} members bache hain.\n\n` +
                  `📅 Date: ${date}\n` +
                  `⏰ Time: ${time}\n` +
                  `🌟 Day: ${day}\n\n` +
                  `Behti hawa sa tha wo, kahan gaya use dhoondho... 😥\n` +
                  `MADY BY RK-PRAJAPAT 💕`;

        // Check agar background image hai toh photo ke saath bheje, nahi toh sirf text
        if (fs.existsSync(bgPath)) {
            // (Aap yahan welcomeCard wala canvas logic copy-paste kar sakte hain agar image chahiye)
            api.sendMessage({ body: msg, attachment: fs.createReadStream(bgPath) }, threadID);
        } else {
            api.sendMessage(msg, threadID);
        }

    } catch (err) {
        console.log("Leave Error:", err.message);
    }
};
