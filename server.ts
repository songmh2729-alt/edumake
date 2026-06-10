/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to avoid crashes if API key is not ready
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST Content Generation Endpoint
app.post("/api/generate-lesson-plan", async (req, res) => {
  const { grade, subject, unit, period, duration, goal } = req.body;

  if (!grade || !subject || !unit || !goal) {
    res.status(400).json({ error: "필수 입력 항목(학년, 과목, 단원, 학습 목표)이 누락되었습니다." });
    return;
  }

  try {
    const ai = getAiClient();
    
    const systemPrompt = `당신은 대한민국 초등학교 수석교사이자 교육과정 총괄 설계자입니다.
2022 개정 교육과정 방향에 맞추어 현장의 초등학생들이 몰입하고 깊이 있는 학습을 이룰 수 있는 고급 수업 지도안(약안)을 생성해 주세요.
모든 결과는 한국어로 격조 있고 단정하게 작성해 주십시오. 1~2문장의 단답형이 아닌, 교사가 바로 읽고 수업을 실천할 수 있을 만큼 단계별로 세부적이고 풍부한 시나리오 형태로 설명해 주세요.`;

    const userPrompt = `다음 정보를 기반으로 대한민국 초등학교 기준의 고품질 수업 지도안을 상세하게 설계해 주세요.

[수업 세부 정보]
- 학년: ${grade}
- 과목: ${subject}
- 단원명: ${unit}
- 차시: ${period || "1"}차시
- 수업 시간: ${duration || "40분"}
- 기존 학습 목표(교사 입력): ${goal}

반드시 지정된 JSON 스키마에 맞추어 다음 9개의 필드를 풍부하게 채워주세요.

1. refinedGoal: 성취기준 중심 및 학생 행위 중심으로 학습 목표를 구체화하고 다듬으세요. (~할 수 있다. 로 끝나야 합니다.)
2. introduction: 도입 활동 (5분) - 주의 집중을 유도하는 동기유발(브레인스토밍, 영상 분석, 실생활 갈등 사례 등), 전시 학습 상기, 공부할 문제 안내를 시나리오식으로 구성하십시오.
3. development1: 전개 활동 1단계 - 핵심 개념을 탐색하고 발견하는 단계입니다. 교사의 발문과 학생의 반응을 포함하여 생생하게 작성하십시오.
4. development2: 전개 활동 2단계 - 학생 주도적인 배움 활동, 모둠 협동 학습, 조작적 활동 또는 토의 토론을 구체적인 규정과 단계로 계획해 주세요.
5. development3: 전개 활동 3단계 - 배운 내용을 심화하거나 일상생활에 실제 적용, 산출물 제작, 성찰해보는 심화 단계입니다.
6. summary: 정리 활동 (5분) - 배움 노트 정리, 친구와의 상호 성찰, 교사의 피드백, 형성평가 결과 확인 및 차시 안내를 계획하십시오.
7. materials: 교사와 학생 각각 필요한 준비물 리스트와 테크 도구(예: 태블릿, 크롬북) 또는 필요한 시각 자료, 학습 카드 등을 자세하게 적으세요.
8. assessment: 수업 중 진행할 형성평가의 구체적 기준(예: 상, 중, 하의 도달 지표 등) 및 관찰 평가 요소, 형성평가 추천 문항을 제안하십시오.
9. expectation: 이 수업을 통해 길러질 수 있는 교과 역량 및 인성적 역량(협동심, 배려, 탐구심 등)에 대한 기대 효과를 적으세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedGoal: {
              type: Type.STRING,
              description: "성취기준과 직결되고 학생 중심으로 한층 구체화된 학습 목표 (~할 수 있다 형식)"
            },
            introduction: {
              type: Type.STRING,
              description: "도입부 5분 동기유발 및 전시학습, 공부할 문제 제안 시나리오"
            },
            development1: {
              type: Type.STRING,
              description: "전개 활동 1단계: 도입에서 연결된 상세 개념 이해 및 발견 활동"
            },
            development2: {
              type: Type.STRING,
              description: "전개 활동 2단계: 핵심 실습 및 모둠, 학생 자율적 배움 활동"
            },
            development3: {
              type: Type.STRING,
              description: "전개 활동 3단계: 일상 적용, 제작 활동 또는 퀴즈, 문제해결 등 심화 적용"
            },
            summary: {
              type: Type.STRING,
              description: "정리부 5분: 오늘 배운 내용을 되돌아보는 정리 및 성찰 활동 제안"
            },
            materials: {
              type: Type.STRING,
              description: "수업에 필요한 구체적인 교사용/학생용 준비물, 테크 도구, 활동지"
            },
            assessment: {
              type: Type.STRING,
              description: "형성평가 질문, 학생 배움 도달 수준(상/중/하)에 대한 지표 및 평가 방법"
            },
            expectation: {
              type: Type.STRING,
              description: "수업을 마친 뒤의 교육적 기대 효과 및 기대되는 하위 역량 변화"
            },
          },
          required: [
            "refinedGoal",
            "introduction",
            "development1",
            "development2",
            "development3",
            "summary",
            "materials",
            "assessment",
            "expectation"
          ]
        },
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI가 아무런 결과를 응답하지 않았습니다.");
    }

    try {
      const parsedPlan = JSON.parse(text);
      res.json(parsedPlan);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", text);
      res.status(500).json({ error: "AI 생성 결과 파싱 오류가 발생했습니다. 다시 시도해 주세요.", raw: text });
    }
  } catch (error: any) {
    console.error("Gemini lesson plan generation error:", error);
    res.status(500).json({ 
      error: "수업 지도안 생성 중 오류가 발생했습니다.", 
      message: error.message || "알 수 없는 에러가 발생했습니다." 
    });
  }
});

// Configure Vite or serve static production bundle
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduPlan AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
