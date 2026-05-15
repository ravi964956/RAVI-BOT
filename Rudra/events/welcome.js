module.exports.config = {
    name: "welcomeCard",
    eventType: ["log:subscribe"],
    version: "1.0.0",
    credits: "Ravi Kumar Prajapat",
    description: "Welcome members with a card using Canvas",
};

module.exports.run = async function({ api, event, Users }) {
    const { threadID, logMessageData } = event;
    const axios = require("axios");
    const { createCanvas, loadImage } = require("canvas");
    const fs = require("fs-extra");
    const path = require("path");

    // बॉट खुद को ऐड होने पर इग्नोर करे
    if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return;

    if (logMessageData.addedParticipants) {
        for (let user of logMessageData.addedParticipants) {
            const userID = user.userFbId;
            
            try {
                // 1. नाम और डाटा निकालें
                const name = await Users.getNameUser(userID);
                
                // 2. बैकग्राउंड इमेज का लिंक (आपकी दी हुई इमेज)
                const bgURL = "https://i.postimg.cc/85M1LzSj/1000350014.jpg"; 
                
                // 3. टोकन (जो आपकी rankup फाइल में है वही इस्तेमाल किया है)
                const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
                const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=${fbToken}`;

                // --- CANVAS प्रोसेस शुरू ---
                const baseImage = await loadImage(bgURL);
                const canvas = createCanvas(baseImage.width, baseImage.height);
                const ctx = canvas.getContext("2d");

                // बैकग्राउंड ड्रॉ करें
                ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

                // प्रोफाइल पिक्चर (DP) डाउनलोड और ड्रॉ करें
                const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
                const avatar = await loadImage(Buffer.from(response.data, 'utf-8'));

                // DP को गोलाकार (Circle) में ड्रॉ करना
                ctx.save();
                ctx.beginPath();
                ctx.arc(245, 445, 205, 0, Math.PI * 2, true); // X, Y, Radius
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatar, 40, 240, 410, 410); // X, Y, Width, Height (Adjusted for your image)
                ctx.restore();

                // नाम लिखना (Black Color)
                ctx.font = "bold 60px sans-serif";
                ctx.fillStyle = "#000000";
                ctx.textAlign = "left";
                
                // अगर नाम बहुत बड़ा है तो उसे छोटा करें
                let printName = name;
                if (ctx.measureText(printName).width > 500) {
                    printName = printName.slice(0, 15) + "...";
                }
                ctx.fillText(printName, 530, 450);

                // वेलकम टेक्स्ट
                ctx.font = "40px sans-serif";
                ctx.fillStyle = "#333333";
                ctx.fillText("Welcome to our group!", 530, 520);

                // इमेज सेव करना
                const pathImg = path.join(__dirname, "cache", `welcome_${userID}.png`);
                if (!fs.existsSync(path.join(__dirname, "cache"))) fs.mkdirSync(path.join(__dirname, "cache"));
                fs.writeFileSync(pathImg, canvas.toBuffer());

                // मैसेज भेजना
                api.sendMessage({
                    body: `🎉 Welcome ${name}! हमारे ग्रुप में आपका स्वागत है।`,
                    attachment: fs.createReadStream(pathImg),
                    mentions: [{ tag: name, id: userID }]
                }, threadID, () => {
                    if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
                });

            } catch (err) {
                console.error("Error in Welcome Card:", err);
                const name = await Users.getNameUser(userID);
                api.sendMessage(`Welcome ${name}!`, threadID);
            }
        }
    }
};
