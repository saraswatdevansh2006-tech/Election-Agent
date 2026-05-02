export interface Candidate {
  name: string;
  party: string;
  description: string;
}

export interface ElectionInfo {
  nextElection: string;
  voterRegistrationDeadline: string;
  votingMethods: string[];
  importantLinks: { label: string; url: string }[];
  majorCandidates?: Candidate[];
}

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
];

export interface Country {
  id: string;
  name: string;
  flag: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  electionInfo: ElectionInfo;
  languages?: string[]; // IDs from LANGUAGES
}

export const UI_STRINGS: Record<string, any> = {
  en: {
    status: 'Status',
    registration: 'Registration',
    preferredLanguage: 'Preferred Language',
    askMe: 'Ask me anything about voting in',
    typeQuestion: 'Type your question...',
    live: 'LIVE',
    open: 'Open',
    timeline: 'Election Timeline',
    checklist: 'Voting Checklist',
    downloadGuide: 'Download Preparation Guide',
    sync: 'Live Database Sync',
    syncing: 'Syncing with server...',
    candidates: 'Key Candidates / Parties',
    neutralNote: '* All information is provided for neutral educational purposes.',
  },
  hi: {
    status: 'स्थिति',
    registration: 'पंजीकरण',
    preferredLanguage: 'पसंदीदा भाषा',
    askMe: 'मुझसे मतदान के बारे में कुछ भी पूछें',
    typeQuestion: 'अपना प्रश्न लिखें...',
    live: 'लाइव',
    open: 'खुला है',
    timeline: 'चुनाव समयरेखा',
    checklist: 'मतदान चेकलिस्ट',
    downloadGuide: 'तैयारी गाइड डाउनलोड करें',
    sync: 'लाइव डेटाबेस सिंक',
    syncing: 'सर्वर के साथ सिंक हो रहा है...',
    candidates: 'प्रमुख उम्मीदवार / दल',
    neutralNote: '* सभी जानकारी तटस्थ शैक्षिक उद्देश्यों के लिए प्रदान की गई है।',
  },
  mr: {
    status: 'स्थिती',
    registration: 'नोंदणी',
    preferredLanguage: 'पसंतीची भाषा',
    askMe: 'मतदानाबद्दल मला काहीही विचारा',
    typeQuestion: 'तुमचा प्रश्न टाइप करा...',
    live: 'थेट',
    open: 'सुरू',
    timeline: 'निवडणूक वेळापत्रक',
    checklist: 'मतदान चेकलिस्ट',
    downloadGuide: 'तयारी मार्गदर्शक डाउनलोड करा',
    sync: 'थेट डेटाबेस सिंक',
    syncing: 'सर्व्हरसह सिंक होत आहे...',
    candidates: 'प्रमुख उमेदवार / पक्ष',
    neutralNote: '* सर्व माहिती तटस्थ शैक्षणिक उद्देशांसाठी प्रदान केली आहे।',
  },
  ta: {
    status: 'நிலை',
    registration: 'பதிவு',
    preferredLanguage: 'விருப்பமான மொழி',
    askMe: 'வாக்களிப்பது பற்றி என்னிடம் எதையும் கேளுங்கள்',
    typeQuestion: 'உங்கள் கேள்வியைத் தட்டச்சு செய்க...',
    live: 'நேரலை',
    open: 'திறந்துள்ளது',
    timeline: 'தேர்தல் காலக்கோடு',
    checklist: 'வாக்களிப்பு சரிபார்ப்பு பட்டியல்',
    downloadGuide: 'தயாரிப்பு வழிகாட்டியைப் பதிவிறக்கவும்',
    sync: 'நேரடி தரவுத்தள ஒத்திசைவு',
    syncing: 'சர்வரோடு ஒத்திசைக்கப்படுகிறது...',
    candidates: 'முக்கிய வேட்பாளர்கள் / கட்சிகள்',
    neutralNote: '* அனைத்து தகவல்களும் நடுநிலையான கல்வி நோக்கங்களுக்காக வழங்கப்படுகின்றன।',
  },
  te: {
    status: 'స్థితి',
    registration: 'నమోదు',
    preferredLanguage: 'ఇష్టమైన భాష',
    askMe: 'ఓటింగ్ గురించి నన్ను ఏదైనా అడగండి',
    typeQuestion: 'మీ ప్రశ్నను టైప్ చేయండి...',
    live: 'లైవ్',
    open: 'ప్రారంభం',
    timeline: 'ఎన్నికల కాలక్రమం',
    checklist: 'ఓటింగ్ చెక్‌లిస్ట్',
    downloadGuide: 'ప్రిపరేషన్ గైడ్‌ను డౌన్‌లోడ్ చేయండి',
    sync: 'లైవ్ డేటాబేస్ సింక్',
    syncing: 'సర్వర్‌తో సింక్ అవుతోంది...',
    candidates: 'ముఖ్య అభ్యర్థులు / పార్టీలు',
    neutralNote: '* అన్ని సమాచారం తటస్థ విద్యా ప్రయోజనాల కోసం అందించబడింది।',
  }
};

export const COUNTRIES: Country[] = [
  {
    id: 'india',
    name: 'India',
    flag: '🇮🇳',
    colors: {
      primary: '#FF9933', // Saffron
      secondary: '#138808', // India Green
      accent: '#FFFFFF',
      text: '#000080', // Navy Blue
    },
    languages: ['en', 'hi', 'mr', 'ta', 'te'],
    electionInfo: {
      nextElection: '2029 (General Elections)',
      voterRegistrationDeadline: 'Continuous (usually 3 weeks before polling)',
      votingMethods: ['In-person (EVM)', 'Postal Ballot (Eligible classes)'],
      importantLinks: [
        { label: 'National Voters\' Service Portal', url: 'https://voters.eci.gov.in/' },
        { label: 'Election Commission of India', url: 'https://eci.gov.in' },
      ],
      majorCandidates: [
        { name: 'Narendra Modi', party: 'BJP', description: 'Current Prime Minister of India since 2014.' },
        { name: 'Rahul Gandhi', party: 'INC', description: 'Senior leader of the Indian National Congress.' },
        { name: 'Arvind Kejriwal', party: 'AAP', description: 'Convenor of Aam Aadmi Party and CM of Delhi.' }
      ]
    },
  },
  {
    id: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    colors: {
      primary: '#BF0A30', // Old Glory Red
      secondary: '#002868', // Old Glory Blue
      accent: '#FFFFFF',
      text: '#1A1A1A',
    },
    electionInfo: {
      nextElection: 'November 3, 2026 (Midterm Elections)',
      voterRegistrationDeadline: 'Varies by state (Check vote.gov)',
      votingMethods: ['In-person', 'Mail-in', 'Early Voting'],
      importantLinks: [
        { label: 'Register to Vote', url: 'https://vote.gov' },
        { label: 'Ballotpedia', url: 'https://ballotpedia.org' },
      ],
      majorCandidates: [
        { name: 'Democratic Party', party: 'Democrats', description: 'Liberal platform focused on social safety nets and climate action.' },
        { name: 'Republican Party', party: 'Republicans', description: 'Conservative platform focused on limited government and economics.' }
      ]
    },
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    colors: {
      primary: '#012169', // Royal Blue
      secondary: '#C8102E', // Union Red
      accent: '#FFFFFF',
      text: '#0B0B0B',
    },
    electionInfo: {
      nextElection: 'By January 2030 (General Election)',
      voterRegistrationDeadline: '12 working days before polling',
      votingMethods: ['In-person', 'Postal Vote', 'Proxy Vote'],
      importantLinks: [
        { label: 'Register to Vote', url: 'https://gov.uk/register-to-vote' },
        { label: 'The Electoral Commission', url: 'https://electoralcommission.org.uk' },
      ],
      majorCandidates: [
        { name: 'Keir Starmer', party: 'Labour Party', description: 'Current Prime Minister (since July 2024).' },
        { name: 'Rishi Sunak', party: 'Conservative Party', description: 'Leader of the Opposition.' },
        { name: 'Ed Davey', party: 'Liberal Democrats', description: 'Leader of the Liberal Democrats.' }
      ]
    },
  },
  {
    id: 'france',
    name: 'France',
    flag: '🇫🇷',
    colors: {
      primary: '#00209F', // French Blue
      secondary: '#ED2939', // French Red
      accent: '#FFFFFF',
      text: '#121212',
    },
    electionInfo: {
      nextElection: '2027 (Presidential)',
      voterRegistrationDeadline: '6th Friday before the vote',
      votingMethods: ['In-person', 'Proxy Voting'],
      importantLinks: [
        { label: 'Service-Public.fr', url: 'https://service-public.fr' },
      ],
      majorCandidates: [
        { name: 'Emmanuel Macron', party: 'Renaissance', description: 'Current President (Term limited for 2027).' },
        { name: 'Marine Le Pen', party: 'National Rally', description: 'Far-right opposition leader.' },
        { name: 'Jean-Luc Mélenchon', party: 'La France Insoumise', description: 'Left-wing opposition leader.' }
      ]
    },
  },
  {
    id: 'brazil',
    name: 'Brazil',
    flag: '🇧🇷',
    colors: {
      primary: '#009739', // green
      secondary: '#FEDD00', // yellow
      accent: '#012169', // blue
      text: '#FFFFFF',
    },
    electionInfo: {
      nextElection: 'October 2026 (General Elections)',
      voterRegistrationDeadline: 'May 2026 (150 days before)',
      votingMethods: ['In-person (Electronic Voting Machine)'],
      importantLinks: [
        { label: 'Tribunal Superior Eleitoral', url: 'https://tse.jus.br' },
      ],
      majorCandidates: [
        { name: 'Lula da Silva', party: 'PT (Workers Party)', description: 'Current President of Brazil.' },
        { name: 'Jair Bolsonaro', party: 'PL (Liberal Party)', description: 'Former President and opposition figure.' }
      ]
    },
  },
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    colors: {
      primary: '#FFCE00', // Gold
      secondary: '#DD0000', // Red
      accent: '#000000', // Black
      text: '#121212',
    },
    electionInfo: {
      nextElection: 'September 28, 2025 (Federal Election)',
      voterRegistrationDeadline: 'Automatic (Notification by 3rd week before)',
      votingMethods: ['In-person', 'Postal Vote'],
      importantLinks: [
        { label: 'Bundeswahlleiter', url: 'https://bundeswahlleiter.de' },
      ],
      majorCandidates: [
        { name: 'Olaf Scholz', party: 'SPD', description: 'Current Chancellor of Germany.' },
        { name: 'Friedrich Merz', party: 'CDU/CSU', description: 'Leader of the Center-right opposition.' },
        { name: 'Annalena Baerbock', party: 'Greens', description: 'Federal Minister for Foreign Affairs.' }
      ]
    },
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    colors: {
      primary: '#FF0000', // Red
      secondary: '#FFFFFF', // White
      accent: '#BF0A30', // Deep Red
      text: '#111111',
    },
    electionInfo: {
      nextElection: 'By October 20, 2025 (Federal)',
      voterRegistrationDeadline: 'Polling day (with ID and proof)',
      votingMethods: ['In-person', 'Mail-in', 'Early/Advance Polling'],
      importantLinks: [
        { label: 'Elections Canada', url: 'https://elections.ca' },
      ],
      majorCandidates: [
        { name: 'Justin Trudeau', party: 'Liberal Party', description: 'Current Prime Minister of Canada.' },
        { name: 'Pierre Poilievre', party: 'Conservative Party', description: 'Leader of the Official Opposition.' },
        { name: 'Jagmeet Singh', party: 'New Democratic Party', description: 'Leader of the NDP.' }
      ]
    },
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    colors: {
      primary: '#00008B', // Blue
      secondary: '#FF0000', // Red
      accent: '#FFFFFF',
      text: '#000031',
    },
    electionInfo: {
      nextElection: 'By May 2025 (Federal)',
      voterRegistrationDeadline: '7 days after election writs issued',
      votingMethods: ['In-person (Compulsory)', 'Postal Vote', 'Early Voting'],
      importantLinks: [
        { label: 'AEC - Australian Electoral Commission', url: 'https://aec.gov.au' },
      ],
      majorCandidates: [
        { name: 'Anthony Albanese', party: 'Labor Party', description: 'Current Prime Minister of Australia.' },
        { name: 'Peter Dutton', party: 'Liberal Party', description: 'Leader of the Opposition.' },
        { name: 'Adam Bandt', party: 'Australian Greens', description: 'Leader of the Australian Greens.' }
      ]
    },
  },
];
