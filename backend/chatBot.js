const GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});
const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{text: "Tu es un assistant médical de la plateforme MediTech qui répond uniquement sur la santé et brièvement pas de long texte."}]
                },
            ],
        });
const askQuestion = async (req, res) => {
    try {
        const { message } = req.body;
        if(!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        const result = await chat.sendMessage(message);
        const response = result.response;
        console.log("raw response:", JSON.stringify(response, null, 2));
        res.status(200).json({ response: response.text() });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "error": error.message });
    }
}

module.exports = { askQuestion };