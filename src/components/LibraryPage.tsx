/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Download, Edit3, ArrowUpRight, GraduationCap, FileCheck, Check, Heart } from "lucide-react";
import { LibraryItem, LessonPlan } from "../types";
import { initialLibraryItems } from "../data/library";
import { motion, AnimatePresence } from "motion/react";

interface LibraryPageProps {
  onImportPlan: (item: LibraryItem) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function LibraryPage({ onImportPlan, favorites, toggleFavorite }: LibraryPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("전체");
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);

  const subjects = ["전체", "국어", "수학", "사회", "과학", "음악", "미술", "체육"];

  const filteredItems = initialLibraryItems.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.goal.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === "전체" || item.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  const handleDownload = (item: LibraryItem) => {
    // Generate educational text file format of the lesson plan for offline use
    const content = `===========================================
수업 지도안 (EduPlan AI 우수 수업안)
===========================================
[기본 계획 정보]
학년: ${item.grade} | 과목: ${item.subject}
단원명: ${item.unit} | 차시: ${item.period}

[학습 목표 (수석교사 감검안)]
${item.refinedGoal}

[수업 전개 시간 및 세부 활동 지표]

1. 도입 (5분)
${item.introduction}

2. 전개 (30분)
- 활동 1:
${item.development1}

- 활동 2:
${item.development2}

- 활동 3:
${item.development3}

3. 정리 (5분)
${item.summary}

-------------------------------------------
■ 수업용 준비물: ${item.materials}
■ 배움 및 평가 방법: ${item.assessment}
■ 기대 성취 역량: ${item.expectation}
===========================================
본 자료는 EduPlan AI에서 추출한 고품격 공식 수업 약안입니다.
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `[지도안]_${item.subject}_${item.unit.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show temporary download check status
    setDownloadedItem(item.id);
    setTimeout(() => {
      setDownloadedItem(null);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Description */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
            지능형 우수 자료실
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
            전국의 수석교사들과 EduPlan AI 유저들이 공동 검증한 최고급 수업 지도안과 참고 양식들을 탐색하세요.
          </p>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 mb-8">
        {/* Search Input Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="library-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="단원명, 키워드, 학습 목표로 탐색하기..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-400 font-medium text-slate-900 dark:text-white"
          />
        </div>

        {/* Subject Filter Pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {subjects.map((sub) => {
            const isSelected = selectedSubject === sub;
            return (
              <button
                key={sub}
                id={`filter-pill-${sub}`}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full cursor-pointer transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10 dark:bg-sky-500"
                    : "bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 hover:bg-slate-100"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const isFav = favorites.includes(item.id);
            return (
              <motion.article
                key={item.id}
                id={`library-item-${item.id}`}
                layout
                className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Visual Category Accent */}
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 dark:bg-sky-500" />

                <div>
                  {/* Top Badge Card Meta */}
                  <div className="flex items-center justify-between mb-4 pl-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-sky-300">
                        {item.grade}
                      </span>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                        {item.subject}
                      </span>
                    </div>
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isFav
                          ? "bg-rose-50 text-rose-500 border-rose-200 dark:bg-rose-900/10 dark:border-rose-900"
                          : "bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                      }`}
                      title={isFav ? "즐겨찾기 취소" : "즐겨찾기 추가"}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Title and Scope info */}
                  <h3 className="text-base font-bold text-slate-950 dark:text-white mb-2 pl-2 tracking-tight line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <div className="space-y-1 px-2 mb-6">
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-1">
                      <span className="text-slate-400 dark:text-slate-500">단원명:</span> {item.unit} ({item.period}차시)
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal line-clamp-3">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">기존 목표:</span> {item.goal}
                    </p>
                  </div>
                </div>

                {/* Operations segment */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto flex items-center justify-between gap-2.5 pl-2">
                  <button
                    id={`lib-download-${item.id}`}
                    onClick={() => handleDownload(item)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                      downloadedItem === item.id
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border-slate-250 dark:border-slate-700"
                    }`}
                  >
                    {downloadedItem === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        다운로드 완료
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        수업자료 다운로드
                      </>
                    )}
                  </button>

                  <button
                    id={`lib-import-${item.id}`}
                    onClick={() => onImportPlan(item)}
                    className="py-2 px-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white rounded-lg shadow-sm flex items-center gap-1 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    편집
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-300 mb-1">검색 조건에 해당 자료가 없습니다.</h2>
          <p className="text-sm text-slate-500 dark:text-slate-500">단어 철자나 분류 필터를 변경하여 다시 찾아보세요.</p>
        </div>
      )}
    </div>
  );
}
