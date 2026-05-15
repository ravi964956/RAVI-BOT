module.exports.config = {
    name: "leaveCard",
    eventType: ["log:unsubscribe"],
    version: "1.1.0",
    credits: "Ravi Kumar Prajapat",
    description: "Leave card with Name and DP on background image",
};

module.exports.run = async function({ api, event, Users }) {
    const { threadID, logMessageData } = event;
    const axios = require("axios");
    const { createCanvas, loadImage } = require("canvas");
    const fs = require("fs-extra");
    const path = require("path");
    const moment = require("moment-timezone");

    if (logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

    try {
        const userID = logMessageData.leftParticipantFbId;

        // 1. NAME FETCHING
        let userInfo = await api.getUserInfo(userID);
        let name = userInfo[userID]?.name || await Users.getNameUser(userID) || "A Member";

        // 2. GROUP INFO & MEMBERS
        let threadInfo = await api.getThreadInfo(threadID);
        let threadName = threadInfo.threadName || "इस ग्रुप";
        let remainingMembers = threadInfo.participantIDs.length;

        // 3. KOLKATA TIME
        const kolkataTime = moment.tz("Asia/Kolkata");
        const date = kolkataTime.format("DD/MM/YYYY");
        const time = kolkataTime.format("hh:mm:ss A");
        const day = kolkataTime.format("dddd");

        // 4. LEAVE TYPE
        const type = (event.author == userID) ? "leave le liya" : "ko nikaal diya";

        // --- PATH SETTINGS ---
        const cacheDir = path.join(__dirname, "cache");
        const bgPath = path.join(cacheDir, "leave_background.jpg"); // Is naam se photo cache folder mein honi chahiye
        const pathImg = path.join(cacheDir, `leave_${userID}.png`);
        
        const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
        const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=${fbToken}`;

        if (!fs.existsSync(bgPath)) {
            return console.log("Error: leave_background.jpg cache folder mein nahi mili!");
        }

        // DP AUR BACKGROUND LOAD KARNA
        const [baseImage, response] = await Promise.all([
            loadImage(bgPath),
            axios.get(avatarUrl, { responseType: 'arraybuffer' })
        ]);
        const avatar = await loadImage(Buffer.from(response.data, 'utf-8'));

        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // --- DP SETTINGS (UNCHANGED) ---
        const centerX = 500;
        const centerY = 180;
        const radius = 105; 

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, centerX - radius, centerY - radius, radius * 2, radius * 2);
        ctx.restore();

        // PHOTO PAR NAAM LIKHNA
        ctx.font = "bold 45px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(name, 520, 365);

        fs.writeFileSync(pathImg, canvas.toBuffer());

        // FINAL MESSAGE
        let msg = `[❗] 👉🏻 ${name} 👈🏻 ${type}!\n\n` +
                  `📌 Group: ${threadName}\n` +
                  `👥 Ab group mein sirf ${remainingMembers} members bache hain.\n` +
                  `📅 Date: ${date}\n` +
                  `⏰ Time: ${time} (Kolkata)\n` +
                  `🌟 Day: ${day}\n\n` +
                  `Behti hawa sa tha wo, kahan gaya use dhoondho... 😥\nMADE BY RK-PRAJAPAT 💞`;

        api.sendMessage({
            body: msg,
            attachment: fs.createReadStream(pathImg)
        }, threadID, () => {
            if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
        });

    } catch (err) {
        console.log("Leave Error:", err.message);
    }
};
