module.exports.config = {
    name: "welcomeCard",
    eventType: ["log:subscribe"],
    version: "1.0.9",
    credits: "Ravi Kumar Prajapat",
    description: "Fixed Circle DP and Name Only",
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
            const bgURL = "https://i.ibb.co/vzYvYvY/1000349683.jpg"; 
            const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
            const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=${fbToken}`;
            
            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
            const pathImg = path.join(cacheDir, `welcome_${userID}.png`);

            const [baseImage, response] = await Promise.all([
                loadImage(bgURL),
                axios.get(avatarUrl, { responseType: 'arraybuffer' })
            ]);
            const avatar = await loadImage(Buffer.from(response.data, 'utf-8'));

            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");

            // बैकग्राउंड
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

            // DP को घेरे (Circle) में डालना - Perfect Position
            ctx.save();
            ctx.beginPath();
            ctx.arc(300, 148, 88, 0, Math.PI * 2, true); // यहाँ घेरे की जगह सेट की है
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, 212, 60, 176, 176); // DP को घेरे के अंदर बिठाया है
            ctx.restore();

            // यूजर का नाम
            ctx.font = "bold 45px Arial";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.fillText(name, 300, 295); // नाम की जगह

            fs.writeFileSync(pathImg, canvas.toBuffer());

            api.sendMessage({
                body: `Welcome ${name}! हमारे ग्रुप में आपका स्वागत है। ❤️`,
                attachment: fs.createReadStream(pathImg),
                mentions: [{ tag: name, id: userID }]
            }, threadID, () => {
                if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
            });

        } catch (err) {
            console.log(err);
        }
    }
};
