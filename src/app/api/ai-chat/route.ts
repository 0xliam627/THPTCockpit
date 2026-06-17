import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { prompt, systemPrompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Thiếu nội dung tin nhắn.' }, { status: 400 });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-preview-02-05:free', // Free model on OpenRouter
        messages: [
          { role: 'system', content: systemPrompt || 'Bạn là một chuyên gia tư vấn tuyển sinh đại học tại Việt Nam. Hãy tư vấn nhiệt tình, ngắn gọn và chính xác.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return NextResponse.json({ success: true, text: data.choices[0].message.content });
    } else {
      console.error('OpenRouter error:', data);
      return NextResponse.json({ error: 'AI không thể trả lời lúc này.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
