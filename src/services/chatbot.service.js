import axios from "axios";


export const getBotResponse = async (message) => {
    try {
        const response = await axios.post(`${process.env.OPENAI_API_LINK}`,
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful travel assistant bot. You help users with their travel related queries and provide personalized travel recommendations based on their preferences and interests."
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        )
        return res.send({
            status: 200,
            message: "Bot response fetched successfully..",
            botResponse: response.data.choices[0].message.content
        });
    } catch (error) {
        console.error("Error fetching bot response:", error);
        return "Sorry, I'm having trouble responding right now. Please try again later.";
    }
}

export default getBotResponse;