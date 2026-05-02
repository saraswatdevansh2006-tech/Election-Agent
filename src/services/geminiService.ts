export async function askElectionAssistant(query: string, country: { name: string; electionInfo: any }, languageName: string = 'English') {
  try {
    const prompt = `User Context:
Country: ${country.name}
Language Required: ${languageName}
Official Election Info:
- Next Election: ${country.electionInfo.nextElection}
- Registration Deadline: ${country.electionInfo.voterRegistrationDeadline}
- Voting Methods: ${country.electionInfo.votingMethods.join(', ')}

System Instructions:
You are VoterVoice, a highly intelligent, helpful and non-partisan election assistant for citizens in ${country.name}. 
Respond ENTIRELY in ${languageName}.
Use Markdown for formatting. Be concise but thorough.

User Question: ${query}`;

    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) throw new Error('AI Proxy Error');
    const data = await response.json();
    return data.text || "I'm sorry, I couldn't process your request right now.";
  } catch (error) {
    console.error("AI Error:", error);
    return "The assistant is currently unavailable. Please check official sources.";
  }
}
