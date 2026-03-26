export const mockVoiceProfile = {
  tone: "Direct & Confident",
  sentenceLength: "Short (8-12 words)",
  vocabularyLevel: "Moderate / Accessible",
  persona: "Peer / Founder",
  keyCharacteristics: [
    "Uses personal anecdotes",
    "Short, punchy paragraphs",
    "Focuses on practical value over theory",
    "Uses active voice"
  ],
  sampleSentence: "Here's what I learned after 10 years of building products nobody wanted."
};

export const mockGeneratedBlog = {
  title: "Why Most AI Blog Tools Fail (And What to Do Instead)",
  metaTitle: "Best AI Blog Automation Tool India: A Real Look",
  metaDescription: "Most AI blog tools write generic, terrible content. Here is how to actually automate your blog without losing your voice.",
  keyword: "best AI blog tool India",
  content: `<h1>Why Most AI Blog Tools Fail (And What to Do Instead)</h1>
<p>As a founder, I've seen a hundred tools promise "one-click blog posts." They all do the same thing: spit out generic robotic text.</p>
<h2>The Problem with Standard AI</h2>
<p>Google doesn't want another article that starts with "In today's fast-paced digital landscape, leveraging synergy is critical." It wants real human experience. It wants <strong>your</strong> experience.</p>
<ul>
  <li>Generic content ranks poorly</li>
  <li>Readers bounce in 3 seconds</li>
  <li>It damages your brand credibility</li>
</ul>
<h2>The Solution is Voice</h2>
<p>If you're looking for the best AI blog tool India has to offer, you need one that actually learns your voice first. Do not compromise on this.</p>`,
  rankScore: 78,
  readabilityGrade: 8,
  aiDetectionScore: 7
};

export const mockDistribution = {
  website: mockGeneratedBlog.content,
  linkedin: `We tried 5 SEO tools. This one actually thinks like a strategist.

Most AI blog tools give you generic content that sounds like a robot wrote it.
VoiceRank learned my writing style in 10 seconds.
Then it told me my blog had a 78% chance to rank BEFORE I wrote it.

What's your take? 👇`,
  twitter: [
    "1/ Most AI blog tools are terrible. They spit out generic robotic text that no one wants to read. Here's why you are wasting your time: 🧵",
    "2/ Google doesn't rank generic content anymore. It wants real human experience. It wants YOUR experience.",
    "3/ I found a tool that actually learns your voice first. It tells you your rank score before you publish. It's a game changer.",
    "4/ VoiceRank is the only tool that actually thinks like a strategist. No more 'In today's fast-paced digital landscape' generic slop.",
    "5/ Stop writing bad AI content. Start writing with your own voice. Check out VoiceRank."
  ],
  quora: `<strong>Question: What is the best AI blog tool?</strong>

<strong>Answer:</strong>
I've tested dozens of tools over the last 3 years. The biggest problem they all share is generating generic, obvious content that sounds automated.

If you are looking for the "best AI blog tool," you need one that starts by learning your unique voice parameters—your tone, sentence length, and reading level. I currently use VoiceRank because it handles the voice extraction automatically and provides SEO/Rank scoring before you even publish. 

Stop settling for content that sounds like everyone else. Focus on tooling that amplifies your specific personality.`,
  newsletter: `<strong>Subject: Why generic AI blogs are killing your traffic</strong>

Hey everyone,

I've tested dozens of tools lately and the results are honestly pretty bleak. Most "AI writers" just create obvious, robotic paragraphs that nobody actually wants to read.

Take a look at why this is happening and what a voice-first approach actually looks like on the blog today.`
};
