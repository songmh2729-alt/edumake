/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Compass, Target, BookOpen, Clock, Heart, Cpu } from "lucide-react";
import { motion } from "motion/react";

export default function AboutPage() {
  const sections = [
    {
      icon: <Compass className="w-6 h-6 text-blue-600 dark:text-sky-400" />,
      title: "서비스 소개 (Service)",
      desc: "EduPlan AI는 바쁜 초등학교 교사와 예비 교사들이 고품질의 수업 지도안을 간편하게 기획하고 공유할 수 있도록 지원하는 지능형 웹 서비스입니다. 단 몇 번의 입력만으로 현장에서 바로 사용가능한 수준의 정교한 수업 시나리오를 구성합니다."
    },
    {
      icon: <Target className="w-6 h-6 text-rose-500 dark:text-rose-400" />,
      title: "개발 목적 (Goal)",
      desc: "본 서비스는 교사의 행정 업무 및 일상적인 수업 기획 부담을 덜어, 수업의 주체인 아이들과 교감하는 배움 중심 시간에 더 집중할 수 있는 교육 환경을 마련하고자 탄생했습니다. 단순 원리 나열이 아닌 '맥락 중심 교육'의 실행을 돕습니다."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />,
      title: "활용 방법 (Guideline)",
      desc: "학년과 과목, 그리고 평소 지향하는 수업 목표를 입력창에 넣어주세요. 생성 알고리즘이 대한민국 초과과정 성취기준을 연결하고 학습 목표 구체화, 3단계 전개 방법, 실습 준비물, 그리고 학생 성장 도달 기준을 함축한 맞춤 평가 기준까지 종합 지원합니다."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "수업 기본 정보 등록",
      desc: "적용할 학년(1학년~6학년)과 과목, 그리고 단원명과 차시, 수업 시간을 입력창에 설정합니다."
    },
    {
      num: "02",
      title: "개략적인 아이디어 입력",
      desc: "구상하고 계신 수업 성격이나 기존에 마련해 둔 간단한 핵심 학습 목표를 타이핑해 주세요."
    },
    {
      num: "03",
      title: "AI 가이드 생성 및 확인",
      desc: "지도안 생성 버튼을 누르면 10여 초 간의 정밀 인공지능 탐구를 통해 항목별 시나리오식 계획안이 도출됩니다."
    },
    {
      num: "04",
      title: "수정 편집 및 PDF/인쇄",
      desc: "도출된 초안의 텍스트가 마음에 들지 않을 경우 직접 인라인 수정하거나 추가하여 즉시 서류로 보관하거나 인쇄합니다."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight"
        >
          초등 교육의 따뜻한 발전을 위한 동반자, EduPlan AI
        </motion.h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
          교사가 가르치는 기쁨을 누리는 곳, 학생이 배우는 즐거움을 깨닫는 교실. <br className="hidden sm:inline" />
          기술과 따스한 감성으로 교사의 위대한 여정을 보조하겠습니다.
        </p>
      </div>

      {/* Core Objective Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {sections.map((sec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            id={`about-card-${idx}`}
            className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner mb-6">
                {sec.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{sec.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">{sec.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* How It operates - Step Timeline */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 dark:text-sky-400 tracking-wider uppercase">사용 프로세스</span>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white mt-1">지도안을 설계하는 아주 단순한 흐름</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} id={`about-step-${idx}`} className="relative">
              <span className="absolute -top-6 -left-2 text-6xl font-black text-slate-100 dark:text-slate-800 select-none pointer-events-none transition-colors">
                {step.num}
              </span>
              <div className="relative pt-4">
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{step.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy Callout Card */}
      <div className="mt-16 text-center border-t border-slate-200 dark:border-slate-800 pt-12">
        <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-slate-800/80 mb-4 text-blue-600 dark:text-sky-400">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">교사와 함께 성장하는 AI</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          EduPlan AI가 추천하는 모든 수업 방침은 교사의 고유한 성찰과 만날 때 가장 위대한 가치를 드러냅니다. 교사 여러분의 교육 철학을 무궁무진하게 불어넣어 완성해 보십시오.
        </p>
      </div>
    </div>
  );
}
