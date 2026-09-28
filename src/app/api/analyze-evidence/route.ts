import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API key is not configured.' },
        { status: 501 }
      );
    }

    const body = await request.json();
    const { title, description, category } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'title and description are required.' },
        { status: 400 }
      );
    }

    const prompt = `You are a research analyst for a problem-tracking platform called SOCH.

A user has submitted the following real-world problem:
- Title: ${title}
- Category: ${category || 'General'}
- Description: ${description}

Your task is to estimate, based on your knowledge of the domain:
1. How many distinct existing solutions, products, tools, or initiatives already exist globally that try to address this problem.
2. How many research papers, academic studies, reports, or authoritative references likely exist that are related to this problem.

Rules:
- Base your estimates on real-world knowledge of this problem domain.
- Do not return 0 unless the problem is truly novel with absolutely no known prior work.
- Keep estimates realistic and grounded (typically between 2 and 15 for each).
- Return ONLY a raw JSON object — no markdown, no explanation, no extra text.

Return exactly:
{"existingSolutions": <integer>, "researchReferences": <integer>}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, // Lower temperature for more consistent numeric estimates
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error (analyze-evidence):', errorData);
      return NextResponse.json(
        { error: `Groq error: ${errorData.error?.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content?.trim() ?? '';

    let parsed: { existingSolutions: number; researchReferences: number };

    try {
      // Strip markdown fences if the model adds them despite instructions
      const cleaned = rawContent
        .replace(/^```(?:json)?/i, '')
        .replace(/```$/i, '')
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse AI evidence response:', rawContent);
      return NextResponse.json(
        { error: 'Failed to parse AI response into valid JSON.' },
        { status: 500 }
      );
    }

    // Ensure integer values within a sane range
    const existingSolutions = Math.min(20, Math.max(1, Math.round(Number(parsed.existingSolutions) || 2)));
    const researchReferences = Math.min(20, Math.max(1, Math.round(Number(parsed.researchReferences) || 2)));

    return NextResponse.json({ existingSolutions, researchReferences });
  } catch (error) {
    console.error('Analyze Evidence Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while analyzing evidence.' },
      { status: 500 }
    );
  }
}
