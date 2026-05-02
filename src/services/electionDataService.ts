import { GoogleGenAI } from "@google/genai";

export interface LiveElectionData {
  nextElection: string;
  voterRegistrationDeadline: string;
  votingMethods: string[];
}

export async function fetchLiveElectionData(countryName: string): Promise<LiveElectionData | null> {
  try {
    const key = (window as any).GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
    if (!key) return null;
    
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `Fetch the latest, real-time election data for ${countryName}. 
          Return ONLY a JSON object with the following structure:
          {
            "nextElection": "Date and Type of next major election",
            "voterRegistrationDeadline": "Specific deadline or rule",
            "votingMethods": ["list", "of", "methods"]
          }` }]
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "";
    return JSON.parse(text) as LiveElectionData;
  } catch (error) {
    console.error("Live Fetch Error:", error);
    return null;
  }
}
