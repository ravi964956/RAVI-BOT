module.exports.config = {
    name: "welcomeCard",
    eventType: ["log:subscribe"],
    version: "1.0.0",
    credits: "Ravi Kumar Prajapat",
    description: "Welcome members with a card",
};

module.exports.run = async function({ api, event, Users }) {
    const { threadID, logMessageData } = event;
    const axios = require("axios");
    const { createCanvas, loadImage } = require("canvas");
    const fs = require("fs-extra");
    const path = require("path");

    // अगर बॉट खुद को ही ऐड करे तो मैसेज न भेजे
    if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return;

    if (logMessageData.addedParticipants) {
        for (let user of logMessageData.addedParticipants) {
            const userID = user.userFbId;
            const name = await Users.getNameUser(userID);
            
            // आपकी बैकग्राउंड इमेज का डायरेक्ट लिंक
            const bgURL = "https://i.postimg.cc/85M1LzSj/1000350014.jpg"; 
            const cachePath = path.join(__dirname, "cache", `welcome_${userID}.png`);

            try {
                // फोल्डर चेक करें
                if (!fs.existsSync(path.join(__dirname, "cache"))) {
                    fs.mkdirSync(path.join(__dirname, "cache"));
                }

                const baseImage = await loadImage(bgURL);
                const canvas = createCanvas(baseImage.width, baseImage.height);
                const ctx = canvas.getContext("2d");

                // बैकग्राउंड ड्रा करें
                ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

                // प्रोफाइल पिक्चर (DP)
                const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                const avatar = await loadImage(avatarUrl);

                // DP को गोल घेरे में सेट करना (X=245, Y=445 के करीब)
                ctx.save();
                ctx.beginPath();
                ctx.arc(245, 445, 205, 0, Math.PI * 2, true); 
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatar, 245 - 205, 445 - 205, 410, 410);
                ctx.restore();

                // नाम लिखना (काले रंग में)
                ctx.font = "bold 55px Arial";
                ctx.fillStyle = "#000000"; 
                ctx.textAlign = "left";
                ctx.fillText(name, 520, 440); 

                ctx.font = "35px Arial";
                ctx.fillStyle = "#333333";
                ctx.fillText("Welcome to our group!", 520, 500);

                const buffer = canvas.toBuffer();
                fs.writeFileSync(cachePath, buffer);

                // मैसेज सेंड करना
                api.sendMessage({
                    body: `Welcome ${name}! ग्रुप में आपका स्वागत है। ❤️`,
                    attachment: fs.createReadStream(cachePath)
                }, threadID, () => {
                    if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
                });

            } catch (err) {
                console.error(err);
                api.sendMessage(`Welcome ${name}!`, threadID);
            }
        }
    }
};
