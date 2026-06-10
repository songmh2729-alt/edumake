/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, ArrowRight, CheckCircle2, Award, Download, Users, FileText } from "lucide-react";
import { motion } from "motion/react";

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
}

export default function HomePage({ setCurrentTab }: HomePageProps) {
  const features = [
    {
      icon: <Award className="w-6 h-6 text-blue-600 dark:text-sky-400" />,
      title: "교육과정 성취 성취기준 연계",
      desc: "입력된 학년 및 과목 맞춤형으로 2022 개정 교육과정 수준의 학습 목표와 정교한 도달 기준을 도출합니다."
    },
    {
      icon: <FileText className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />,
      title: "도입-전개-정리 3단계 설계",
      desc: "5분 도입, 30분 동안 진행될 3단계 주요 배치 활동, 그리고 5분 요약 피드백으로 완성되는 밀도 높은 40분 시간 분배 가이드."
    },
    {
      icon: <Download className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />,
      title: "PDF 내보내기 & 즉시 인쇄",
      desc: "포맷 흐트러짐 없이 깔끔한 교과용 정밀 보고서 형식으로 제작되어 원클릭 PDF 출력 및 브라우저 프린트를 지원합니다."
    }
  ];

  const statistics = [
    { label: "누적 지도안 생성", value: "14,820건+" },
    { label: "사용 중인 현직 교사", value: "3,200명+" },
    { label: "AI 모델 추천율", value: "99.2%" },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-900/40 py-20 lg:py-28 text-center transition-colors">
        {/* Soft Decorative Ambient Circles */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-sky-200/20 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          {/* Tag */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-sky-300 text-xs font-bold mb-6 border border-blue-100 dark:border-blue-800/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-sky-300" />
            <span>수업 준비 시간의 무한한 단축</span>
          </motion.div>

          {/* Big Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight sm:leading-none max-w-3xl"
          >
            AI와 함께 만드는 <br />
            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-blue-400">수업 지도안</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed"
          >
            과목과 학년만 입력하면 수업 계획을 자동으로 생성합니다. <br className="hidden sm:inline" />
            초등 현장 기준에 최적화된 고품격 시나리오식 지도안을 지금 확인해 보세요.
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center w-full"
          >
            <button
              id="home-cta-start"
              onClick={() => setCurrentTab("generator")}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] transition-all cursor-pointer group"
            >
              시작하기
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              id="home-cta-library"
              onClick={() => setCurrentTab("library")}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-all"
            >
              우수 사례 보러가기
            </button>
          </motion.div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-20 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">수석교사의 가이드가 내장된 교육 전문 AI</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium">단순한 정보 수집을 넘어 실제 초등학교 현장에서 집행할 수 있는 정교한 수업 흐름을 설계합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, idx) => (
              <motion.div
                key={idx}
                id={`feature-card-${idx}`}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 flex items-center justify-center rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-blue-600 dark:text-sky-400">
                  <span>우수한 신뢰 규격 탑재</span>
                  <CheckCircle2 className="w-4 h-4 ml-1.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics / Numbers */}
      <section className="py-16 bg-blue-600 dark:bg-slate-900 border-y border-blue-700 dark:border-slate-800 text-white transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {statistics.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">{stat.value}</span>
                <span className="text-sm font-semibold text-blue-100 dark:text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer/Copyright note */}
      <footer className="mt-auto py-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-center text-xs text-slate-400 dark:text-slate-500">
        <p className="max-w-7xl mx-auto px-4">© 2026 EduPlan AI. designed for Elementary School Educators. All rights reserved.</p>
      </footer>
    </div>
  );
}
