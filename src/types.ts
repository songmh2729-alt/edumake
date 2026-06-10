/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LessonPlanInput {
  grade: string;       // 1학년 ~ 6학년
  subject: string;     // 국어, 수학, 사회, 과학, 음악, 미술, 체육
  unit: string;        // 단원명
  period: string;      // 차시 (예: 1/4)
  duration: string;    // 수업 시간 (예: 40분)
  goal: string;        // 학습 목표 입력
}

export interface LessonPlan {
  id: string;
  grade: string;
  subject: string;
  unit: string;
  period: string;
  duration: string;
  
  refinedGoal: string;      // 학습 목표 구체화
  introduction: string;     // 도입 활동 제안 (5분)
  development1: string;     // 전개 활동 1단계
  development2: string;     // 전개 활동 2단계
  development3: string;     // 전개 활동 3단계
  summary: string;          // 정리 활동 제안 (5분)
  materials: string;        // 준비물
  assessment: string;       // 형성평가 방법 제안
  expectation: string;      // 기대 효과
  
  createdAt: string;
  isFavorite: boolean;
}

export interface LibraryItem {
  id: string;
  title: string;
  grade: string;
  subject: string;
  unit: string;
  period: string;
  goal: string;
  refinedGoal: string;
  introduction: string;
  development1: string;
  development2: string;
  development3: string;
  summary: string;
  materials: string;
  assessment: string;
  expectation: string;
  downloadsCount: number;
}
