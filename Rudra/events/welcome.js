module.exports.config = {
    name: "welcomeCard",
    eventType: ["log:subscribe"],
    version: "1.1.8",
    credits: "Ravi Kumar Prajapat",
    description: "Welcome using local background image",
};

module.exports.run = async function({ api, event, Users }) {
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
            
            // --- लोकल पाथ सेटिंग्स ---
            const cacheDir = path.join(__dirname, "cache");
            const bgPath = path.join(cacheDir, "background.jpg"); // यहाँ से फोटो उठाएगा
            const pathImg = path.join(cacheDir, `welcome_${userID}.png`);
            
            const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
            const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=${fbToken}`;

            // अगर फाइल नहीं मिलती तो एरर दे
            if (!fs.existsSync(bgPath)) {
                return console.log("Error: background.jpg cache folder mein nahi mili!");
            }

            // बैकग्राउंड (Local) और DP (Online) लोड करें
            const [baseImage, response] = await Promise.all([
                loadImage(bgPath),
                axios.get(avatarUrl, { responseType: 'arraybuffer' })
            ]);
            const avatar = await loadImage(Buffer.from(response.data, 'utf-8'));

            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");

            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

            // DP इन सर्कल (Purple Image Coordinates)
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

            // नाम
            ctx.font = "bold 45px Arial";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.fillText(name, 520, 210);

            fs.writeFileSync(pathImg, canvas.toBuffer());

            api.sendMessage({
                body: `Welcome ${name}! हमारे ग्रुप में आपका स्वागत है। ❤️`,
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
