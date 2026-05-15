module.exports.config = {
    name: "welcomeCard",
    eventType: ["log:subscribe"],
    version: "1.0.8",
    credits: "Ravi Kumar Prajapat",
    description: "DP in Circle with Name and Group Name",
};

module.exports.run = async function({ api, event, Users, Threads }) {
    const { threadID, logMessageData } = event;
    const axios = require("axios");
    const { createCanvas, loadImage } = require("canvas");
    const fs = require("fs-extra");
    const path = require("path");

    if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return;

    for (let user of logMessageData.addedParticipants) {
        const userID = user.userFbId;
        
        try {
            const name = await Users.getNameUser(userID);
            const threadInfo = await Threads.getInfo(threadID);
            const threadName = threadInfo.threadName || "this group";

            // इमेज लिंक्स
            const bgURL = "https://i.ibb.co/vzYvYvY/1000349683.jpg"; 
            const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
            const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=${fbToken}`;
            
            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
            const pathImg = path.join(cacheDir, `welcome_${userID}.png`);

            // लोड इमेजेस
            const [baseImage, response] = await Promise.all([
                loadImage(bgURL),
                axios.get(avatarUrl, { responseType: 'arraybuffer' })
            ]);
            const avatar = await loadImage(Buffer.from(response.data, 'utf-8'));

            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");

            // 1. बैकग्राउंड ड्रा करें
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

            // 2. DP को घेरे में फिट करना (Perfect Circle Logic)
            const centerX = canvas.width / 2; // सेंटर
            const centerY = 145;             // घेरे की ऊँचाई
            const radius = 88;               // घेरे का साइज

            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, centerX - radius, centerY - radius, radius * 2, radius * 2);
            ctx.restore();

            // 3. यूजर का प्रोफाइल नेम (सफेद रंग)
            ctx.font = "bold 45px Arial";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            let shortName = name.length > 18 ? name.slice(0, 16) + "..." : name;
            ctx.fillText(shortName, canvas.width / 2, 290);

            // 4. ग्रुप का नाम (हल्का ग्रे या सफेद)
            ctx.font = "italic 30px Arial";
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            let gName = threadName.length > 25 ? threadName.slice(0, 23) + "..." : threadName;
            ctx.fillText(gName, canvas.width / 2, 340);

            // सेव और सेंड
            fs.writeFileSync(pathImg, canvas.toBuffer());

            await api.sendMessage({
                body: `Welcome ${name}! हमारे ग्रुप में आपका स्वागत है। ❤️`,
                attachment: fs.createReadStream(pathImg),
                mentions: [{ tag: name, id: userID }]
            }, threadID);

            if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);

        } catch (err) {
            console.log("Welcome Error:", err);
            api.sendMessage(`Welcome!`, threadID);
        }
    }
};
