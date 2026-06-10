/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Printer, 
  Download, 
  Heart, 
  Clock, 
  BookOpen, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw, 
  ChevronRight,
  GraduationCap,
  Calendar,
  AlertCircle,
  AlertOctagon,
  Award
} from "lucide-react";
import { LessonPlanInput, LessonPlan, LibraryItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface GeneratorPageProps {
  importedPlan: any;
  clearImportedPlan: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function GeneratorPage({ 
  importedPlan, 
  clearImportedPlan, 
  favorites, 
  toggleFavorite 
}: GeneratorPageProps) {
  // Input form state
  const [grade, setGrade] = useState("3학년");
  const [subject, setSubject] = useState("수학");
  const [unit, setUnit] = useState("");
  const [period, setPeriod] = useState("1/4");
  const [duration, setDuration] = useState("40분");
  const [goal, setGoal] = useState("");

  // Loading & Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Active compiled plan state
  const [activePlan, setActivePlan] = useState<LessonPlan | null>(null);
  
  // History list from localStorage
  const [recentPlans, setRecentPlans] = useState<LessonPlan[]>([]);

  // Editing state for specific plan items
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<LessonPlan | null>(null);

  // References
  const printableRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("eduplan_history");
    if (saved) {
      try {
        setRecentPlans(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Handle Imported Plans (from Library)
  useEffect(() => {
    if (importedPlan) {
      // populate forms
      setGrade(importedPlan.grade);
      setSubject(importedPlan.subject);
      setUnit(importedPlan.unit);
      setPeriod(importedPlan.period);
      setDuration("40분");
      setGoal(importedPlan.goal);

      // set active plan directly
      const mappedPlan: LessonPlan = {
        id: importedPlan.id || `plan-${Date.now()}`,
        grade: importedPlan.grade,
        subject: importedPlan.subject,
        unit: importedPlan.unit,
        period: importedPlan.period,
        duration: "40분",
        refinedGoal: importedPlan.refinedGoal,
        introduction: importedPlan.introduction,
        development1: importedPlan.development1,
        development2: importedPlan.development2,
        development3: importedPlan.development3,
        summary: importedPlan.summary,
        materials: importedPlan.materials,
        assessment: importedPlan.assessment,
        expectation: importedPlan.expectation,
        createdAt: new Date().toISOString(),
        isFavorite: favorites.includes(importedPlan.id)
      };

      setActivePlan(mappedPlan);
      setEditedPlan(JSON.parse(JSON.stringify(mappedPlan)));
      clearImportedPlan();
    }
  }, [importedPlan]);

  // Loading step simulation ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Save history to localStorage helper
  const saveToHistory = (newPlan: LessonPlan) => {
    const updated = [newPlan, ...recentPlans.filter(p => p.id !== newPlan.id)].slice(0, 15);
    setRecentPlans(updated);
    localStorage.setItem("eduplan_history", JSON.stringify(updated));
  };

  // Delete plan from history
  const handleDeletePlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentPlans.filter(p => p.id !== id);
    setRecentPlans(updated);
    localStorage.setItem("eduplan_history", JSON.stringify(updated));
    if (activePlan?.id === id) {
      setActivePlan(null);
      setEditedPlan(null);
    }
  };

  // Submit and call AI endpoint
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unit.trim()) {
      setErrorMessage("단원명을 입력해 주세요.");
      return;
    }
    if (!goal.trim()) {
      setErrorMessage("학습 목표를 입력해 주세요.");
      return;
    }

    setErrorMessage("");
    setIsGenerating(true);
    setLoadingStep(0);
    setActivePlan(null);

    try {
      const response = await fetch("/api/generate-lesson-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          subject,
          unit,
          period,
          duration,
          goal
        })
      });

      if (!response.ok) {
        throw new Error("서버에서 수업 지도안을 생성하는 도중 오류가 발생했습니다.");
      }

      const parsedData = await response.json();
      
      const newPlan: LessonPlan = {
        id: `plan-${Date.now()}`,
        grade,
        subject,
        unit,
        period,
        duration,
        refinedGoal: parsedData.refinedGoal,
        introduction: parsedData.introduction,
        development1: parsedData.development1,
        development2: parsedData.development2,
        development3: parsedData.development3,
        summary: parsedData.summary,
        materials: parsedData.materials,
        assessment: parsedData.assessment,
        expectation: parsedData.expectation,
        createdAt: new Date().toISOString(),
        isFavorite: false
      };

      setActivePlan(newPlan);
      setEditedPlan(JSON.parse(JSON.stringify(newPlan)));
      saveToHistory(newPlan);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "지도안 생성 중 문제가 발생했습니다. API가 정상 등록되어 있는지 확인해 주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Dynamic Loading Indicators messages
  const loadingMessages = [
    "초등학교 교육 성취기준 풀(Pool) 분석 중...",
    "동취유발과 전시학습 중심의 인트로 도입부 설계 중...",
    "교수발문 및 모둠 협동수행 중심의 3단계 전개활동 수립 중...",
    "학교 현장 맞춤형 평가 준거 및 준비물 세트 선정 중...",
    "수행성취 지도안의 보고서 규격 다듬는 중..."
  ];

  // Save edits inline
  const handleSaveEdits = () => {
    if (!editedPlan) return;
    setActivePlan(editedPlan);
    // save updated to recent plans
    const updated = recentPlans.map(p => p.id === editedPlan.id ? editedPlan : p);
    setRecentPlans(updated);
    localStorage.setItem("eduplan_history", JSON.stringify(updated));
    setIsEditing(false);
  };

  // Reset/Cancel edits
  const handleCancelEdits = () => {
    if (activePlan) {
      setEditedPlan(JSON.parse(JSON.stringify(activePlan)));
    }
    setIsEditing(false);
  };

  // Direct print action using clean @media styles
  const handlePrint = () => {
    window.print();
  };

  // Export as text file format
  const handleExportText = () => {
    if (!activePlan) return;
    const plan = activePlan;
    const content = `===========================================
[EduPlan AI] 초등학교 수업 지도안
===========================================
■ 학년: ${plan.grade}
■ 과목: ${plan.subject}
■ 단원: ${plan.unit}
■ 차시: ${plan.period}차시 (${plan.duration})

-------------------------------------------
[학습 목표]
${plan.refinedGoal}

-------------------------------------------
[도입 (5분)]
${plan.introduction}

-------------------------------------------
[전개 (30분)]
1단계:
${plan.development1}

2단계:
${plan.development2}

3단계:
${plan.development3}

-------------------------------------------
[정리 (5분)]
${plan.summary}

-------------------------------------------
■ 준비물:
${plan.materials}

■ 평가 방법:
${plan.assessment}

■ 기대 효과:
${plan.expectation}

===========================================
작성일시: ${new Date(plan.createdAt).toLocaleString()}
EduPlan AI 수업 지도안 자동화 서비스
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `수업지도안_${plan.subject}_${plan.unit.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* CSS print override inline specifically for high-quality printing of the compiled plan */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px !important;
            border: none !important;
            box-shadow: none !important;
          }
          /* Hide editing / buttons entirely in printed forms */
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* Bento Grid Header Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch print-hidden mb-6">
        {/* Hero Banner Bento Block */}
        <div className="lg:col-span-9 bg-gradient-to-br from-blue-50 to-white dark:from-slate-900/40 dark:to-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-center border-l-4 border-l-blue-600 dark:border-l-sky-500 shadow-sm transition-colors duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-sky-400 uppercase tracking-widest block mb-1">EDUPLAN AI WORKSPACE</span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">AI와 함께 만드는 초등 수업 지도안</h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">학년과 과목만 선택하세요. 교육 현장 기준과 2022 개정안을 준수한 정교한 계획을 즉시 생성해 드립니다.</p>
            </div>
            <div className="hidden sm:block p-3.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-sky-350">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Today's Trend Bento Block */}
        <div className="lg:col-span-3 bg-slate-900 text-white rounded-2xl border border-slate-850 dark:border-slate-800 p-6 flex flex-col justify-between shadow-md transition-colors duration-200">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">오늘의 교육 트렌드</div>
            <h4 className="text-sm font-bold text-white mb-1.5 leading-snug line-clamp-1">2026 디지털 교과서 가이드</h4>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-medium">AI 맞춤 교수학습법 핵심 정리를 통해 개별 학생 성취기준 맞춤 도달을 유도합니다.</p>
          </div>
          <div className="text-[10px] text-sky-400 font-bold mt-2 hover:underline cursor-pointer flex items-center gap-0.5">
            자세히 보기 <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Inputs Panel */}
        <section className="lg:col-span-3 print-hidden space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors duration-200">
            <div className="flex items-center space-x-2 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">지도안 설정</h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Grade Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">학년 선택</label>
                <div className="grid grid-cols-3 gap-2">
                  {["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      id={`grade-btn-${g}`}
                      onClick={() => setGrade(g)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        grade === g
                          ? "bg-blue-600 border-blue-600 text-white shadow-sm dark:bg-sky-500 dark:border-sky-500"
                          : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">과목 선택</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["국어", "수학", "사회", "과학", "음악", "미술", "체육"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      id={`subject-btn-${s}`}
                      onClick={() => setSubject(s)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        subject === s
                          ? "bg-blue-600 border-blue-600 text-white shadow-sm dark:bg-sky-500 dark:border-sky-500"
                          : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Unit Input Name */}
              <div>
                <label htmlFor="unit-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">단원명 입력</label>
                <input
                  id="unit-input"
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="예: 3. 나눗셈 / 2. 동물의 한살이"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Period & Duration on row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="period-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">차시 입력</label>
                  <input
                    id="period-input"
                    type="text"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="예: 1/4"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="duration-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">수업 시간</label>
                  <input
                    id="duration-input"
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="예: 40분"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Learning Goal Base */}
              <div>
                <label htmlFor="goal-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">학습 목표 입력</label>
                <textarea
                  id="goal-input"
                  rows={3}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="예: 나눗셈의 원리를 이해하고 문제를 풀 수 있도록 유도한다. (기본 아이디어만 적으셔도 무방합니다)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-955 border border-rose-105 flex items-start gap-2 text-rose-600 dark:text-rose-350 text-xs font-medium leading-tight">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="generate-plan-btn"
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-bold rounded-xl shadow-md cursor-pointer active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                지도안 생성
              </button>
            </form>
          </div>
        </section>

        {/* Center Section: Compiled Result Panel */}
        <section className="lg:col-span-6 space-y-6 min-h-[500px] relative">
          <AnimatePresence mode="wait">
            
            {/* Status 1: Initial Empty Instruction Panel */}
            {!activePlan && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 py-24 px-8 text-center print-hidden flex flex-col justify-center items-center h-full transition-colors duration-200"
              >
                <div className="p-4 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-sky-400 mb-6 shadow-inner">
                  <GraduationCap className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">수업 계획 준비 완료</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  왼쪽 항목창에 해당 학년과 과목을 지정하여 단원 목표를 생성해 보세요. 2022 개정 과정에 따른 디테일한 차시 약안이 즉각 설계됩니다.
                </p>
                
                {/* Visual tips */}
                <div className="flex flex-wrap gap-2 justify-center mt-8 max-w-md">
                  <span className="text-[11px] font-semibold text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 border border-slate-150 dark:border-slate-700/60 rounded-full">✓ 메타 평가지표 안내</span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 border border-slate-150 dark:border-slate-700/60 rounded-full">✓ 단계별 시나리오 활동</span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 border border-slate-150 dark:border-slate-700/60 rounded-full">✓ 커스텀 편집 보완</span>
                </div>
              </motion.div>
            )}

            {/* Status 2: Processing AI loading view */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center print-hidden flex flex-col justify-center items-center py-28 transition-colors duration-200"
              >
                {/* Advanced Pulsing Loader */}
                <div className="relative mb-8">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-105 border-t-blue-600 dark:border-slate-800 dark:border-t-sky-400 animate-spin" />
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-sky-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                </div>

                <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-3">초등교육형 AI 수업 분석 설계사 가동 중</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                  현직 수석교사의 학습 검증 모델에 의거하여 고품격 교수-학습안을 구성하고 있습니다. 잠시만 가라앉혀 주십시오.
                </p>

                {/* Simulated Steps Ticker */}
                <div className="w-full max-w-md space-y-2 text-left bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-150 dark:border-slate-700">
                  {loadingMessages.map((msg, idx) => {
                    const isDone = loadingStep > idx;
                    const isCurrent = loadingStep === idx;
                    return (
                      <div key={idx} className="flex items-center space-x-2 text-xs">
                        {isDone ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">✓</div>
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700" />
                        )}
                        <span className={`font-semibold ${
                          isDone 
                            ? "text-emerald-600 dark:text-emerald-400" 
                            : isCurrent 
                              ? "text-blue-600 dark:text-sky-400" 
                              : "text-slate-400"
                        }`}>
                          {msg}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Status 3: Interactive Lesson Plan Document Print Card Layout */}
            {activePlan && !isGenerating && editedPlan && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Result Control Toolbar on top */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-805 px-5 py-3 rounded-xl flex items-center justify-between print-hidden flex-wrap gap-2 transition-colors">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      작성완료: {new Date(activePlan.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Favorite Switcher */}
                    <button
                      onClick={() => toggleFavorite(activePlan.id)}
                      className={`p-2 rounded-lg border flex items-center gap-1.5 text-xs font-bold transition-all ${
                        favorites.includes(activePlan.id)
                          ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800"
                          : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                      title="중요 지도안 즐겨찾기 보관"
                    >
                      <Heart className={`w-3.5 h-3.5 ${favorites.includes(activePlan.id) ? "fill-current" : ""}`} />
                      즐겨찾기
                    </button>

                    {/* Inline Content Editor Trigger */}
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEdits}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-705 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          저장
                        </button>
                        <button
                          onClick={handleCancelEdits}
                          className="px-3.5 py-2 bg-slate-200 hover:bg-slate-250 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        수정하기
                      </button>
                    )}

                    {/* Text Export & Print */}
                    <button
                      onClick={handleExportText}
                      className="p-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                      title="텍스트 파일 저장"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handlePrint}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-bold rounded-lg text-xs shadow-md flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      PDF / 인쇄
                    </button>
                  </div>
                </div>

                {/* Standard Lesson Plan Document Card */}
                <div 
                  id="print-area"
                  ref={printableRef}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md p-8 text-left transition-colors relative"
                >
                  {/* Decorative School Form Header Title */}
                  <div className="border-b-4 border-double border-slate-400 pb-5 mb-8 text-center">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono tracking-wider print-hidden block mb-1">
                      EduPlan AI 교수·학습 계획안
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-sans tracking-wide">
                      수  업  지  도  안
                    </h1>
                  </div>

                  {/* Standard Form Matrix Panel */}
                  <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-slate-300 dark:border-slate-700 mb-8 text-sm text-slate-900 dark:text-slate-100 font-medium">
                    <div className="bg-slate-50 dark:bg-slate-800/80 p-3 border-r border-b border-slate-300 dark:border-slate-700 font-bold text-center">학년</div>
                    <div className="p-3 border-r border-b border-slate-300 dark:border-slate-700 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedPlan.grade}
                          onChange={(e) => setEditedPlan({...editedPlan, grade: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-center border rounded px-1 text-xs"
                        />
                      ) : activePlan.grade}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/80 p-3 border-r border-b border-slate-300 dark:border-slate-700 font-bold text-center">과목</div>
                    <div className="p-3 border-r border-b border-slate-300 dark:border-slate-700 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedPlan.subject}
                          onChange={(e) => setEditedPlan({...editedPlan, subject: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-center border rounded px-1 text-xs"
                        />
                      ) : activePlan.subject}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/80 p-3 border-r border-b border-slate-300 dark:border-slate-700 font-bold text-center">단원명</div>
                    <div className="p-3 border-r border-b border-slate-300 dark:border-slate-700 text-center col-span-1 md:col-span-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedPlan.unit}
                          onChange={(e) => setEditedPlan({...editedPlan, unit: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-800 border rounded px-1"
                        />
                      ) : activePlan.unit}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/80 p-3 border-r border-b border-slate-300 dark:border-slate-700 font-bold text-center">차시</div>
                    <div className="p-3 border-r border-b border-slate-300 dark:border-slate-700 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedPlan.period}
                          onChange={(e) => setEditedPlan({...editedPlan, period: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-center border rounded px-1 text-xs"
                        />
                      ) : activePlan.period} 차시</div>

                    <div className="bg-slate-50 dark:bg-slate-800/80 p-3 border-r border-b border-slate-300 dark:border-slate-700 font-bold text-center">수업시간</div>
                    <div className="p-3 border-r border-b border-slate-300 dark:border-slate-700 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedPlan.duration}
                          onChange={(e) => setEditedPlan({...editedPlan, duration: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-center border rounded px-1 text-xs"
                        />
                      ) : activePlan.duration}
                    </div>
                  </div>

                  {/* 1. 학습 목표 */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-blue-600 dark:border-sky-500 pl-2.5 mb-2.5">
                      학습 목표 (구체화된 학습 목표)
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl text-sm leading-relaxed border border-slate-150 dark:border-slate-800 inline-editing-wrapper">
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={editedPlan.refinedGoal}
                          onChange={(e) => setEditedPlan({...editedPlan, refinedGoal: e.target.value})}
                          className="w-full bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded text-sm"
                        />
                      ) : (
                        <p className="text-slate-800 dark:text-slate-200 font-bold whitespace-pre-wrap">{activePlan.refinedGoal}</p>
                      )}
                    </div>
                  </div>

                  {/* 2. 도입부 */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-blue-600 dark:border-sky-500 pl-2.5 mb-2.5">
                      도입 (5분) - 도입 활동 제안
                    </h3>
                    <div className="p-4 rounded-xl text-sm leading-relaxed border border-slate-150 dark:border-slate-800 bg-emerald-50/20 dark:bg-slate-800/20">
                      {isEditing ? (
                        <textarea
                          rows={4}
                          value={editedPlan.introduction}
                          onChange={(e) => setEditedPlan({...editedPlan, introduction: e.target.value})}
                          className="w-full bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded text-sm"
                        />
                      ) : (
                        <div className="text-slate-800 dark:text-slate-300 whitespace-pre-wrap">{activePlan.introduction}</div>
                      )}
                    </div>
                  </div>

                  {/* 3. 전개부 (3단계) */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-blue-600 dark:border-sky-500 pl-2.5 mb-2.5">
                      전개 (30분) - 전개 활동 3단계 구성 (활동 시나리오)
                    </h3>
                    <div className="space-y-4">
                      {/* Step 1 */}
                      <div className="p-4 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-150 dark:border-slate-800">
                        <span className="inline-block text-[10px] font-bold tracking-tight text-blue-605 bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-100 dark:border-slate-700 mb-2">
                          1단계. 배움의 발견 및 기본개념 이해
                        </span>
                        {isEditing ? (
                          <textarea
                            rows={4}
                            value={editedPlan.development1}
                            onChange={(e) => setEditedPlan({...editedPlan, development1: e.target.value})}
                            className="w-full bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded text-xs"
                          />
                        ) : (
                          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 whitespace-pre-wrap">{activePlan.development1}</div>
                        )}
                      </div>

                      {/* Step 2 */}
                      <div className="p-4 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-150 dark:border-slate-800">
                        <span className="inline-block text-[10px] font-bold tracking-tight text-blue-605 bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-100 dark:border-slate-700 mb-2">
                          2단계. 학생 주도 개별 실무 및 모둠 협업 활동
                        </span>
                        {isEditing ? (
                          <textarea
                            rows={4}
                            value={editedPlan.development2}
                            onChange={(e) => setEditedPlan({...editedPlan, development2: e.target.value})}
                            className="w-full bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded text-xs"
                          />
                        ) : (
                          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 whitespace-pre-wrap">{activePlan.development2}</div>
                        )}
                      </div>

                      {/* Step 3 */}
                      <div className="p-4 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-150 dark:border-slate-800">
                        <span className="inline-block text-[10px] font-bold tracking-tight text-blue-605 bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-100 dark:border-slate-700 mb-2">
                          3단계. 생활 적용, 제작 산출물, 또는 심화 문제해결
                        </span>
                        {isEditing ? (
                          <textarea
                            rows={4}
                            value={editedPlan.development3}
                            onChange={(e) => setEditedPlan({...editedPlan, development3: e.target.value})}
                            className="w-full bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded text-xs"
                          />
                        ) : (
                          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 whitespace-pre-wrap">{activePlan.development3}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4. 정리부 */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-blue-600 dark:border-sky-500 pl-2.5 mb-2.5">
                      정리 (5분) - 배움 정리 및 성찰 활동
                    </h3>
                    <div className="p-4 rounded-xl text-sm leading-relaxed border border-slate-150 dark:border-slate-800 bg-indigo-50/20 dark:bg-slate-800/20">
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={editedPlan.summary}
                          onChange={(e) => setEditedPlan({...editedPlan, summary: e.target.value})}
                          className="w-full bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded text-sm"
                        />
                      ) : (
                        <div className="text-slate-800 dark:text-slate-300 whitespace-pre-wrap">{activePlan.summary}</div>
                      )}
                    </div>
                  </div>

                  {/* 5. 준비물 */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-blue-600 dark:border-sky-500 pl-2.5 mb-2.5">
                      준비물 (수업용 교구 및 기자재)
                    </h3>
                    <div className="p-4 rounded-xl text-xs sm:text-sm leading-relaxed border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={editedPlan.materials}
                          onChange={(e) => setEditedPlan({...editedPlan, materials: e.target.value})}
                          className="w-full bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded text-xs animate-none"
                        />
                      ) : (
                        <p className="text-slate-800 dark:text-slate-350">{activePlan.materials}</p>
                      )}
                    </div>
                  </div>

                  {/* 6. 평가 방법 */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-blue-600 dark:border-sky-500 pl-2.5 mb-2.5">
                      평가 방법 및 형성평가 가이드제안
                    </h3>
                    <div className="p-4 rounded-xl text-xs sm:text-sm leading-relaxed border border-slate-150 dark:border-slate-800 bg-rose-50/10 dark:bg-slate-800/10">
                      {isEditing ? (
                        <textarea
                          rows={4}
                          value={editedPlan.assessment}
                          onChange={(e) => setEditedPlan({...editedPlan, assessment: e.target.value})}
                          className="w-full bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded text-xs"
                        />
                      ) : (
                        <div className="text-slate-800 dark:text-slate-300 whitespace-pre-wrap">{activePlan.assessment}</div>
                      )}
                    </div>
                  </div>

                  {/* 7. 기대 효과 */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-blue-600 dark:border-sky-500 pl-2.5 mb-2.5">
                      기대 효과 (수업 후 성취역량 도달)
                    </h3>
                    <div className="p-4 rounded-xl text-xs sm:text-sm leading-relaxed border border-slate-150 dark:border-slate-800 bg-emerald-50/10 dark:bg-slate-800/10">
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={editedPlan.expectation}
                          onChange={(e) => setEditedPlan({...editedPlan, expectation: e.target.value})}
                          className="w-full bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded text-xs"
                        />
                      ) : (
                        <p className="text-slate-800 dark:text-slate-300">{activePlan.expectation}</p>
                      )}
                    </div>
                  </div>

                  {/* Tiny Verification stamp at the bottom of the printed map document */}
                  <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>EduPlan AI 정밀 지능인증 | 약안 보고서</span>
                    <span>학교 수업 제출 검증안</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </section>

        {/* Right Side: Bento Sidebar (Recent Plans & Resource Hub) */}
        <section className="lg:col-span-3 print-hidden space-y-6">
          {/* History / Recent Plans Item Rail */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors duration-200">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-400 mb-4 flex items-center gap-1.5 uppercase tracking-wider text-xs">
              <Clock className="w-4 h-4 text-slate-400" />
              최근 생성 지도안 ({recentPlans.length})
            </h3>

            {recentPlans.length > 0 ? (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {recentPlans.map((p) => (
                  <div
                    key={p.id}
                    id={`recent-plan-${p.id}`}
                    onClick={() => {
                      setActivePlan(p);
                      setEditedPlan(JSON.parse(JSON.stringify(p)));
                      setIsEditing(false);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-left ${
                      activePlan?.id === p.id
                        ? "bg-blue-50 border-blue-200 dark:bg-slate-800 dark:border-slate-700"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-150 dark:bg-slate-900 dark:hover:bg-slate-800/80 dark:border-slate-800"
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center space-x-1.5 mb-0.5">
                        <span className="text-[9px] font-extrabold bg-blue-100 dark:bg-slate-850 text-blue-700 dark:text-sky-400 px-1.5 py-0.5 rounded">
                          {p.grade}
                        </span>
                        <span className="text-[9px] font-extrabold bg-emerald-105 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                          {p.subject}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          {p.period}차시
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{p.unit}</h4>
                    </div>
                    
                    {/* Delete item */}
                    <button
                      onClick={(e) => handleDeletePlan(p.id, e)}
                      className="p-1 px-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
                      title="학습기록 지우기"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
                아직 생성된 기록이 없습니다. <br />첫 지도안을 만들어 보세요!
              </div>
            )}
          </div>

          {/* Classroom Resource Hub (Bento Style) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors duration-200 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-400 mb-4 flex items-center gap-1.5 uppercase tracking-wider text-xs">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              수업 자료실
            </h3>
            
            <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[140px] hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer">
              <span className="text-3xl">📁</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">관련 PPT / 교구 검색하기</span>
              <span className="text-[10px] text-slate-450 dark:text-slate-500 max-w-[160px]">차시에 즉각 연동하는 고화질 프레젠테이션 연계</span>
            </div>

            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-amber-800 dark:text-amber-400 rounded-xl flex items-start gap-2 text-[11px] leading-relaxed font-semibold">
              <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>이번 차시 실험 안전 지도 및 안전 사고 예방 특별 영상자료 수석교사 게시판 추천 완료되었습니다.</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
