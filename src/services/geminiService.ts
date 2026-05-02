import { GoogleGenAI } from "@google/genai";

export async function askElectionAssistant(query: string, country: { name: string; electionInfo: any }, languageName: string = 'English') {
  try {
    const key = (window as any).GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
    if (!key) {
      console.warn("Gemini API Key is missing.");
      return "The assistant is currently unavailable. Please check the API configuration.";
    }
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `Current User Context:
Country: ${country.name}
Language Required: ${languageName}
Official Election Info Provided to You:
- Next Election: ${country.electionInfo.nextElection}
- Registration Deadline: ${country.electionInfo.voterRegistrationDeadline}
- Voting Methods: ${country.electionInfo.votingMethods.join(', ')}

User Question: ${query}` }]
        }
      ],
      config: {
        systemInstruction: `You are VoterVoice, a highly intelligent, helpful and non-partisan election assistant for citizens in ${country.name}. 
        Your goal is to provide accurate, up-to-date information about voting procedures, deadlines, and registration specific to ${country.name}'s current and upcoming elections.
        
        CRITICAL: YOU MUST RESPOND ENTIRELY IN THE REQUESTED LANGUAGE (${languageName}).
        
        Guidelines:
        1. Use the "Official Election Info Provided to You" as your primary source of truth for dates and methods.
        2. Use Markdown to format your response (bolding, lists, tables where appropriate).
        3. Be concise but thorough.
        4. Use bullet points for steps or lists of requirements.
        5. If a query is about dates, explicitly highlight them.
        6. Encourage civic participation without endorsing candidates or parties.
        7. If asked about something you are unsure of, provide a direct link to the official ${country.name} election commission or government website.
        8. Keep the tone professional, encouraging, and clear.`,
        temperature: 0.2,
      },
    });

    return response.text || "I'm sorry, I couldn't process your request right now. Please try again later.";
  } catch (error) {
    console.error("AI Error:", error);
    return "The assistant is currently unavailable. Please check official sources for election information.";
  }
}
