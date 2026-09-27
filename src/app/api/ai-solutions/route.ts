import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API key is not configured. Please add GROQ_API_KEY to your environment variables.' },
        { status: 501 }
      );
    }

    const body = await request.json();
    const { title, description, category, location, whoFacesIt } = body;

    const prompt = `
You are an AI problem-solving assistant for a platform called SOCH (Problem & Idea Board).
A user has submitted a specific problem. Your task is to generate 3 possible solutions or approaches to this problem.
Do not provide generic solutions. Base your suggestions strictly on the context provided.

Problem Context:
- Title: ${title || 'N/A'}
- Description: ${description || 'N/A'}
- Category: ${category || 'N/A'}
- Location: ${location || 'N/A'}
- Who faces it: ${whoFacesIt && whoFacesIt.length > 0 ? whoFacesIt.join(', ') : 'N/A'}

Output your response ONLY as a JSON array of 3 objects with the following schema:
[
  {
    "title": "Short, catchy title of the solution",
    "explanation": "A concise explanation of the approach",
    "howItAddresses": "How it specifically solves the problem context",
    "whoItHelps": "The specific group this solution will benefit most",
    "requirements": "Potential technology, resources, or requirements to build it"
  }
]

Do not include markdown blocks like \`\`\`json, just return the raw JSON array.
`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      return NextResponse.json(
        { error: `Groq Error: ${errorData.error?.message || 'Failed to communicate with the AI provider.'}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content.trim();
    
    // Attempt to parse JSON
    let parsedSolutions = [];
    try {
      parsedSolutions = JSON.parse(rawContent);
    } catch (e) {
      // In case it still includes markdown fences despite instructions
      const cleanedContent = rawContent.replace(/^```json/i, '').replace(/```$/i, '').trim();
      parsedSolutions = JSON.parse(cleanedContent);
    }

    return NextResponse.json({ solutions: parsedSolutions });
  } catch (error) {
    console.error('AI Solutions Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while generating solutions.' },
      { status: 500 }
    );
  }
}
