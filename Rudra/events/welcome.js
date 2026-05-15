module.exports.config = {
    name: "welcomeCard",
    eventType: ["log:subscribe"],
    version: "1.2.2",
    credits: "Ravi Kumar Prajapat",
    description: "Welcome with Name, Group Name, Kolkata Time and Member Count",
};

module.exports.run = async function({ api, event, Users }) {
    const { threadID, logMessageData } = event;
    const axios = require("axios");
    const { createCanvas, loadImage } = require("canvas");
    const fs = require("fs-extra");
    const path = require("path");
    const moment = require("moment-timezone");

    if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return;

    for (let user of logMessageData.addedParticipants) {
        const userID = user.userFbId;
        
        try {
            // 1. ASLI NAAM FETCH KARNA
            let userInfo = await api.getUserInfo(userID);
            let name = userInfo[userID]?.name || await Users.getNameUser(userID) || "New Member";
            
            // 2. GROUP INFO AUR MEMBER COUNT
            let threadInfo = await api.getThreadInfo(threadID);
            let threadName = threadInfo.threadName || "इस ग्रुप";
            let memCount = threadInfo.participantIDs.length; // Total members count

            // 3. KOLKATA TIME, DATE AUR DAY
            const kolkataTime = moment.tz("Asia/Kolkata");
            const date = kolkataTime.format("DD/MM/YYYY");
            const time = kolkataTime.format("hh:mm:ss A");
            const day = kolkataTime.format("dddd");

            // --- LOCAL PATH SETTINGS ---
            const cacheDir = path.join(__dirname, "cache");
            const bgPath = path.join(cacheDir, "background.jpg");
            const pathImg = path.join(cacheDir, `welcome_${userID}.png`);
            
            const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
            const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=${fbToken}`;

            if (!fs.existsSync(bgPath)) {
                return console.log("Error: background.jpg nahi mili!");
            }

            const [baseImage, response] = await Promise.all([
                loadImage(bgPath),
                axios.get(avatarUrl, { responseType: 'arraybuffer' })
            ]);
            const avatar = await loadImage(Buffer.from(response.data, 'utf-8'));

            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

            // --- DP SETTINGS (BILKUL SAME HAI) ---
            const centerX = 1013;
            const centerY = 328;
            const radius = 185; 

            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, centerX - radius, centerY - radius, radius * 2, radius * 2);
            ctx.restore();

            // PHOTO PAR NAAM
            ctx.font = "bold 45px Arial";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.fillText(name, 520, 210);

            fs.writeFileSync(pathImg, canvas.toBuffer());

            // FINAL MESSAGE WITH MEMBER COUNT
            api.sendMessage({
                body: `Welcome ${name}! ❤️\n\n` +
                      `📌 Group: ${threadName}\n` +
                      `👥 Ab group mein ${memCount} members ho gaye hain, khush ho jao! 🎉\n\n` +
                      `📅 Date: ${date}\n` +
                      `⏰ Time: ${time} (Kolkata)\n` +
                      `🌟 Day: ${day}\n\n` +
                      `हमारे ग्रुप में आपका स्वागत है!`,
                attachment: fs.createReadStream(pathImg),
                mentions: [{ tag: name, id: userID }]
            }, threadID, () => {
                if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
            });

        } catch (err) {
            console.log("Welcome Error:", err.message);
        }
    }
};
