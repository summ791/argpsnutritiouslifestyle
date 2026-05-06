import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

// ─── Types ───────────────────────────────────────────────────────────────────
type Lesson = {
  id: string;
  title: string;
  intro: string;
  points: string[];
  examples: string[];
  takeaway: string;
};

type QuizQuestion = {
  id: string;
  type: 'mcq' | 'tf' | 'scenario';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

type Module = {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
};

type Progress = {
  completedLessons: Record<string, boolean>;
  quizScores: Record<string, { score: number; total: number }>;
  lastVisited?: { moduleId: string; lessonId: string };
};

type FoodItem = {
  name: string;
  emoji: string;
  category: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type UserActivity = {
  course_name: string;
};

// ─── Course Data ─────────────────────────────────────────────────────────────
const modules: Module[] = [
  {
    id: 'm1', number: 1, title: 'Introduction to Food & Nutrition',
    description: 'Why food is fuel, not just taste — and how Tamil Nadu meals fit modern nutrition.',
    icon: '🌱',
    lessons: [
      {
        id: 'm1-l1', title: 'Food as Intelligent Fuel',
        intro: 'Food is more than what we eat — it shapes our energy, clarity, and long-term health. Tamil Nadu\'s traditional dishes already contain the wisdom of balanced nutrition.',
        points: ['Food provides energy, builds tissues, and protects the body', 'Sambar, rasam, poriyal, idli, dosa each have a nutritional role', 'Tamil Nadu cooking naturally balances grains, dals, and vegetables', 'Eating mindfully matters more than dieting'],
        examples: ['2 idlis + sambar = light, protein-rich breakfast (~250 kcal)', 'Rice + sambar + poriyal + curd = complete balanced lunch', 'Banana + handful of nuts = healthy mid-morning snack'],
        takeaway: "You don't need to give up tradition to eat well — you need to understand it.",
      },
      {
        id: 'm1-l2', title: 'Why This Approach Works',
        intro: 'Most nutrition books focus on foreign foods. This course focuses only on what Tamil Nadu families actually eat every day.',
        points: ['Real home-cooked dishes — not imported diets', 'Local fruits, millets, dals, and seafood', 'Realistic Indian serving sizes (1 cup, 1 dosa, 1 ladle)', 'Practical for students, homemakers, fitness lovers, elders'],
        examples: ['1 dosa (medium) ≈ 100–150 g', '2 idlis ≈ 100 g', '1 cup cooked rice ≈ 150 g'],
        takeaway: 'Nutrition is universal — but the food on your plate should feel like home.',
      },
    ],
    quiz: [
      { id: 'q1', type: 'mcq', question: 'What is the main purpose of food according to this course?', options: ['Only taste and pleasure', 'Intelligent fuel for body and mind', 'Just to fill the stomach', 'Cultural tradition only'], answer: 1, explanation: 'Food is intelligent fuel that powers energy, clarity and long-term wellness.' },
      { id: 'q2', type: 'tf', question: 'Tamil Nadu traditional meals can be naturally balanced.', options: ['True', 'False'], answer: 0, explanation: 'Rice + sambar + poriyal + curd already provides carbs, protein, fiber, and probiotics.' },
      { id: 'q3', type: 'mcq', question: 'Which of these is closest to one standard serving?', options: ['5 idlis', '2 idlis (~100 g)', '1 idli', '10 idlis'], answer: 1, explanation: '2 idlis ≈ 100 g is the standard household serving used throughout this course.' },
    ],
  },
  {
    id: 'm2', number: 2, title: 'Calories & Food Understanding',
    description: 'What calories really are and how to read any Tamil Nadu dish like a nutritionist.',
    icon: '🔥',
    lessons: [
      {
        id: 'm2-l1', title: 'What is a Calorie?',
        intro: 'A calorie is simply a unit of energy. Foods give us energy — some give a lot, some give a little. Knowing the difference helps you choose without restricting.',
        points: ['Calories = energy your body uses for everything', 'Carbs and protein = ~4 kcal/g, fat = ~9 kcal/g', 'Portion size changes calorie intake more than the food itself', 'Cooking method (fry vs steam) changes calorie count'],
        examples: ['1 idli (steamed) ≈ 50 kcal', '1 medium dosa ≈ 130 kcal', '1 ghee dosa ≈ 200+ kcal'],
        takeaway: 'Same dish, different portion or cooking = different calories. Awareness, not avoidance.',
      },
    ],
    quiz: [
      { id: 'q1', type: 'mcq', question: 'How many kcal per gram does fat provide?', options: ['4', '7', '9', '2'], answer: 2, explanation: 'Fat provides ~9 kcal/g, more than double carbs and protein.' },
      { id: 'q2', type: 'scenario', question: 'Priya eats 4 idlis with sambar. Roughly how many calories?', options: ['~100 kcal', '~250 kcal', '~500 kcal', '~1000 kcal'], answer: 1, explanation: '4 idlis (~200 kcal) + sambar (~50 kcal) ≈ 250 kcal — a light, balanced breakfast.' },
      { id: 'q3', type: 'tf', question: 'Cooking method does not affect calorie count.', options: ['True', 'False'], answer: 1, explanation: 'Frying adds oil and calories. A steamed idli vs ghee dosa can differ by 150+ kcal.' },
    ],
  },
  {
    id: 'm3', number: 3, title: 'Measurement & Portion Control',
    description: 'Estimate any meal without a weighing scale using household measures.',
    icon: '🥣',
    lessons: [
      {
        id: 'm3-l1', title: 'Household Measures',
        intro: 'You don\'t need a kitchen scale. Tamil Nadu households already have natural measures — cup, ladle, tumbler, plate.',
        points: ['1 cup cooked rice ≈ 150 g', '1 ladle sambar/kuzhambu ≈ 100 ml', '1 chapati ≈ 50–60 g', '1 tsp oil ≈ 5 g ≈ 45 kcal'],
        examples: ['Lunch plate: 1 cup rice + 1 ladle sambar + ½ cup poriyal', 'Snack: 1 tumbler buttermilk + 1 banana', 'Tip: Fill ½ plate with vegetables, ¼ rice, ¼ protein'],
        takeaway: 'Your hand and your plate are accurate enough. Consistency beats precision.',
      },
    ],
    quiz: [
      { id: 'q1', type: 'mcq', question: 'Approximately how much does 1 cup cooked rice weigh?', options: ['50 g', '100 g', '150 g', '300 g'], answer: 2, explanation: '1 cup cooked rice ≈ 150 g, the standard Tamil Nadu household serving.' },
      { id: 'q2', type: 'mcq', question: 'The "half plate vegetables" rule helps with…', options: ['More fiber and fewer calories', 'More fat', 'Less protein', 'More sugar'], answer: 0, explanation: 'Half-plate veggies = high fiber, more fullness, fewer calories naturally.' },
    ],
  },
  {
    id: 'm4', number: 4, title: 'Daily Nutritional Needs',
    description: 'How much energy and protein your body actually needs by age and activity.',
    icon: '⚖️',
    lessons: [
      {
        id: 'm4-l1', title: 'Calories & Protein by Activity',
        intro: 'Your daily needs depend on age, gender, and how active you are. There\'s no single right number — but there\'s a right range.',
        points: ['Sedentary adult woman: ~1800 kcal/day', 'Sedentary adult man: ~2200 kcal/day', 'Active person: +300–500 kcal extra', 'Protein minimum: 0.8 g × body weight (kg)', 'Active individuals: 1.2–1.6 g × body weight'],
        examples: ['60 kg woman, light activity ≈ 48 g protein/day', '70 kg man, gym goer ≈ 100 g protein/day', '1 cup dal + 2 idlis + 100 g chicken ≈ 35 g protein'],
        takeaway: 'Match your plate to your day — desk day or field day, your body knows the difference.',
      },
    ],
    quiz: [
      { id: 'q1', type: 'mcq', question: 'Minimum daily protein for a 60 kg adult?', options: ['20 g', '48 g', '100 g', '200 g'], answer: 1, explanation: '0.8 × 60 = 48 g/day minimum.' },
      { id: 'q2', type: 'tf', question: 'Active people need more protein than sedentary people.', options: ['True', 'False'], answer: 0, explanation: 'Active individuals need 1.2–1.6 g per kg body weight to repair and build tissue.' },
    ],
  },
  {
    id: 'm5', number: 5, title: 'Macronutrients & Micronutrients',
    description: 'Carbs, protein, fat — plus vitamins and minerals that quietly run the show.',
    icon: '🧬',
    lessons: [
      {
        id: 'm5-l1', title: 'The Big Three: Carbs, Protein, Fat',
        intro: 'Macronutrients give you energy and building blocks. Each plays a different role.',
        points: ['Carbs → main energy source (rice, millets, chapati, fruits)', 'Protein → repair, muscle, immunity (dal, eggs, fish, paneer)', 'Fat → hormones, brain, vitamin absorption (gingelly oil, coconut, ghee)', 'Fiber → digestion and blood sugar (vegetables, whole grains)'],
        examples: ['Carb-rich: rice, dosa, idli, chapati', 'Protein-rich: dal, sambar, eggs, fish curry, chicken', 'Healthy fats: gingelly oil, coconut, peanuts, almonds'],
        takeaway: 'Every meal should have all three: a grain, a protein, and a vegetable.',
      },
      {
        id: 'm5-l2', title: 'Vitamins & Minerals',
        intro: 'Micronutrients are needed in tiny amounts but make a huge difference to energy, immunity, and mood.',
        points: ['Iron → keerai (greens), dates, jaggery, lentils', 'Calcium → milk, curd, ragi, sesame', 'Vitamin C → guava, lemon, amla, gooseberry', 'Potassium → banana, coconut water, tomato'],
        examples: ['1 cup cooked keerai = strong iron + calcium', '1 guava = full day\'s vitamin C', '1 glass tender coconut water = natural electrolytes'],
        takeaway: 'Color your plate. Different colors = different micronutrients.',
      },
    ],
    quiz: [
      { id: 'q1', type: 'mcq', question: "Which is the body's main energy source?", options: ['Protein', 'Carbohydrates', 'Fiber', 'Water'], answer: 1, explanation: 'Carbs are the primary fuel — especially for brain and muscles.' },
      { id: 'q2', type: 'scenario', question: 'Ravi feels tired and his hemoglobin is low. Which Tamil Nadu food helps most?', options: ['White rice', 'Keerai (greens) with dal', 'Plain dosa', 'Sugar tea'], answer: 1, explanation: 'Keerai is iron-rich; combined with dal it boosts hemoglobin naturally.' },
      { id: 'q3', type: 'tf', question: 'Healthy fats like gingelly oil are important for the body.', options: ['True', 'False'], answer: 0, explanation: 'Healthy fats support hormones, brain function, and absorption of vitamins A, D, E, K.' },
    ],
  },
  {
    id: 'm6', number: 6, title: 'Tamil Nadu Food Guide',
    description: 'Calorie & nutrient values for the foods on your plate every day.',
    icon: '🌶️',
    lessons: [
      {
        id: 'm6-l1', title: 'Common Foods & Their Numbers',
        intro: 'Real values for real Tamil Nadu foods, in real serving sizes.',
        points: ['Banana (1 medium, 130 g): 60 kcal, 15 g carbs, 1.1 g protein', 'Watermelon (150 g): 45 kcal, 11 g carbs', 'Pineapple (150 g): 75 kcal, 19 g carbs', 'Beans (1 cup cooked): 45 kcal, high fiber', '1 dosa (medium): ~130 kcal', '2 idlis: ~100 kcal'],
        examples: ['Mango season: 1 medium mango ~150 kcal — enjoy, don\'t fear', 'Switch white rice for brown rice 2–3x/week for extra fiber'],
        takeaway: 'Numbers are guides, not rules. Use them to plan, not to panic.',
      },
    ],
    quiz: [
      { id: 'q1', type: 'mcq', question: 'Calories in 1 medium banana (130 g)?', options: ['~30', '~60', '~150', '~250'], answer: 1, explanation: '1 medium banana ≈ 60 kcal — perfect natural snack.' },
      { id: 'q2', type: 'mcq', question: 'Brown rice vs white rice mainly differs in…', options: ['Color only', 'Fiber content', 'Calories only', 'Taste only'], answer: 1, explanation: 'Brown rice keeps the bran — much more fiber and minerals than polished white rice.' },
    ],
  },
  {
    id: 'm7', number: 7, title: 'Real Meal Combinations',
    description: 'Build a balanced plate using real Tamil Nadu meals, not imported templates.',
    icon: '🍽️',
    lessons: [
      {
        id: 'm7-l1', title: 'Balanced Plate, Tamil Nadu Style',
        intro: 'Forget Western "protein bowls". Your sambar-sadam can already be a textbook balanced meal.',
        points: ['Breakfast: 2 idlis + sambar + 1 tsp coconut chutney (~300 kcal)', 'Lunch: 1 cup rice + 1 ladle sambar + ½ cup poriyal + ½ cup curd (~450 kcal)', 'Snack: 1 banana + handful peanuts (~200 kcal)', 'Dinner: 2 chapati + 1 cup dal + ½ cup vegetable curry (~400 kcal)'],
        examples: ['Light dinner option: 1 bowl rasam rice + poriyal', 'Higher protein lunch: add 1 boiled egg or 100 g fish curry', 'Millet swap: ragi dosa instead of rice dosa'],
        takeaway: 'Three components per meal: grain + protein + vegetable. That\'s it.',
      },
    ],
    quiz: [
      { id: 'q1', type: 'scenario', question: 'Which is the most balanced lunch?', options: ['2 cups rice + pickle', '1 cup rice + sambar + poriyal + curd', 'Only fruits', 'Only chicken biryani'], answer: 1, explanation: 'Rice + sambar + poriyal + curd covers carbs, protein, fiber, probiotics.' },
      { id: 'q2', type: 'tf', question: 'A balanced plate needs at least one Western superfood.', options: ['True', 'False'], answer: 1, explanation: 'Local foods like keerai, drumstick, ragi, and dal are already superfoods.' },
    ],
  },
  {
    id: 'm8', number: 8, title: 'Smart Eating System',
    description: 'Habits and frameworks to eat well for life — without dieting.',
    icon: '🌟',
    lessons: [
      {
        id: 'm8-l1', title: 'The Smart Eating Rules',
        intro: 'Sustainable nutrition isn\'t a 30-day plan. It\'s small rules you keep forever.',
        points: ['Eat slowly — your stomach signals fullness in ~20 minutes', 'Half-plate vegetables, always', 'Drink water before meals, not during, where possible', 'Don\'t skip meals — it leads to overeating later', 'Sweets are okay occasionally, not daily', 'Sleep and stress affect nutrition as much as food'],
        examples: ['Hotel meals: share biryani, add raita and salad', 'Festival food: enjoy, then return to normal next meal', 'Hydration: 2.5–3 L water/day for adults'],
        takeaway: 'Eat smart, not less. Tradition + awareness = lifelong wellness.',
      },
    ],
    quiz: [
      { id: 'q1', type: 'tf', question: 'Skipping meals is a healthy way to lose weight.', options: ['True', 'False'], answer: 1, explanation: 'Skipping leads to overeating later and slows metabolism.' },
      { id: 'q2', type: 'mcq', question: 'Recommended water intake for an adult?', options: ['0.5 L', '1 L', '2.5–3 L', '6 L'], answer: 2, explanation: 'About 2.5–3 L per day supports digestion, energy, and skin health.' },
      { id: 'q3', type: 'scenario', question: "You're invited to a festival biryani lunch. Smart approach?", options: ['Skip it entirely', 'Eat double to enjoy', 'Enjoy a normal portion with raita and salad, return to balanced eating next meal', 'Eat only rice without curry'], answer: 2, explanation: 'One meal won\'t undo health. Balance is built across days, not single meals.' },
    ],
  },
];

const foodItems: FoodItem[] = [
  { name: 'Idli', emoji: '🍥', category: 'Breakfast', serving: '1 piece (~50 g)', calories: 50, protein: 2, carbs: 10, fat: 0.2 },
  { name: 'Plain Dosa', emoji: '🥞', category: 'Breakfast', serving: '1 medium', calories: 130, protein: 3, carbs: 25, fat: 2 },
  { name: 'Masala Dosa', emoji: '🥞', category: 'Breakfast', serving: '1 medium', calories: 250, protein: 5, carbs: 40, fat: 8 },
  { name: 'Ghee Dosa', emoji: '🧈', category: 'Breakfast', serving: '1 medium', calories: 200, protein: 3, carbs: 25, fat: 9 },
  { name: 'Pongal', emoji: '🍚', category: 'Breakfast', serving: '1 cup', calories: 280, protein: 8, carbs: 45, fat: 7 },
  { name: 'Upma', emoji: '🥣', category: 'Breakfast', serving: '1 cup', calories: 220, protein: 5, carbs: 35, fat: 7 },
  { name: 'Vada', emoji: '🍩', category: 'Breakfast', serving: '1 piece', calories: 130, protein: 4, carbs: 15, fat: 6 },
  { name: 'White Rice', emoji: '🍚', category: 'Grains', serving: '1 cup cooked', calories: 200, protein: 4, carbs: 45, fat: 0.5 },
  { name: 'Brown Rice', emoji: '🌾', category: 'Grains', serving: '1 cup cooked', calories: 111, protein: 2.5, carbs: 23, fat: 1 },
  { name: 'Chapati', emoji: '🫓', category: 'Grains', serving: '1 piece (~50 g)', calories: 120, protein: 3, carbs: 20, fat: 3 },
  { name: 'Ragi Mudde', emoji: '🟤', category: 'Grains', serving: '1 ball', calories: 130, protein: 3, carbs: 27, fat: 1 },
  { name: 'Vegetable Biryani', emoji: '🍛', category: 'Grains', serving: '1 cup', calories: 320, protein: 7, carbs: 45, fat: 12 },
  { name: 'Chicken Biryani', emoji: '🍛', category: 'Grains', serving: '1 cup', calories: 400, protein: 18, carbs: 45, fat: 15 },
  { name: 'Sambar', emoji: '🍲', category: 'Curries & Dals', serving: '1 ladle (~100 ml)', calories: 80, protein: 4, carbs: 12, fat: 1.5 },
  { name: 'Rasam', emoji: '🍵', category: 'Curries & Dals', serving: '1 ladle', calories: 40, protein: 2, carbs: 7, fat: 0.5 },
  { name: 'Toor Dal', emoji: '🍛', category: 'Curries & Dals', serving: '1 cup', calories: 180, protein: 12, carbs: 24, fat: 4 },
  { name: 'Moong Dal', emoji: '🥘', category: 'Curries & Dals', serving: '1 cup', calories: 160, protein: 13, carbs: 22, fat: 2 },
  { name: 'Kuzhambu', emoji: '🍲', category: 'Curries & Dals', serving: '1 ladle', calories: 100, protein: 4, carbs: 12, fat: 4 },
  { name: 'Chicken Curry', emoji: '🍗', category: 'Non-Veg', serving: '100 g', calories: 220, protein: 22, carbs: 5, fat: 12 },
  { name: 'Grilled Chicken', emoji: '🍗', category: 'Non-Veg', serving: '100 g', calories: 165, protein: 31, carbs: 0, fat: 4 },
  { name: 'Fish Curry', emoji: '🐟', category: 'Non-Veg', serving: '100 g', calories: 170, protein: 20, carbs: 4, fat: 8 },
  { name: 'Boiled Egg', emoji: '🥚', category: 'Non-Veg', serving: '1 large', calories: 70, protein: 6, carbs: 0.5, fat: 5 },
  { name: 'Prawn Curry', emoji: '🦐', category: 'Non-Veg', serving: '100 g', calories: 160, protein: 22, carbs: 5, fat: 6 },
  { name: 'Beans Poriyal', emoji: '🫛', category: 'Vegetables', serving: '½ cup', calories: 60, protein: 2, carbs: 8, fat: 2 },
  { name: 'Keerai (Greens)', emoji: '🥬', category: 'Vegetables', serving: '1 cup cooked', calories: 50, protein: 4, carbs: 7, fat: 1 },
  { name: 'Drumstick Sambar', emoji: '🌿', category: 'Vegetables', serving: '1 ladle', calories: 90, protein: 4, carbs: 12, fat: 2 },
  { name: 'Avial', emoji: '🥗', category: 'Vegetables', serving: '1 cup', calories: 150, protein: 4, carbs: 12, fat: 10 },
  { name: 'Brinjal Curry', emoji: '🍆', category: 'Vegetables', serving: '½ cup', calories: 90, protein: 2, carbs: 10, fat: 5 },
  { name: 'Banana', emoji: '🍌', category: 'Fruits', serving: '1 medium (~130 g)', calories: 60, protein: 1, carbs: 15, fat: 0.1 },
  { name: 'Mango', emoji: '🥭', category: 'Fruits', serving: '1 medium', calories: 150, protein: 1.5, carbs: 38, fat: 0.6 },
  { name: 'Guava', emoji: '🍐', category: 'Fruits', serving: '1 medium', calories: 70, protein: 2.5, carbs: 15, fat: 1 },
  { name: 'Watermelon', emoji: '🍉', category: 'Fruits', serving: '150 g', calories: 45, protein: 1, carbs: 11, fat: 0.2 },
  { name: 'Peanuts', emoji: '🥜', category: 'Snacks', serving: '30 g', calories: 170, protein: 7, carbs: 5, fat: 14 },
  { name: 'Roasted Chana', emoji: '🟡', category: 'Snacks', serving: '30 g', calories: 110, protein: 6, carbs: 18, fat: 2 },
  { name: 'Sundal', emoji: '🥗', category: 'Snacks', serving: '½ cup', calories: 130, protein: 7, carbs: 18, fat: 3 },
  { name: 'Curd', emoji: '🥛', category: 'Dairy', serving: '½ cup', calories: 60, protein: 4, carbs: 5, fat: 3 },
  { name: 'Buttermilk', emoji: '🥛', category: 'Dairy', serving: '1 glass', calories: 40, protein: 3, carbs: 5, fat: 1 },
  { name: 'Milk (toned)', emoji: '🥛', category: 'Dairy', serving: '1 glass', calories: 120, protein: 6, carbs: 12, fat: 5 },
  { name: 'Paneer', emoji: '🧀', category: 'Dairy', serving: '50 g', calories: 130, protein: 9, carbs: 2, fat: 10 },
  { name: 'Filter Coffee', emoji: '☕', category: 'Beverages', serving: '1 cup with sugar', calories: 80, protein: 3, carbs: 10, fat: 3 },
  { name: 'Tender Coconut Water', emoji: '🥥', category: 'Beverages', serving: '1 glass', calories: 45, protein: 1.5, carbs: 9, fat: 0.5 },
];

// ─── Progress Helpers ─────────────────────────────────────────────────────────
const PROGRESS_KEY = 'fuelsense-progress-v1';
const emptyProgress: Progress = { completedLessons: {}, quizScores: {} };

function readProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? { ...emptyProgress, ...JSON.parse(raw) } : emptyProgress;
  } catch { return emptyProgress; }
}

function writeProgress(p: Progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function moduleProgressPct(p: Progress, moduleId: string) {
  const m = modules.find(x => x.id === moduleId);
  if (!m) return 0;
  const done = m.lessons.filter(l => p.completedLessons[`${m.id}:${l.id}`]).length;
  return Math.round((done / m.lessons.length) * 100);
}

function isModuleComplete(p: Progress, moduleId: string) {
  return moduleProgressPct(p, moduleId) === 100;
}

function isModuleUnlocked(p: Progress, moduleId: string) {
  const idx = modules.findIndex(m => m.id === moduleId);
  if (idx <= 0) return true;
  return isModuleComplete(p, modules[idx - 1].id);
}

function overallProgressPct(p: Progress) {
  const total = modules.reduce((a, m) => a + m.lessons.length, 0);
  const done = Object.values(p.completedLessons).filter(Boolean).length;
  return total ? Math.round((done / total) * 100) : 0;
}

function getUserDisplayName(user: User) {
  const name = user.user_metadata?.full_name;
  return typeof name === 'string' && name.trim() ? name : user.email ?? 'Course member';
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-primary-100">
      <div
        className="h-full rounded-full bg-primary-600 transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────
function CourseLoginCard({ onAuthSuccess }: { onAuthSuccess: (user: User | null) => void }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'google' | 'send-otp' | 'verify-otp' | null>(null);
  const [message, setMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const resetStatus = () => {
    setMessage('');
  };

  const signInWithGoogle = async () => {
    resetStatus();
    setLoadingAction('google');

    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (googleError) {
      setMessage(googleError.message);
      setLoadingAction(null);
    }
  };

  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setResendCooldown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [resendCooldown]);

  const sendOtp = async () => {
    if (loadingAction === 'send-otp' || resendCooldown > 0) {
      return;
    }

    setLoadingAction('send-otp');

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true
      }
    });

    if (error) {
      console.error(error);
      alert(error.message);
      setResendCooldown(0);
    } else {
      setShowOtp(true);
      alert('OTP sent successfully');
      setResendCooldown(60);
    }

    setLoadingAction(null);
  };

  const verifyOtp = async () => {
    setLoadingAction('verify-otp');

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: 'signup'
    });

    if (error) {
      console.error(error);
      alert(error.message);
      setLoadingAction(null);
      return;
    } else {
      onAuthSuccess(data.user);
      alert('Login successful');
      window.location.href = '/';
    }

    setLoadingAction(null);
  };

  const isLoading = loadingAction !== null;

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-primary-100 bg-white p-6 shadow-xl md:p-8">
      <div className="mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Courses</p>
        <h1 className="mt-2 font-serif text-2xl font-bold text-primary-900">Login to access courses</h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Log in to access ARGPS Nutritious Lifestyle courses and save your learning activity.
        </p>
      </div>

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={isLoading}
        className="mb-5 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 text-xs font-black text-blue-600">
          G
        </span>
        {loadingAction === 'google' ? 'Connecting...' : 'Sign in with Google'}
      </button>

      <form className="space-y-3">
        <label htmlFor="course-email" className="block text-sm font-semibold text-gray-700">
          Email
        </label>
        <input
          id="course-email"
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        <button
          type="button"
          onClick={sendOtp}
          disabled={isLoading || !email || resendCooldown > 0}
          className="w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAction === 'send-otp'
            ? 'Sending OTP...'
            : resendCooldown > 0
            ? `Resend OTP in ${resendCooldown}s`
            : showOtp
            ? 'Resend OTP'
            : 'Send OTP'}
        </button>
      </form>

      {showOtp && (
        <form
          onSubmit={event => {
            event.preventDefault();
            void verifyOtp();
          }}
          className="mt-5 space-y-3"
        >
          <label htmlFor="course-otp" className="block text-sm font-semibold text-gray-700">
            OTP
          </label>
          <input
            id="course-otp"
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={event => setOtp(event.target.value)}
            required
            placeholder="Enter OTP"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={isLoading || !otp}
            className="w-full rounded-lg border border-primary-200 px-4 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAction === 'verify-otp' ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {message && <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">{message}</p>}
    </div>
  );
}

type View =
  | { type: 'overview' }
  | { type: 'lesson'; moduleId: string; lessonId: string }
  | { type: 'quiz'; moduleId: string }
  | { type: 'meal-builder' };

// ─── Lesson View ──────────────────────────────────────────────────────────────
function LessonView({
  moduleId, lessonId, progress, onComplete, onBack, onNext,
}: {
  moduleId: string; lessonId: string; progress: Progress;
  onComplete: () => void; onBack: () => void;
  onNext: (mid: string, lid: string) => void;
}) {
  const mod = modules.find(m => m.id === moduleId)!;
  const lesson = mod.lessons.find(l => l.id === lessonId)!;
  const isCompleted = !!progress.completedLessons[`${moduleId}:${lessonId}`];

  // find next lesson/module
  const allLessons: { moduleId: string; lessonId: string }[] = [];
  modules.forEach(m => m.lessons.forEach(l => allLessons.push({ moduleId: m.id, lessonId: l.id })));
  const idx = allLessons.findIndex(x => x.moduleId === moduleId && x.lessonId === lessonId);
  const nextLesson = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 mb-6 font-medium">
        ← Back to modules
      </button>

      <div className="bg-primary-50 rounded-2xl px-5 py-3 mb-6 text-sm font-medium text-primary-700">
        {mod.icon} Module {mod.number}: {mod.title}
      </div>

      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
      <p className="text-gray-600 leading-relaxed mb-8">{lesson.intro}</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 text-lg">Key Points</h2>
        <ul className="space-y-3">
          {lesson.points.map((pt, i) => (
            <li key={i} className="flex gap-3 text-gray-700">
              <span className="text-primary-500 mt-0.5 shrink-0">✓</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 mb-6">
        <h2 className="font-semibold text-amber-900 mb-4 text-lg">🍛 Real Tamil Nadu Examples</h2>
        <ul className="space-y-2">
          {lesson.examples.map((ex, i) => (
            <li key={i} className="text-amber-800 text-sm">{ex}</li>
          ))}
        </ul>
      </div>

      <div className="bg-primary-600 rounded-2xl p-6 mb-8 text-white">
        <div className="text-xs uppercase tracking-widest opacity-70 mb-2">Takeaway</div>
        <p className="font-medium leading-relaxed">{lesson.takeaway}</p>
      </div>

      {!isCompleted && (
        <button
          onClick={onComplete}
          className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors mb-3"
        >
          ✓ Mark as Complete
        </button>
      )}
      {isCompleted && nextLesson && (
        <button
          onClick={() => onNext(nextLesson.moduleId, nextLesson.lessonId)}
          className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors mb-3"
        >
          Next Lesson →
        </button>
      )}
      {isCompleted && !nextLesson && (
        <div className="text-center py-4 text-green-600 font-semibold">🎉 Course Complete!</div>
      )}
    </div>
  );
}

// ─── Quiz View ────────────────────────────────────────────────────────────────
function QuizView({
  moduleId, progress, onSave, onBack,
}: {
  moduleId: string; progress: Progress;
  onSave: (score: number, total: number) => void; onBack: () => void;
}) {
  const mod = modules.find(m => m.id === moduleId)!;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? mod.quiz.filter(q => answers[q.id] === q.answer).length
    : 0;

  function submit() {
    setSubmitted(true);
    onSave(score, mod.quiz.length);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 mb-6 font-medium">
        ← Back to modules
      </button>

      <div className="bg-primary-50 rounded-2xl px-5 py-3 mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          {mod.icon} Module {mod.number} Quiz
        </h1>
        <p className="text-gray-600 text-sm mt-1">{mod.quiz.length} questions</p>
      </div>

      {submitted && (
        <div className={`rounded-2xl p-6 mb-8 text-center ${score >= Math.ceil(mod.quiz.length * 0.7) ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className="text-4xl mb-2">{score >= Math.ceil(mod.quiz.length * 0.7) ? '🎉' : '📚'}</div>
          <div className="text-2xl font-bold text-gray-900">{score}/{mod.quiz.length}</div>
          <div className="text-gray-600 mt-1">
            {score >= Math.ceil(mod.quiz.length * 0.7) ? 'Well done!' : 'Keep studying and try again!'}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {mod.quiz.map((q, qi) => {
          const selected = answers[q.id];
          const isCorrect = selected === q.answer;
          return (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex gap-3 mb-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-bold">
                  {qi + 1}
                </span>
                <p className="font-medium text-gray-900">{q.question}</p>
              </div>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  let cls = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ';
                  if (!submitted) {
                    cls += selected === oi
                      ? 'border-primary-500 bg-primary-50 text-primary-800'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 text-gray-700';
                  } else {
                    if (oi === q.answer) cls += 'border-green-400 bg-green-50 text-green-800';
                    else if (oi === selected && !isCorrect) cls += 'border-red-300 bg-red-50 text-red-700';
                    else cls += 'border-gray-200 text-gray-500';
                  }
                  return (
                    <button key={oi} className={cls} disabled={submitted}
                      onClick={() => setAnswers(a => ({ ...a, [q.id]: oi }))}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="mt-4 text-sm bg-blue-50 rounded-xl p-3 text-blue-800">
                  💡 {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={submit}
          disabled={Object.keys(answers).length < mod.quiz.length}
          className="w-full mt-8 bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Submit Quiz
        </button>
      )}
      {submitted && (
        <button onClick={onBack} className="w-full mt-8 border border-primary-300 text-primary-700 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
          ← Back to Modules
        </button>
      )}
    </div>
  );
}

// ─── Meal Builder View ────────────────────────────────────────────────────────
function MealBuilderView({ onBack }: { onBack: () => void }) {
  const categories = [...new Set(foodItems.map(f => f.category))];
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [meal, setMeal] = useState<{ item: FoodItem; qty: number }[]>([]);

  const filtered = foodItems.filter(f => {
    const matchCat = selectedCat === 'All' || f.category === selectedCat;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totals = meal.reduce(
    (acc, { item, qty }) => ({
      calories: acc.calories + item.calories * qty,
      protein: acc.protein + item.protein * qty,
      carbs: acc.carbs + item.carbs * qty,
      fat: acc.fat + item.fat * qty,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  function addItem(item: FoodItem) {
    setMeal(m => {
      const ex = m.find(x => x.item.name === item.name);
      if (ex) return m.map(x => x.item.name === item.name ? { ...x, qty: x.qty + 1 } : x);
      return [...m, { item, qty: 1 }];
    });
  }

  function removeItem(name: string) {
    setMeal(m => m.filter(x => x.item.name !== name));
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 mb-6 font-medium">
        ← Back to modules
      </button>
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">🍽️ Meal Builder</h1>
      <p className="text-gray-500 mb-8">Build your Tamil Nadu meal and see its nutrition breakdown.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Food picker */}
        <div className="lg:col-span-2">
          <div className="flex gap-2 mb-4">
            <input
              type="text" placeholder="Search food…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {['All', ...categories].map(cat => (
              <button key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCat === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {filtered.map(item => (
              <button key={item.name}
                onClick={() => addItem(item)}
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 text-left hover:border-primary-300 hover:bg-primary-50 transition-all shadow-sm">
                <span className="text-2xl">{item.emoji}</span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.serving}</div>
                  <div className="text-xs text-primary-600 font-medium">{item.calories} kcal</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Meal summary */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Your Meal</h2>
            {meal.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Add foods to build your meal</p>
            ) : (
              <>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {meal.map(({ item, qty }) => (
                    <div key={item.name} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-700 truncate">{item.emoji} {item.name} ×{qty}</span>
                      <button onClick={() => removeItem(item.name)} className="text-red-400 hover:text-red-600 text-xs shrink-0">✕</button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  {[
                    { label: 'Calories', val: Math.round(totals.calories), unit: 'kcal', color: 'text-orange-600' },
                    { label: 'Protein', val: Math.round(totals.protein * 10) / 10, unit: 'g', color: 'text-blue-600' },
                    { label: 'Carbs', val: Math.round(totals.carbs * 10) / 10, unit: 'g', color: 'text-amber-600' },
                    { label: 'Fat', val: Math.round(totals.fat * 10) / 10, unit: 'g', color: 'text-purple-600' },
                  ].map(({ label, val, unit, color }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className={`font-semibold ${color}`}>{val}{unit}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setMeal([])}
                  className="w-full mt-4 text-sm border border-gray-200 text-gray-500 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                  Clear meal
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Overview (Module List) ───────────────────────────────────────────────────
function OverviewView({
  progress,
  startedCourses,
  onStartLesson,
  onStartQuiz,
  onMealBuilder,
}: {
  progress: Progress;
  startedCourses: Set<string>;
  onStartLesson: (mod: Module) => void;
  onStartQuiz: (mid: string) => void;
  onMealBuilder: () => void;
}) {
  const overall = overallProgressPct(progress);

  return (
    <div>
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 md:p-12 mb-10 text-white">
        <p className="text-xs uppercase tracking-widest opacity-70 mb-2">🌱 Tamil Nadu Nutrition Course</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
          The Art of Human <span className="italic opacity-90">FuelSense</span>
        </h1>
        <p className="text-primary-100 max-w-lg mb-8 text-lg leading-relaxed">
          Practical nutrition rooted in Tamil Nadu food. No diets, no restrictions — just understanding the food you already love.
        </p>
        {overall > 0 && (
          <div className="max-w-sm">
            <div className="flex justify-between text-xs mb-2 opacity-80">
              <span>Your progress</span><span>{overall}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${overall}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        {progress.lastVisited && (
          <button
            onClick={() => {
              const mod = modules.find(item => item.id === progress.lastVisited?.moduleId);
              if (mod) onStartLesson(mod);
            }}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary-700 transition-colors">
            ▶ Resume Learning
          </button>
        )}
        <button
          onClick={onMealBuilder}
          className="border border-primary-300 text-primary-700 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary-50 transition-colors">
          🍽️ Meal Builder
        </button>
      </div>

      {/* Why unique */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {[
          { icon: '🍛', title: 'Real Tamil Nadu food', body: 'Idli, dosa, sambar, kuzhambu, biryani — in cups, ladles, and plates you actually use.' },
          { icon: '📐', title: 'Practical & realistic', body: 'No weighing scales. Estimate any meal using household measures and your hand.' },
          { icon: '🧠', title: 'Science meets tradition', body: 'Modern nutrition principles applied to traditional, time-tested local foods.' },
        ].map(f => (
          <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <div className="font-semibold text-gray-900 mb-1">{f.title}</div>
            <div className="text-sm text-gray-500">{f.body}</div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>
      <div className="grid md:grid-cols-2 gap-5">
        {modules.map(mod => {
          const pct = moduleProgressPct(progress, mod.id);
          const unlocked = isModuleUnlocked(progress, mod.id);
          const done = isModuleComplete(progress, mod.id);
          const quizScore = progress.quizScores[mod.id];
          const hasStarted = startedCourses.has(mod.title);

          return (
            <div
              key={mod.id}
              className={`bg-white rounded-2xl border shadow-sm p-6 transition-all ${unlocked ? 'border-gray-100 hover:-translate-y-0.5 hover:shadow-md' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 flex items-center justify-center rounded-xl text-2xl ${done ? 'bg-primary-600 text-white' : 'bg-primary-50'}`}>
                    {done ? '✓' : mod.icon}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Module {mod.number}</div>
                    <h3 className="font-semibold text-gray-900">{mod.title}</h3>
                  </div>
                </div>
                {!unlocked && <span className="text-gray-300 text-xl">🔒</span>}
              </div>

              <p className="text-sm text-gray-500 mb-4">{mod.description}</p>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>{mod.lessons.length} lesson{mod.lessons.length > 1 ? 's' : ''}</span>
                  <span>{pct}%</span>
                </div>
                <ProgressBar value={pct} />
              </div>

              {quizScore && (
                <div className="text-xs text-gray-400 mb-4">
                  Quiz: {quizScore.score}/{quizScore.total} correct
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {unlocked ? (
                  <button
                    onClick={() => onStartLesson(mod)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-primary-700 transition-colors">
                    {hasStarted || pct > 0 ? 'Continue Course' : 'Start Course'}
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">Complete previous module to unlock</span>
                )}
                {pct === 100 && (
                  <button
                    onClick={() => onStartQuiz(mod.id)}
                    className="border border-primary-300 text-primary-700 px-4 py-2 rounded-full text-xs font-semibold hover:bg-primary-50 transition-colors">
                    {quizScore ? 'Retake Quiz' : 'Take Quiz'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Courses Page ────────────────────────────────────────────────────────
export const Courses: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState('');
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [startedCourses, setStartedCourses] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [view, setView] = useState<View>({ type: 'overview' });

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (error) {
        setActivityError(error.message);
      }

      setUser(data.user);
      setAuthLoading(false);
    };

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setView({ type: 'overview' });
      setActivityError('');
      if (!session?.user) {
        setStartedCourses(new Set());
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const fetchActivity = async () => {
      setActivityLoading(true);
      setActivityError('');

      const { data, error } = await supabase
        .from('app_progress')
        .select('*')
        .eq('user_id', user.id);

      if (!isMounted) return;

      if (error) {
        setActivityError(error.message);
      } else {
        const rows = (data ?? []) as UserActivity[];
        setStartedCourses(new Set(rows.map(row => row.course_name)));
      }

      setActivityLoading(false);
    };

    void fetchActivity();

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    setProgress(readProgress());
    const onChange = () => setProgress(readProgress());
    window.addEventListener('fuelsense:progress', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('fuelsense:progress', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const markComplete = useCallback((moduleId: string, lessonId: string) => {
    const p = readProgress();
    p.completedLessons[`${moduleId}:${lessonId}`] = true;
    p.lastVisited = { moduleId, lessonId };
    writeProgress(p);
    setProgress({ ...p });
  }, []);

  const saveQuiz = useCallback((moduleId: string, score: number, total: number) => {
    const p = readProgress();
    const prev = p.quizScores[moduleId];
    if (!prev || score > prev.score) p.quizScores[moduleId] = { score, total };
    writeProgress(p);
    setProgress({ ...p });
  }, []);

  const goToLesson = (mid: string, lid: string) => {
    const p = readProgress();
    p.lastVisited = { moduleId: mid, lessonId: lid };
    writeProgress(p);
    setProgress({ ...p });
    setView({ type: 'lesson', moduleId: mid, lessonId: lid });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startCourse = async (mod: Module) => {
    if (!user) return;

    setActivityError('');

    if (!startedCourses.has(mod.title)) {
      const { error } = await supabase.from('app_progress').insert([
        {
          user_id: user.id,
          course_name: mod.title,
          progress: 'Started',
        },
      ]);

      if (error) {
        setActivityError(error.message);
        return;
      }

      setStartedCourses(previous => new Set(previous).add(mod.title));
    }

    goToLesson(mod.id, mod.lessons[0].id);
  };

  const logout = async () => {
    setLogoutLoading(true);
    setActivityError('');

    const { error } = await supabase.auth.signOut();

    if (error) {
      setActivityError(error.message);
    } else {
      setUser(null);
      setStartedCourses(new Set());
    }

    setLogoutLoading(false);
  };

  if (authLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="rounded-2xl border border-primary-100 bg-primary-50 p-8 text-center font-semibold text-primary-900">
          Loading courses...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <CourseLoginCard onAuthSuccess={setUser} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-primary-100 bg-primary-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Signed in</p>
          <p className="mt-1 text-sm font-semibold text-primary-950">{getUserDisplayName(user)}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          disabled={logoutLoading}
          className="rounded-lg border border-primary-200 bg-white px-4 py-2 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {logoutLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {activityLoading && (
        <p className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
          Loading your course activity...
        </p>
      )}

      {activityError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {activityError}
        </p>
      )}

      {view.type === 'overview' && (
        <OverviewView
          progress={progress}
          startedCourses={startedCourses}
          onStartLesson={startCourse}
          onStartQuiz={mid => { setView({ type: 'quiz', moduleId: mid }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onMealBuilder={() => { setView({ type: 'meal-builder' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      )}
      {view.type === 'lesson' && (
        <LessonView
          moduleId={view.moduleId}
          lessonId={view.lessonId}
          progress={progress}
          onBack={() => setView({ type: 'overview' })}
          onComplete={() => markComplete(view.moduleId, view.lessonId)}
          onNext={(mid, lid) => goToLesson(mid, lid)}
        />
      )}
      {view.type === 'quiz' && (
        <QuizView
          moduleId={view.moduleId}
          progress={progress}
          onSave={(score, total) => saveQuiz(view.moduleId, score, total)}
          onBack={() => setView({ type: 'overview' })}
        />
      )}
      {view.type === 'meal-builder' && (
        <MealBuilderView onBack={() => setView({ type: 'overview' })} />
      )}
    </div>
  );
};
