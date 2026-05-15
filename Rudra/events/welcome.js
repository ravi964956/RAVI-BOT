module.exports.config = {
    name: "welcomeCard",
    eventType: ["log:subscribe"],
    version: "1.0.6",
    credits: "Ravi Kumar Prajapat",
    description: "Welcome members with custom background",
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
        const name = await Users.getNameUser(userID);
        
        // --- नया इमेज लिंक जो आपने दिया है ---
        const bgURL = "https://i.postimg.cc/SxNRZxwY/IMG-20260513-210012.jpg"; 
        const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
        const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=${fbToken}`;
        
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
        const pathImg = path.join(cacheDir, `welcome_${userID}.png`);

        try {
            // इमेज और प्रोफाइल पिक्चर लोड करें
            const [baseImage, response] = await Promise.all([
                loadImage(bgURL),
                axios.get(avatarUrl, { responseType: 'arraybuffer' })
            ]);
            const avatar = await loadImage(Buffer.from(response.data, 'utf-8'));

            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");

            // बैकग्राउंड ड्रॉ करें
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

            // --- DP की पोजीशन (सर्कल) ---
            const avatarSize = 380; // साइज थोड़ा बढ़ाया है
            const centerX = 265;   // X-अक्ष (बाएँ से दूरी)
            const centerY = 460;   // Y-अक्ष (ऊपर से दूरी)

            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, avatarSize / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, centerX - (avatarSize / 2), centerY - (avatarSize / 2), avatarSize, avatarSize);
            ctx.restore();

            // --- नाम की पोजीशन ---
            ctx.font = "bold 65px Arial";
            ctx.fillStyle = "#000000"; // काला रंग (आपकी इमेज के हिसाब से)
            ctx.textAlign = "left";
            
            // नाम बहुत लंबा हो तो उसे संभालें
            let displayName = name.length > 20 ? name.slice(0, 18) + "..." : name;
            ctx.fillText(displayName, 550, 470);

            // इमेज सेव और सेंड
            fs.writeFileSync(pathImg, canvas.toBuffer());

            await api.sendMessage({
                body: `Welcome ${name}! हमारे ग्रुप में आपका स्वागत है। ❤️`,
                attachment: fs.createReadStream(pathImg),
                mentions: [{ tag: name, id: userID }]
            }, threadID);

            // भेजने के बाद टेम्परेरी फाइल डिलीट करें
            if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);

        } catch (err) {
            console.log("Welcome Card Error Details:", err.message);
            api.sendMessage(`Welcome ${name}!`, threadID);
        }
    }
};
