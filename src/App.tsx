/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import GeneratorPage from "./components/GeneratorPage";
import LibraryPage from "./components/LibraryPage";
import AboutPage from "./components/AboutPage";
import { LibraryItem } from "./types";

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>("home");

  // Darkmode State
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Import bridge from Library to Creator Workspace
  const [importedPlan, setImportedPlan] = useState<LibraryItem | null>(null);

  // Favorites state (list of plan/library IDs)
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load configuration and states from localStorage of client
  useEffect(() => {
    // 1. Dark Mode
    const savedTheme = localStorage.getItem("eduplan_theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    } else if (savedTheme === "light") {
      setDarkMode(false);
    } else {
      // Default to systems preference
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      if (media.matches) {
        setDarkMode(true);
      }
    }

    // 2. Favorites List
    const savedFavs = localStorage.getItem("eduplan_favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Save Theme preference
  useEffect(() => {
    localStorage.setItem("eduplan_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((fId) => fId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("eduplan_favorites", JSON.stringify(updated));
  };

  // Import Plan Callback
  const handleImportPlan = (item: LibraryItem) => {
    setImportedPlan(item);
    setCurrentTab("generator");
  };

  const handleClearImportedPlan = () => {
    setImportedPlan(null);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-250">
        
        {/* Navigation Header */}
        <Header 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
        />

        {/* Selected Component Display Frame */}
        <main className="relative">
          {currentTab === "home" && (
            <HomePage setCurrentTab={setCurrentTab} />
          )}

          {currentTab === "generator" && (
            <GeneratorPage 
              importedPlan={importedPlan} 
              clearImportedPlan={handleClearImportedPlan} 
              favorites={favorites}
              toggleFavorite={handleToggleFavorite}
            />
          )}

          {currentTab === "library" && (
            <LibraryPage 
              onImportPlan={handleImportPlan} 
              favorites={favorites}
              toggleFavorite={handleToggleFavorite}
            />
          )}

          {currentTab === "about" && (
            <AboutPage />
          )}
        </main>

      </div>
    </div>
  );
}
