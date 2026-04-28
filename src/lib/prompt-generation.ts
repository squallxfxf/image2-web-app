import { openai } from './openai';

export async function generateTextPrompt(systemRule: string, userContent: string) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemRule },
      { role: 'user', content: userContent }
    ]
  });
  return res.choices[0]?.message?.content?.trim() ?? '';
}

export async function generateBoundPrompts(input: { image2Prompt: string; imageDescriptionSeed?: string }) {
  const imageDescription = await generateTextPrompt(
    '你是图片内容分析助手。用中文100-200字客观描述图片，不虚构。包含主体、场景、动作、服装、光线、构图、风格。',
    input.imageDescriptionSeed ?? input.image2Prompt
  );

  const ltxPrompt = await generateTextPrompt(
    '将给定图片场景转为LTX2.3图生视频提示词。20秒，写实，有动作节奏和镜头语言。保持主体身份/服装/场景核心设定。若有人物可含普通话台词。必须含“无字幕、无屏幕文字、无水印、无UI元素”。仅输出中文完整段落。',
    `图片设定: ${imageDescription}\n原始IMAGE2提示词:${input.image2Prompt}`
  );

  const wanPrompt = await generateTextPrompt(
    '将给定图片场景转为WAN2.2图生视频提示词。6秒，动作集中、镜头简洁、适配短视频。默认无对白，除非用户要求。保持主体身份/服装/场景核心设定。必须含“无字幕、无屏幕文字、无水印、无UI元素”。仅输出中文完整段落。',
    `图片设定: ${imageDescription}\n原始IMAGE2提示词:${input.image2Prompt}`
  );

  return { imageDescription, ltxPrompt, wanPrompt };
}
