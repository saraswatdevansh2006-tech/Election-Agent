export interface LiveElectionData {
  nextElection: string;
  voterRegistrationDeadline: string;
  votingMethods: string[];
}

export async function fetchLiveElectionData(countryName: string): Promise<LiveElectionData | null> {
  try {
    const prompt = `Fetch the latest, real-time election data for ${countryName}. 
    Return ONLY a JSON object with the following structure:
    {
      "nextElection": "Date and Type of next major election",
      "voterRegistrationDeadline": "Specific deadline or rule",
      "votingMethods": ["list", "of", "methods"]
    }`;

    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, jsonMode: true })
    });

    if (!response.ok) throw new Error('AI Proxy Error');
    const data = await response.json();
    return JSON.parse(data.text) as LiveElectionData;
  } catch (error) {
    console.error("Live Fetch Error:", error);
    return null;
  }
}
