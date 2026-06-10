/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, Sparkles, Sun, Moon, Menu, X, Landmark, GraduationCap } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({ currentTab, setCurrentTab, darkMode, setDarkMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "홈" },
    { id: "generator", label: "지도안 생성" },
    { id: "library", label: "자료실" },
    { id: "about", label: "소개" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setCurrentTab("home")} 
          className="flex items-center space-x-2.5 cursor-pointer group"
          id="header-logo"
        >
          <div className="p-2 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all duration-200">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center">
              EduPlan <span className="text-blue-600 dark:text-sky-400 ml-1 flex items-center gap-0.5">AI <Sparkles className="w-3.5 h-3.5 fill-blue-600 dark:fill-sky-400 animate-pulse" /></span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">초등 수업 지도안 생성기</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-1">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "text-blue-600 dark:text-sky-400" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator" 
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 dark:bg-sky-400 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section Tools */}
        <div className="flex items-center space-x-4">
          {/* Teacher Profile Info */}
          <div className="hidden md:flex items-center space-x-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-150 dark:border-slate-800 rounded-xl px-3 py-1.5">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">김교사 님</span>
            <div className="w-6 h-6 rounded-full bg-blue-600 text-[10px] text-white flex items-center justify-center font-extrabold shadow-sm">
              김
            </div>
          </div>

          {/* Dark Mode Switch */}
          <button
            id="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 hover:ring-slate-200 dark:hover:ring-slate-700 transition-all duration-200"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Start Button for Desktop */}
          <button
            id="header-start-btn"
            onClick={() => setCurrentTab("generator")}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-600 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] rounded-lg transition-all"
          >
            바로 생성하기
          </button>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1 transition-colors"
        >
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-mobile-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-blue-50 dark:bg-slate-800/80 text-blue-600 dark:text-sky-400" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setCurrentTab("generator");
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 flex justify-center items-center font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-lg shadow-md transition-colors text-sm"
            >
              시작하기
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
