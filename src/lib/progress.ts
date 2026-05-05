import { useEffect, useState, useCallback } from "react";
import { modules } from "./course-data";

const KEY = "fuelsense-progress-v1";

export type Progress = {
  completedLessons: Record<string, boolean>;
  quizScores: Record<string, { score: number; total: number }>; // by moduleId
  lastVisited?: { moduleId: string; lessonId: string };
};

const empty: Progress = { completedLessons: {}, quizScores: {} };

function read(): Progress {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

function write(p: Progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("fuelsense:progress"));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(empty);

  useEffect(() => {
    setProgress(read());
    const onChange = () => setProgress(read());
    window.addEventListener("fuelsense:progress", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("fuelsense:progress", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const markLessonComplete = useCallback((moduleId: string, lessonId: string) => {
    const p = read();
    p.completedLessons[`${moduleId}:${lessonId}`] = true;
    p.lastVisited = { moduleId, lessonId };
    write(p);
  }, []);

  const setLastVisited = useCallback((moduleId: string, lessonId: string) => {
    const p = read();
    p.lastVisited = { moduleId, lessonId };
    write(p);
  }, []);

  const saveQuiz = useCallback((moduleId: string, score: number, total: number) => {
    const p = read();
    const prev = p.quizScores[moduleId];
    if (!prev || score > prev.score) p.quizScores[moduleId] = { score, total };
    write(p);
  }, []);

  return { progress, markLessonComplete, setLastVisited, saveQuiz };
}

export function moduleProgress(p: Progress, moduleId: string) {
  const m = modules.find((x) => x.id === moduleId);
  if (!m) return 0;
  const done = m.lessons.filter((l) => p.completedLessons[`${m.id}:${l.id}`]).length;
  return Math.round((done / m.lessons.length) * 100);
}

export function isModuleComplete(p: Progress, moduleId: string) {
  return moduleProgress(p, moduleId) === 100;
}

export function isModuleUnlocked(p: Progress, moduleId: string) {
  const idx = modules.findIndex((m) => m.id === moduleId);
  if (idx <= 0) return true;
  return isModuleComplete(p, modules[idx - 1].id);
}

export function overallProgress(p: Progress) {
  const total = modules.reduce((a, m) => a + m.lessons.length, 0);
  const done = Object.values(p.completedLessons).filter(Boolean).length;
  return total ? Math.round((done / total) * 100) : 0;
}

export type Badge = { id: string; name: string; emoji: string; description: string; earned: boolean };

export function getBadges(p: Progress): Badge[] {
  return [
    { id: "beginner", name: "Beginner", emoji: "🌱", description: "Completed Module 1", earned: isModuleComplete(p, "m1") },
    { id: "explorer", name: "Nutrition Explorer", emoji: "🧭", description: "Completed Module 4", earned: isModuleComplete(p, "m4") },
    { id: "master", name: "Food Master", emoji: "🏆", description: "Completed full course", earned: modules.every((m) => isModuleComplete(p, m.id)) },
  ];
}
