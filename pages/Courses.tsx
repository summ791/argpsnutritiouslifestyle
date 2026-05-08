import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Check,
  CircleUserRound,
  Home,
  KeyRound,
  Lock,
  Mail,
  Sparkles,
  ShieldCheck,
  Trophy,
  UserPlus,
  Utensils,
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import {
  ensureAppUserProfile,
  isProfileComplete,
  updateAuthProfile,
  upsertAppUserProfile,
  type AppUserProfile,
} from '../services/auth';

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
  quizScores: Record<string, { score: number; total: number; passed?: boolean }>;
  completedModules?: Record<string, boolean>;
  unlockedModules?: Record<string, boolean>;
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

type FoodVisual = {
  icon: string;
  label: string;
  badge?: string;
};

type UserActivity = {
  id?: string;
  course_name: string;
  progress?: string | null;
};

const LOGO_URL = 'https://raw.githubusercontent.com/summ791/argpsapp2/main/logo.jpg';

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
  { name: 'Mutton Biryani', emoji: 'MB', category: 'Biryani', serving: '1 cup', calories: 480, protein: 22, carbs: 48, fat: 22 },
  { name: 'Fish Biryani', emoji: 'FB', category: 'Biryani', serving: '1 cup', calories: 430, protein: 21, carbs: 46, fat: 16 },
  { name: 'Prawn Biryani', emoji: 'PB', category: 'Biryani', serving: '1 cup', calories: 420, protein: 24, carbs: 45, fat: 15 },
  { name: 'Mushroom Biryani', emoji: 'VB', category: 'Biryani', serving: '1 cup', calories: 340, protein: 8, carbs: 48, fat: 11 },
  { name: 'Egg Biryani', emoji: 'EB', category: 'Biryani', serving: '1 cup', calories: 390, protein: 15, carbs: 46, fat: 15 },
  { name: 'Chicken 65', emoji: 'CS', category: 'Starters', serving: '100 g', calories: 290, protein: 23, carbs: 8, fat: 18 },
  { name: 'Pepper Chicken', emoji: 'CS', category: 'Starters', serving: '100 g', calories: 230, protein: 25, carbs: 5, fat: 12 },
  { name: 'Mutton Chukka', emoji: 'MS', category: 'Starters', serving: '100 g', calories: 310, protein: 24, carbs: 4, fat: 22 },
  { name: 'Mutton Pepper Fry', emoji: 'MS', category: 'Starters', serving: '100 g', calories: 285, protein: 25, carbs: 5, fat: 18 },
  { name: 'Fish Fry', emoji: 'FS', category: 'Starters', serving: '1 piece (~100 g)', calories: 240, protein: 22, carbs: 6, fat: 14 },
  { name: 'Nethili Fry', emoji: 'FS', category: 'Starters', serving: '100 g', calories: 260, protein: 24, carbs: 7, fat: 15 },
  { name: 'Prawn Varuval', emoji: 'PS', category: 'Starters', serving: '100 g', calories: 220, protein: 25, carbs: 6, fat: 10 },
  { name: 'Kambu Koozh', emoji: 'TN', category: 'Traditional', serving: '1 bowl', calories: 180, protein: 5, carbs: 36, fat: 2 },
  { name: 'Ragi Kali', emoji: 'TN', category: 'Traditional', serving: '1 ball', calories: 170, protein: 4, carbs: 35, fat: 1.5 },
  { name: 'Kothu Parotta', emoji: 'TN', category: 'Traditional', serving: '1 plate', calories: 520, protein: 14, carbs: 68, fat: 20 },
  { name: 'Lemon Rice', emoji: 'RV', category: 'Rice Varieties', serving: '1 cup', calories: 280, protein: 5, carbs: 42, fat: 10 },
  { name: 'Tomato Rice', emoji: 'RV', category: 'Rice Varieties', serving: '1 cup', calories: 260, protein: 5, carbs: 44, fat: 7 },
  { name: 'Curd Rice', emoji: 'RV', category: 'Rice Varieties', serving: '1 cup', calories: 240, protein: 7, carbs: 38, fat: 6 },
  { name: 'Tamarind Rice', emoji: 'RV', category: 'Rice Varieties', serving: '1 cup', calories: 300, protein: 6, carbs: 48, fat: 9 },
  { name: 'Millet Dosa', emoji: 'HF', category: 'Healthy Foods', serving: '1 medium', calories: 120, protein: 4, carbs: 22, fat: 2 },
  { name: 'Sprouts Sundal', emoji: 'HF', category: 'Healthy Foods', serving: '1/2 cup', calories: 110, protein: 8, carbs: 16, fat: 2 },
  { name: 'Vegetable Kurma', emoji: 'CY', category: 'Curries & Dals', serving: '1 cup', calories: 180, protein: 5, carbs: 18, fat: 10 },
  { name: 'Chettinad Chicken Curry', emoji: 'NV', category: 'Non-Veg', serving: '100 g', calories: 250, protein: 23, carbs: 6, fat: 15 },
  { name: 'Mutton Curry', emoji: 'NV', category: 'Non-Veg', serving: '100 g', calories: 280, protein: 22, carbs: 5, fat: 19 },
  { name: 'Filter Coffee', emoji: '☕', category: 'Beverages', serving: '1 cup with sugar', calories: 80, protein: 3, carbs: 10, fat: 3 },
  { name: 'Tender Coconut Water', emoji: '🥥', category: 'Beverages', serving: '1 glass', calories: 45, protein: 1.5, carbs: 9, fat: 0.5 },
  { name: 'Paneer Butter Masala', emoji: 'PBM', category: 'Paneer Dishes', serving: '1 cup', calories: 360, protein: 14, carbs: 14, fat: 28 },
  { name: 'Palak Paneer', emoji: 'PP', category: 'Paneer Dishes', serving: '1 cup', calories: 280, protein: 15, carbs: 10, fat: 20 },
  { name: 'Kadai Paneer', emoji: 'KP', category: 'Paneer Dishes', serving: '1 cup', calories: 320, protein: 15, carbs: 13, fat: 24 },
  { name: 'Paneer Tikka', emoji: 'PT', category: 'Paneer Dishes', serving: '100 g', calories: 260, protein: 16, carbs: 8, fat: 18 },
  { name: 'Naan', emoji: 'NA', category: 'Naan & Breads', serving: '1 piece', calories: 260, protein: 8, carbs: 44, fat: 6 },
  { name: 'Butter Naan', emoji: 'BN', category: 'Naan & Breads', serving: '1 piece', calories: 320, protein: 8, carbs: 45, fat: 12 },
  { name: 'Garlic Naan', emoji: 'GN', category: 'Naan & Breads', serving: '1 piece', calories: 300, protein: 8, carbs: 46, fat: 9 },
  { name: 'Veg Pizza', emoji: 'VP', category: 'Fast Food', serving: '2 slices', calories: 420, protein: 16, carbs: 54, fat: 16 },
  { name: 'Chicken Pizza', emoji: 'CP', category: 'Fast Food', serving: '2 slices', calories: 480, protein: 24, carbs: 52, fat: 20 },
  { name: 'Veg Burger', emoji: 'VB', category: 'Fast Food', serving: '1 burger', calories: 360, protein: 10, carbs: 48, fat: 14 },
  { name: 'Chicken Burger', emoji: 'CB', category: 'Fast Food', serving: '1 burger', calories: 450, protein: 24, carbs: 44, fat: 20 },
  { name: 'French Fries', emoji: 'FF', category: 'Fast Food', serving: '1 medium', calories: 320, protein: 4, carbs: 42, fat: 15 },
  { name: 'Chicken Shawarma', emoji: 'SW', category: 'Restaurant Dishes', serving: '1 roll', calories: 420, protein: 25, carbs: 40, fat: 18 },
  { name: 'Veg Fried Rice', emoji: 'VFR', category: 'Restaurant Dishes', serving: '1 plate', calories: 380, protein: 9, carbs: 58, fat: 12 },
  { name: 'Chicken Fried Rice', emoji: 'CFR', category: 'Restaurant Dishes', serving: '1 plate', calories: 480, protein: 24, carbs: 58, fat: 16 },
  { name: 'Gobi Manchurian', emoji: 'GM', category: 'Restaurant Dishes', serving: '1 cup', calories: 300, protein: 6, carbs: 36, fat: 14 },
  { name: 'Chilli Chicken', emoji: 'CC', category: 'Restaurant Dishes', serving: '100 g', calories: 280, protein: 24, carbs: 12, fat: 15 },
  { name: 'Adai', emoji: 'AD', category: 'Additional Tamil Nadu', serving: '1 medium', calories: 180, protein: 8, carbs: 28, fat: 4 },
  { name: 'Kuzhi Paniyaram', emoji: 'KP', category: 'Additional Tamil Nadu', serving: '6 pieces', calories: 220, protein: 6, carbs: 36, fat: 6 },
  { name: 'Appam', emoji: 'AP', category: 'Additional Tamil Nadu', serving: '2 pieces', calories: 240, protein: 5, carbs: 48, fat: 3 },
  { name: 'Idiyappam', emoji: 'IDY', category: 'Additional Tamil Nadu', serving: '2 pieces', calories: 180, protein: 4, carbs: 38, fat: 1 },
  { name: 'Puttu', emoji: 'PU', category: 'Additional Tamil Nadu', serving: '1 cup', calories: 260, protein: 5, carbs: 52, fat: 4 },
];

const ICONIFY_BASE = 'https://api.iconify.design/fluent-emoji-flat';

const foodVisualRules: Array<{ test: RegExp; icon: string; label: string }> = [
  { test: /pizza/i, icon: 'pizza.svg', label: 'Pizza icon' },
  { test: /burger/i, icon: 'hamburger.svg', label: 'Burger icon' },
  { test: /fries/i, icon: 'french-fries.svg', label: 'French fries icon' },
  { test: /shawarma|kothu|parotta/i, icon: 'stuffed-flatbread.svg', label: 'Wrap and flatbread icon' },
  { test: /naan|chapati|dosa|adai|appam/i, icon: 'flatbread.svg', label: 'Flatbread icon' },
  { test: /idli|paniyaram|puttu|idiyappam|pongal|upma|koozh|kali|mudde/i, icon: 'bowl-with-spoon.svg', label: 'Breakfast bowl icon' },
  { test: /biryani|rice/i, icon: 'curry-rice.svg', label: 'Rice dish icon' },
  { test: /paneer|kurma|curry|dal|sambar|rasam|kuzhambu|avial|manchurian/i, icon: 'pot-of-food.svg', label: 'Curry icon' },
  { test: /fish|nethili/i, icon: 'fish-cake-with-swirl.svg', label: 'Fish dish icon' },
  { test: /prawn/i, icon: 'shrimp.svg', label: 'Prawn icon' },
  { test: /chicken|mutton|egg/i, icon: 'poultry-leg.svg', label: 'Non-veg dish icon' },
  { test: /vada/i, icon: 'doughnut.svg', label: 'Vada icon' },
  { test: /banana/i, icon: 'banana.svg', label: 'Banana icon' },
  { test: /mango/i, icon: 'mango.svg', label: 'Mango icon' },
  { test: /guava/i, icon: 'green-apple.svg', label: 'Guava icon' },
  { test: /watermelon/i, icon: 'watermelon.svg', label: 'Watermelon icon' },
  { test: /peanut|chana|sundal|sprouts/i, icon: 'beans.svg', label: 'Legume snack icon' },
  { test: /beans|keerai|drumstick|brinjal/i, icon: 'leafy-green.svg', label: 'Vegetable icon' },
  { test: /curd|buttermilk|milk/i, icon: 'glass-of-milk.svg', label: 'Dairy drink icon' },
  { test: /coffee/i, icon: 'hot-beverage.svg', label: 'Coffee icon' },
  { test: /coconut/i, icon: 'coconut.svg', label: 'Tender coconut icon' },
];

const categoryVisualRules: Array<{ test: RegExp; icon: string; label: string }> = [
  { test: /Breakfast|Traditional|Additional Tamil Nadu/i, icon: 'bowl-with-spoon.svg', label: 'Tamil Nadu food category' },
  { test: /Grains|Biryani|Rice/i, icon: 'curry-rice.svg', label: 'Rice category' },
  { test: /Curries|Paneer/i, icon: 'pot-of-food.svg', label: 'Curry category' },
  { test: /Non-Veg|Starters/i, icon: 'poultry-leg.svg', label: 'Non-veg category' },
  { test: /Vegetables|Healthy/i, icon: 'leafy-green.svg', label: 'Vegetable category' },
  { test: /Fruits/i, icon: 'mango.svg', label: 'Fruit category' },
  { test: /Snacks|Fast Food|Restaurant/i, icon: 'hamburger.svg', label: 'Snack category' },
  { test: /Dairy|Beverages/i, icon: 'glass-of-milk.svg', label: 'Beverage category' },
  { test: /Naan/i, icon: 'flatbread.svg', label: 'Bread category' },
];

function iconifyUrl(icon: string) {
  return `${ICONIFY_BASE}/${icon}`;
}

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');
}

function getFoodVisual(item: FoodItem): FoodVisual {
  const rule = foodVisualRules.find(entry => entry.test.test(`${item.name} ${item.category}`));
  return {
    icon: iconifyUrl(rule?.icon ?? 'fork-and-knife-with-plate.svg'),
    label: rule?.label ?? `${item.name} food icon`,
    badge: initialsFor(item.name),
  };
}

function getCategoryVisual(category: string): FoodVisual {
  const rule = categoryVisualRules.find(entry => entry.test.test(category));
  return {
    icon: iconifyUrl(rule?.icon ?? 'fork-and-knife-with-plate.svg'),
    label: rule?.label ?? `${category} category icon`,
  };
}

function FoodIcon({ item, compact = false }: { item: FoodItem; compact?: boolean }) {
  const visual = getFoodVisual(item);
  return (
    <span className={`${compact ? 'h-8 w-8' : 'h-12 w-12'} relative inline-flex shrink-0 items-center justify-center rounded-2xl border border-primary-100 bg-white shadow-sm`}>
      <img src={visual.icon} alt={visual.label} loading="lazy" className={`${compact ? 'h-6 w-6' : 'h-9 w-9'} object-contain`} />
      {visual.badge && (
        <span className="absolute -bottom-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-white bg-primary-700 px-1 text-[8px] font-black leading-none text-white">
          {visual.badge}
        </span>
      )}
    </span>
  );
}

// ─── Progress Helpers ─────────────────────────────────────────────────────────
const PROGRESS_KEY = 'argps-progress-v1';
const COURSE_PROGRESS_ROW = 'ARGPS_SEQUENTIAL_PROGRESS';
const emptyProgress: Progress = {
  completedLessons: {},
  quizScores: {},
  completedModules: {},
  unlockedModules: { [modules[0]?.id ?? 'm1']: true },
};

function normalizeProgress(progress: Partial<Progress> | null): Progress {
  return {
    completedLessons: progress?.completedLessons ?? {},
    quizScores: progress?.quizScores ?? {},
    completedModules: progress?.completedModules ?? {},
    unlockedModules: {
      [modules[0]?.id ?? 'm1']: true,
      ...(progress?.unlockedModules ?? {}),
    },
    lastVisited: progress?.lastVisited,
  };
}

function readProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? normalizeProgress(JSON.parse(raw) as Partial<Progress>) : normalizeProgress(null);
  } catch { return emptyProgress; }
}

function writeProgress(p: Progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  window.dispatchEvent(new Event('argps:progress'));
}

async function saveProgressToSupabase(userId: string, progress: Progress) {
  const payload = {
    user_id: userId,
    course_name: COURSE_PROGRESS_ROW,
    progress: JSON.stringify(progress),
  };

  const { data: rows, error: readError } = await supabase
    .from('app_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('course_name', COURSE_PROGRESS_ROW)
    .limit(1);

  if (readError) {
    return { error: readError };
  }

  const existingId = (rows as { id: string }[] | null)?.[0]?.id;
  if (existingId) {
    return supabase
      .from('app_progress')
      .update(payload)
      .eq('id', existingId);
  }

  return supabase.from('app_progress').insert([
    {
      user_id: userId,
      course_name: COURSE_PROGRESS_ROW,
      progress: JSON.stringify(progress),
    },
  ]);
}

function parseRemoteProgress(value: string | null | undefined) {
  if (!value) return null;
  try {
    return normalizeProgress(JSON.parse(value) as Partial<Progress>);
  } catch {
    return null;
  }
}

function moduleProgressPct(p: Progress, moduleId: string) {
  const m = modules.find(x => x.id === moduleId);
  if (!m) return 0;
  const done = m.lessons.filter(l => p.completedLessons[`${m.id}:${l.id}`]).length;
  return Math.round((done / m.lessons.length) * 100);
}

function isModuleComplete(p: Progress, moduleId: string) {
  return p.completedModules?.[moduleId] === true || p.quizScores[moduleId]?.passed === true;
}

function isModuleUnlocked(p: Progress, moduleId: string) {
  if (moduleId === modules[0]?.id) return true;
  return p.unlockedModules?.[moduleId] === true;
}

function overallProgressPct(p: Progress) {
  const total = modules.length;
  const done = modules.filter(module => isModuleComplete(p, module.id)).length;
  return total ? Math.round((done / total) * 100) : 0;
}

function getUserDisplayName(user: User, profile: AppUserProfile | null) {
  const profileName = profile?.full_name;
  const metadataName = user.user_metadata?.full_name;
  const name = profileName || metadataName;
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
function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <img src={LOGO_URL} alt="ARGPS Nutritious Lifestyle logo" className={`${compact ? 'h-11' : 'h-14'} w-auto flex-shrink-0 object-contain`} />
      <div className="min-w-0">
        <div className={`${compact ? 'text-lg sm:text-xl' : 'text-xl'} font-serif font-bold leading-tight text-primary-950`}>ARGPS Nutritious Lifestyle</div>
        <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-600">Tamil Nadu Nutrition</div>
      </div>
    </div>
  );
}

function CourseLoginCard({ onAuthSuccess }: { onAuthSuccess: (user: User | null) => void }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showLoginOtp, setShowLoginOtp] = useState(false);
  const [showSignupOtp, setShowSignupOtp] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'google' | 'password-login' | 'send-login-otp' | 'verify-login-otp' | 'signup' | 'verify-signup-otp' | null>(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [existingSignupEmail, setExistingSignupEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const existingAccountMessage = 'You already have an account. Please use Login.';

  const resetStatus = () => {
    setMessage('');
    setErrorMessage('');
    setExistingSignupEmail('');
  };

  const resetOtpState = () => {
    setOtp('');
    setShowLoginOtp(false);
    setShowSignupOtp(false);
    setResendCooldown(0);
  };

  const switchMode = (nextMode: 'login' | 'signup') => {
    setMode(nextMode);
    resetStatus();
    resetOtpState();
  };

  const showExistingAccountNotice = (email: string) => {
    setErrorMessage(existingAccountMessage);
    setExistingSignupEmail(email);
    setShowSignupOtp(false);
    setOtp('');
    setResendCooldown(0);
  };

  const goToLoginFromSignup = () => {
    const email = existingSignupEmail || signupEmail.trim();
    switchMode('login');
    setLoginEmail(email);
    setOtpEmail(email);
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

  const signInWithGoogle = async () => {
    resetStatus();
    setLoadingAction('google');

    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/courses',
      },
    });

    if (googleError) {
      setErrorMessage(googleError.message);
      setLoadingAction(null);
    }
  };

  const handlePasswordLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetStatus();
    setLoadingAction('password-login');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setMessage('Login successful. Opening your courses...');
      onAuthSuccess(data.user);
      navigate('/courses', { replace: true });
    }

    setLoadingAction(null);
  };

  const sendLoginOtp = async () => {
    if (loadingAction === 'send-login-otp' || resendCooldown > 0) {
      return;
    }

    resetStatus();
    setLoadingAction('send-login-otp');

    const { error } = await supabase.auth.signInWithOtp({
      email: otpEmail.trim(),
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setResendCooldown(0);
    } else {
      setShowLoginOtp(true);
      setMessage('OTP sent successfully. Check your email.');
      setResendCooldown(60);
    }

    setLoadingAction(null);
  };

  const verifyLoginOtp = async () => {
    resetStatus();
    setLoadingAction('verify-login-otp');

    const { data, error } = await supabase.auth.verifyOtp({
      email: otpEmail.trim(),
      token: otp.trim(),
      type: 'email',
    });

    if (error) {
      setErrorMessage(error.message);
      setLoadingAction(null);
      return;
    }

    setMessage('OTP verified. Opening your courses...');
    onAuthSuccess(data.user);
    navigate('/courses', { replace: true });
    setLoadingAction(null);
  };

  const createAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = signupEmail.trim();

    if (existingSignupEmail && existingSignupEmail.toLowerCase() === email.toLowerCase()) {
      showExistingAccountNotice(email);
      return;
    }

    resetStatus();

    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoadingAction('signup');

    const { data, error } = await supabase.auth.signUp({
      email,
      password: signupPassword,
      options: {
        emailRedirectTo: window.location.origin + '/onboarding',
      },
    });

    if (error) {
      const alreadyRegistered = /already|registered|exists/i.test(error.message);
      if (alreadyRegistered) {
        showExistingAccountNotice(email);
      } else {
        setErrorMessage(error.message);
      }
      setShowSignupOtp(false);
    } else if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      showExistingAccountNotice(email);
    } else {
      setShowSignupOtp(true);
      setOtp('');
      setMessage('Account created. Enter the OTP from your email to continue.');
      setResendCooldown(60);
    }

    setLoadingAction(null);
  };

  const verifySignupOtp = async () => {
    resetStatus();
    setLoadingAction('verify-signup-otp');

    const { data, error } = await supabase.auth.verifyOtp({
      email: signupEmail.trim(),
      token: otp.trim(),
      type: 'signup',
    });

    if (error) {
      setErrorMessage(error.message);
      setLoadingAction(null);
      return;
    }

    if (data.user) {
      const { error: profileError } = await upsertAppUserProfile({
        id: data.user.id,
        email: data.user.email ?? signupEmail.trim(),
        full_name: null,
        age: null,
        password_setup: true,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        setErrorMessage(profileError.message);
        setLoadingAction(null);
        return;
      }
    }

    setMessage('Email verified. Continue onboarding...');
    onAuthSuccess(data.user);
    navigate('/onboarding', { replace: true });
    setLoadingAction(null);
  };

  const isLoading = loadingAction !== null;
  const signupReady = signupEmail.trim().length > 0 && signupPassword.length >= 6 && confirmPassword.length >= 6;

  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-primary-100 bg-[#fffdf4] shadow-[0_28px_90px_rgba(19,78,74,0.14)]">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-primary-900 px-6 py-8 text-white sm:px-8 lg:px-10">
          <h1 className="font-serif text-4xl font-bold leading-tight text-white">Your nutrition course is ready.</h1>
          <p className="mt-4 text-sm leading-7 text-primary-50/85">
            Sign in with the method connected to your account, or create a new account and complete onboarding before entering the dashboard.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              ['Email login', 'Existing users go straight to courses.'],
              ['OTP login', 'Existing users verify once and continue.'],
              ['New signup', 'Verify email, then complete onboarding.'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-sm font-bold">{title}</div>
                <div className="mt-1 text-xs leading-5 text-primary-50/75">{copy}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/95 p-5 sm:p-7 lg:p-9">
          <div className="mb-6 rounded-3xl border border-primary-100 bg-white px-4 py-4 shadow-sm sm:px-5">
            <BrandLockup compact />
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-primary-50 p-1.5">
            {(['login', 'signup'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => switchMode(tab)}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${mode === tab ? 'bg-white text-primary-800 shadow-sm' : 'text-primary-500 hover:text-primary-800'}`}
              >
                {tab === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          <button type="button" onClick={signInWithGoogle} disabled={isLoading} className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-primary-100 bg-white px-4 py-4 text-sm font-black text-gray-800 shadow-[0_18px_45px_rgba(19,78,74,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-black text-blue-600 shadow-sm">G</span>
            {loadingAction === 'google' ? 'Connecting...' : mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}
          </button>

          {mode === 'login' ? (
            <div className="space-y-5 transition-all duration-300">
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary-950">Welcome back</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">Choose one login option. Existing users enter the courses dashboard directly.</p>
              </div>

              <form onSubmit={handlePasswordLogin} className="rounded-3xl border border-primary-100 bg-primary-50/30 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary-700 shadow-sm"><KeyRound size={18} /></div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.16em] text-primary-800">Email Password</h3>
                    <p className="text-xs text-gray-500">No OTP or onboarding for existing users.</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email
                    <input type="email" value={loginEmail} onChange={event => setLoginEmail(event.target.value)} required placeholder="you@example.com" className="mt-2 w-full rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                  </label>
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                    <input type="password" value={loginPassword} onChange={event => setLoginPassword(event.target.value)} required placeholder="Your password" className="mt-2 w-full rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                  </label>
                </div>
                <button type="submit" disabled={isLoading || !loginEmail || !loginPassword} className="mt-4 w-full rounded-full bg-primary-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary-600/20 transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {loadingAction === 'password-login' ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="rounded-3xl border border-primary-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"><Mail size={18} /></div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.16em] text-primary-800">Login with OTP</h3>
                    <p className="text-xs text-gray-500">For existing accounts only.</p>
                  </div>
                </div>
                <label className="block text-sm font-semibold text-gray-700">
                  Email
                  <input type="email" value={otpEmail} onChange={event => setOtpEmail(event.target.value)} required placeholder="you@example.com" className="mt-2 w-full rounded-2xl border border-primary-100 bg-primary-50/30 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </label>
                <button type="button" onClick={sendLoginOtp} disabled={isLoading || !otpEmail || resendCooldown > 0} className="mt-4 w-full rounded-full border border-primary-200 bg-white px-4 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60">
                  {loadingAction === 'send-login-otp' ? 'Sending OTP...' : resendCooldown > 0 && showLoginOtp ? `Resend OTP in ${resendCooldown}s` : showLoginOtp ? 'Resend OTP' : 'Login with OTP'}
                </button>
                {showLoginOtp && (
                  <form
                    onSubmit={event => {
                      event.preventDefault();
                      void verifyLoginOtp();
                    }}
                    className="mt-4 space-y-3"
                  >
                    <label className="block text-sm font-semibold text-gray-700">
                      OTP
                      <input type="text" inputMode="numeric" value={otp} onChange={event => setOtp(event.target.value)} required placeholder="Enter OTP" className="mt-2 w-full rounded-2xl border border-primary-100 bg-primary-50/30 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                    </label>
                    <button type="submit" disabled={isLoading || !otp} className="w-full rounded-full bg-primary-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
                      {loadingAction === 'verify-login-otp' ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5 transition-all duration-300">
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary-950">Create your account</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">New users verify email first, complete onboarding, then enter courses.</p>
              </div>

              <form onSubmit={createAccount} className="rounded-3xl border border-primary-100 bg-primary-50/30 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary-700 shadow-sm"><UserPlus size={18} /></div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.16em] text-primary-800">Sign Up</h3>
                    <p className="text-xs text-gray-500">Email, password, confirmation, then OTP.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email
                    <input type="email" value={signupEmail} onChange={event => setSignupEmail(event.target.value)} required placeholder="you@example.com" className="mt-2 w-full rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Password
                      <input type="password" value={signupPassword} onChange={event => setSignupPassword(event.target.value)} required minLength={6} placeholder="Create password" className="mt-2 w-full rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                    </label>
                    <label className="block text-sm font-semibold text-gray-700">
                      Confirm Password
                      <input type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required minLength={6} placeholder="Confirm password" className="mt-2 w-full rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                    </label>
                  </div>
                </div>
                <button type="submit" disabled={isLoading || !signupReady} className="mt-4 w-full rounded-full bg-primary-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary-600/20 transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {loadingAction === 'signup' ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              {showSignupOtp && (
                <form
                  onSubmit={event => {
                    event.preventDefault();
                    void verifySignupOtp();
                  }}
                  className="rounded-3xl border border-primary-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"><ShieldCheck size={18} /></div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.16em] text-primary-800">Verify Email</h3>
                      <p className="text-xs text-gray-500">Incorrect OTPs can be retried.</p>
                    </div>
                  </div>
                  <label className="block text-sm font-semibold text-gray-700">
                    OTP
                    <input type="text" inputMode="numeric" value={otp} onChange={event => setOtp(event.target.value)} required placeholder="Enter OTP" className="mt-2 w-full rounded-2xl border border-primary-100 bg-primary-50/30 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                  </label>
                  <button type="submit" disabled={isLoading || !otp} className="mt-4 w-full rounded-full bg-primary-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
                    {loadingAction === 'verify-signup-otp' ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </form>
              )}
            </div>
          )}

          {existingSignupEmail ? (
            <div className="mt-5 rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 to-white px-4 py-4 shadow-[0_18px_45px_rgba(127,29,29,0.08)] transition-all duration-300">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-red-800">{existingAccountMessage}</p>
                  <p className="mt-1 text-xs leading-5 text-red-700/75">{existingSignupEmail}</p>
                </div>
                <button
                  type="button"
                  onClick={goToLoginFromSignup}
                  className="rounded-full bg-primary-700 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-primary-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-800"
                >
                  Go to Login
                </button>
              </div>
            </div>
          ) : errorMessage ? (
            <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorMessage}</p>
          ) : null}
          {message && <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{message}</p>}
        </div>
      </div>
    </div>
  );
}

type View =
  | { type: 'overview' }
  | { type: 'lesson'; moduleId: string; lessonId: string }
  | { type: 'quiz'; moduleId: string }
  | { type: 'meal-builder' }
  | { type: 'progress' }
  | { type: 'about' }
  | { type: 'profile' };

// ─── Lesson View ──────────────────────────────────────────────────────────────
function LessonView({
  moduleId, lessonId, progress, onComplete, onNext,
}: {
  moduleId: string; lessonId: string; progress: Progress;
  onComplete: () => void;
  onNext: (mid: string, lid: string) => void;
}) {
  const mod = modules.find(m => m.id === moduleId)!;
  const lesson = mod.lessons.find(l => l.id === lessonId)!;
  const isCompleted = !!progress.completedLessons[`${moduleId}:${lessonId}`];

  const lessonIndex = mod.lessons.findIndex(item => item.id === lessonId);
  const nextLesson = lessonIndex >= 0 && lessonIndex < mod.lessons.length - 1
    ? mod.lessons[lessonIndex + 1]
    : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-primary-50 rounded-2xl px-5 py-3 mb-6 text-sm font-medium text-primary-700">
        {mod.icon} Module {mod.number}: {mod.title}
      </div>

      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
      <p className="text-gray-600 leading-relaxed mb-8">{lesson.intro}</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-serif text-2xl font-bold text-primary-950 mb-4">Key ideas</h2>
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
        <h2 className="font-serif text-2xl font-bold text-amber-900 mb-4">Real-life examples</h2>
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
          Mark complete & continue
        </button>
      )}
      {isCompleted && nextLesson && (
        <button
          onClick={() => onNext(moduleId, nextLesson.id)}
          className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors mb-3"
        >
          Mark complete & continue
        </button>
      )}
      {isCompleted && !nextLesson && (
        <button
          onClick={onComplete}
          className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors mb-3"
        >
          Continue to Quiz
        </button>
      )}
    </div>
  );
}

// ─── Quiz View ────────────────────────────────────────────────────────────────
function QuizView({
  moduleId, onSave, onBack, onContinue,
}: {
  moduleId: string;
  onSave: (score: number, total: number) => void; onBack: () => void; onContinue: () => void;
}) {
  const mod = modules.find(m => m.id === moduleId)!;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [savedScore, setSavedScore] = useState(0);

  const passScore = Math.ceil(mod.quiz.length * 0.7);
  const score = submitted ? savedScore : 0;
  const passed = score >= passScore;
  const currentQuestion = mod.quiz[currentIndex];
  const selectedAnswer = answers[currentQuestion.id];
  const questionProgress = Math.round(((currentIndex + 1) / mod.quiz.length) * 100);
  const percentage = Math.round((score / mod.quiz.length) * 100);
  const resultMessages = percentage === 100
    ? ['Excellent Work! 🌟', 'Outstanding Performance! 🎉', 'Perfect Score! 🏆', 'Brilliant Job! ✨']
    : percentage >= 70
      ? ['Well Done! 👏', 'Great Work! 💯', 'Amazing Effort! 🚀', 'Keep It Up! 🔥']
      : percentage >= 50
        ? ['Good Attempt 👍', 'Nice Try 😊', "You're Improving 📚", 'Keep Practicing 💪']
        : ["Don't Give Up 💡", 'Practice Makes Perfect 📖', 'Keep Learning 🌱', 'Try Again Stronger 🚀'];
  const resultMessage = resultMessages[(score + mod.number) % resultMessages.length];
  const resultTone = passed ? 'success' : percentage >= 50 ? 'average' : 'failed';
  const resultCardClass = resultTone === 'success'
    ? 'border-green-200 bg-gradient-to-br from-green-50 via-white to-green-50 shadow-green-900/10'
    : resultTone === 'average'
      ? 'border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-amber-900/10'
      : 'border-red-200 bg-gradient-to-br from-red-50 via-white to-red-50 shadow-red-900/10';
  const resultAccentClass = resultTone === 'success'
    ? 'bg-green-600 text-white shadow-green-600/20'
    : resultTone === 'average'
      ? 'bg-amber-500 text-white shadow-amber-500/20'
      : 'bg-red-600 text-white shadow-red-600/20';
  const resultStatusClass = resultTone === 'success'
    ? 'text-green-700'
    : resultTone === 'average'
      ? 'text-amber-700'
      : 'text-red-700';

  function submit() {
    const nextScore = mod.quiz.filter(q => answers[q.id] === q.answer).length;
    setSavedScore(nextScore);
    setSubmitted(true);
    onSave(nextScore, mod.quiz.length);
  }

  function retry() {
    setAnswers({});
    setCurrentIndex(0);
    setSavedScore(0);
    setSubmitted(false);
  }

  function nextQuestion() {
    if (currentIndex < mod.quiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }
    submit();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="hidden" aria-hidden="true" tabIndex={-1} />

      <div className="bg-primary-50 rounded-2xl px-5 py-3 mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          {mod.icon} Module {mod.number} Quiz
        </h1>
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs font-semibold text-gray-500">
            <span>Question {currentIndex + 1} of {mod.quiz.length}</span>
            <span>{questionProgress}%</span>
          </div>
          <ProgressBar value={questionProgress} />
        </div>
      </div>

      {submitted && (
        <div className={`mb-8 rounded-3xl border p-6 text-center shadow-xl transition-all duration-500 ${resultCardClass}`}>
          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-lg ${resultAccentClass}`}>
            {passed ? '✓' : percentage >= 50 ? '!' : '×'}
          </div>
          <h2 className="font-serif text-3xl font-bold text-gray-900">{resultMessage}</h2>
          <div className="mx-auto mt-5 grid max-w-md gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Score</div>
              <div className="mt-1 text-lg font-black text-gray-900">{score}/{mod.quiz.length}</div>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Percentage</div>
              <div className="mt-1 text-lg font-black text-gray-900">{percentage}%</div>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Status</div>
              <div className={`mt-1 text-lg font-black ${resultStatusClass}`}>
                {passed ? 'Passed ✅' : 'Failed ❌'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {[currentQuestion].map((q) => {
          const selected = answers[q.id];
          const isCorrect = selected === q.answer;
          return (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex gap-3 mb-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-bold">
                  {currentIndex + 1}
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
          onClick={nextQuestion}
          disabled={selectedAnswer === undefined}
          className="w-full mt-8 bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {currentIndex < mod.quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      )}
      {submitted && (
        <div className="mt-8 space-y-3">
          {passed ? (
            <button onClick={onContinue} className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
              Continue
            </button>
          ) : (
            <button onClick={retry} className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
              Retry Quiz
            </button>
          )}
        </div>
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
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = foodItems.filter(f => {
    const matchCat = selectedCat === 'All' || f.category === selectedCat;
    const matchSearch = f.name.toLowerCase().includes(normalizedSearch);
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
      <button onClick={onBack} className="hidden" aria-hidden="true" tabIndex={-1} />
      <div className="mb-8 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-3xl border border-primary-100 bg-white shadow-sm">
          <img src={iconifyUrl('fork-and-knife-with-plate.svg')} alt="Meal Builder" className="h-10 w-10 object-contain" />
        </span>
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Meal Builder</h1>
          <p className="mt-1 text-gray-500">Build your Tamil Nadu meal and see its nutrition breakdown.</p>
        </div>
      </div>

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
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${selectedCat === cat ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat !== 'All' && (
                  <img
                    src={getCategoryVisual(cat).icon}
                    alt={getCategoryVisual(cat).label}
                    loading="lazy"
                    className="h-4 w-4 rounded-full bg-white object-contain"
                  />
                )}
                {cat}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {filtered.map(item => (
              <button key={item.name}
                onClick={() => addItem(item)}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-50 hover:shadow-md">
                <FoodIcon item={item} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.serving}</div>
                  <div className="text-xs text-primary-600 font-medium">{item.calories} kcal</div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-400 sm:col-span-2">
                No matching foods found.
              </div>
            )}
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
                    <div key={item.name} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-primary-50/30 p-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <FoodIcon item={item} compact />
                        <span className="truncate text-sm text-gray-700">{item.name} ×{qty}</span>
                      </div>
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
  onMealBuilder,
}: {
  progress: Progress;
  startedCourses: Set<string>;
  onStartLesson: (mod: Module) => void;
  onMealBuilder: () => void;
}) {
  const overall = overallProgressPct(progress);

  return (
    <div>
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 md:p-12 mb-10 text-white">
        <p className="text-xs uppercase tracking-widest opacity-70 mb-2">🌱 Tamil Nadu Nutrition Course</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
          ARGPS Nutritious Lifestyle
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Courses Page ────────────────────────────────────────────────────────
function DashboardNav({ view, onView }: { view: View; onView: (next: View) => void }) {
  const items = [
    { label: 'Home', icon: Home, action: () => onView({ type: 'overview' }), active: view.type === 'overview' },
    { label: 'Meal Builder', icon: Utensils, action: () => onView({ type: 'meal-builder' }), active: view.type === 'meal-builder' },
    { label: 'Progress', icon: Trophy, action: () => onView({ type: 'progress' }), active: view.type === 'progress' },
    { label: 'About', icon: Sparkles, action: () => onView({ type: 'about' }), active: view.type === 'about' },
    { label: 'Profile', icon: CircleUserRound, action: () => onView({ type: 'profile' }), active: view.type === 'profile' },
  ];
  return (
    <div className="mb-8 rounded-[28px] border border-primary-100 bg-white/90 p-3 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <BrandLockup compact />
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          {items.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.label} type="button" onClick={item.action} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${item.active ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'}`}>
                <Icon size={16} />{item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function ProgressView({ progress }: { progress: Progress }) {
  const overall = overallProgressPct(progress);
  const levels = ['Beginner Nutrition Explorer', 'Healthy Meal Learner', 'Smart Nutrition Builder', 'Food Master', 'Nutrition Champion'];
  const activeLevel = Math.min(levels.length - 1, Math.floor(overall / 25));
  const completed = modules.filter(module => isModuleComplete(progress, module.id)).length;
  const unlocked = modules.filter(module => isModuleUnlocked(progress, module.id)).length;
  return (
    <div className="space-y-8">
      <div className="rounded-[30px] border border-primary-100 bg-white p-8 shadow-[0_24px_80px_rgba(19,78,74,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary-600">Progress Roadmap</p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-primary-950">Your learning progression</h1>
        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {[
            ['Learning', `${overall}%`],
            ['Completed', `${completed}/${modules.length}`],
            ['Unlocked', `${unlocked}/${modules.length}`],
            ['Achievements', `${completed + Object.keys(progress.quizScores).length}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-primary-50 p-5">
              <div className="text-3xl font-bold text-primary-900">{value}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4">
        {levels.map((level, index) => {
          const active = index <= activeLevel;
          return (
            <div key={level} className={`flex items-center gap-4 rounded-[24px] border p-5 transition-all ${active ? 'border-primary-200 bg-white shadow-sm' : 'border-gray-100 bg-white/60 opacity-70'}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${active ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{active ? <Check size={20} /> : <Lock size={18} />}</div>
              <div className="flex-1">
                <div className="font-serif text-xl font-bold text-primary-950">{level}</div>
                <ProgressBar value={index < activeLevel ? 100 : index === activeLevel ? (overall % 25) * 4 : 0} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AboutCourseView() {
  return (
    <div className="rounded-[30px] border border-primary-100 bg-white p-8 shadow-[0_24px_80px_rgba(19,78,74,0.08)] md:p-12">
      <BrandLockup />
      <p className="mt-10 text-xs font-black uppercase tracking-[0.22em] text-primary-600">About the course</p>
      <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight text-primary-950 md:text-5xl">A practical Tamil Nadu nutrition guide for everyday plates.</h1>
      <p className="mt-6 max-w-3xl text-xl leading-9 text-gray-600">ARGPS Nutritious Lifestyle helps learners understand calories, portions, balanced meals, and sustainable habits through familiar Tamil Nadu foods.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-[24px] border border-primary-100 bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.18em] text-primary-600">Main Author</p><h2 className="mt-3 font-serif text-2xl font-bold text-primary-950">G. Subashini</h2><p className="mt-1 font-semibold text-gray-500">Nutritionist</p></div>
        <div className="rounded-[24px] border border-primary-100 bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.18em] text-primary-600">Co-Author</p><h2 className="mt-3 font-serif text-2xl font-bold text-primary-950">Rithanya Gopinathan</h2><p className="mt-1 font-semibold text-gray-500">Wellness Consultant</p></div>
      </div>
      <div className="mt-10 rounded-[26px] border-l-4 border-primary-500 bg-primary-50 p-7"><p className="text-xs font-black uppercase tracking-[0.22em] text-primary-600">Mission</p><p className="mt-3 font-serif text-3xl leading-10 text-primary-950">To provide a practical, realistic, and culturally relevant nutrition guide based on Tamil Nadu food habits.</p></div>
    </div>
  );
}

function DashboardProfileView({ user, profile }: { user: User; profile: AppUserProfile | null }) {
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [email, setEmail] = useState(profile?.email ?? user.email ?? '');
  const [age, setAge] = useState(String(profile?.age ?? ''));
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setMessage(''); setErrorMessage('');
    const trimmedEmail = email.trim();
    const { error: authError } = await updateAuthProfile({ fullName: fullName.trim(), email: trimmedEmail !== user.email ? trimmedEmail : undefined, password: password.length >= 6 ? password : undefined });
    if (authError) { setErrorMessage(authError.message); setSaving(false); return; }
    const { error } = await upsertAppUserProfile({ id: user.id, email: trimmedEmail, full_name: fullName.trim(), age: Number(age), password_setup: profile?.password_setup ?? true, created_at: profile?.created_at ?? new Date().toISOString() });
    setSaving(false);
    if (error) setErrorMessage(error.message);
    else { setPassword(''); setMessage('Profile updated successfully.'); }
  }
  return (
    <div className="mx-auto max-w-3xl rounded-[30px] border border-primary-100 bg-white p-8 shadow-[0_24px_80px_rgba(19,78,74,0.08)]">
      <BrandLockup />
      <h1 className="mt-8 font-serif text-4xl font-bold text-primary-950">Profile</h1>
      <form onSubmit={save} className="mt-7 space-y-5">
        <label className="block text-sm font-bold text-gray-700">Full Name<input value={fullName} onChange={event => setFullName(event.target.value)} className="mt-2 w-full rounded-2xl border border-primary-100 bg-primary-50/30 px-4 py-3 text-sm outline-none focus:border-primary-500" /></label>
        <label className="block text-sm font-bold text-gray-700">Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-primary-100 bg-primary-50/30 px-4 py-3 text-sm outline-none focus:border-primary-500" /></label>
        <label className="block text-sm font-bold text-gray-700">Age<input type="number" value={age} onChange={event => setAge(event.target.value)} className="mt-2 w-full rounded-2xl border border-primary-100 bg-primary-50/30 px-4 py-3 text-sm outline-none focus:border-primary-500" /></label>
        <label className="block text-sm font-bold text-gray-700">New Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Leave blank to keep current password" className="mt-2 w-full rounded-2xl border border-primary-100 bg-primary-50/30 px-4 py-3 text-sm outline-none focus:border-primary-500" /></label>
        {errorMessage && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}
        {message && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}
        <button disabled={saving} className="rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-60">{saving ? 'Saving...' : 'Save changes'}</button>
      </form>
    </div>
  );
}

export const Courses: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appUserProfile, setAppUserProfile] = useState<AppUserProfile | null | undefined>(undefined);
  const resolvedAppUserProfile = appUserProfile ?? null;
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState('');
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [startedCourses, setStartedCourses] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [view, setView] = useState<View>({ type: 'overview' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        setActivityError(error.message);
      }

      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setAppUserProfile(session?.user ? undefined : null);
      setView({ type: 'overview' });
      setActivityError('');
      setProfileError('');
      if (!session?.user) {
        setStartedCourses(new Set());
      } else if (event === 'SIGNED_IN' && location.pathname !== '/courses') {
        navigate('/courses', { replace: true });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [location.pathname, navigate]);

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
        const remoteProgress = rows
          .filter(row => row.course_name === COURSE_PROGRESS_ROW)
          .map(row => parseRemoteProgress(row.progress))
          .find((item): item is Progress => item !== null);

        if (remoteProgress) {
          writeProgress(remoteProgress);
          setProgress(remoteProgress);
        } else {
          const initialProgress = normalizeProgress(null);
          writeProgress(initialProgress);
          setProgress(initialProgress);
        }

        setStartedCourses(new Set(
          rows
            .filter(row => row.course_name !== COURSE_PROGRESS_ROW)
            .map(row => row.course_name)
        ));
      }

      setActivityLoading(false);
    };

    void fetchActivity();

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      setAppUserProfile(null);
      setProfileLoading(false);
      setProfileError('');
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError('');
      const { profile, error } = await ensureAppUserProfile(user);
      if (!isMounted) return;

      if (error) {
        setActivityError(error.message);
        setProfileError(error.message);
        setProfileLoading(false);
        return;
      }

      setAppUserProfile(profile);
      setProfileLoading(false);

      if (isProfileComplete(profile) && location.pathname === '/onboarding') {
        navigate('/courses');
      } else if (!isProfileComplete(profile) && location.pathname === '/courses') {
        navigate('/onboarding', { replace: true });
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user, location.pathname, navigate]);

  useEffect(() => {
    setProgress(readProgress());
    const onChange = () => setProgress(readProgress());
    window.addEventListener('argps:progress', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('argps:progress', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const persistProgress = useCallback((nextProgress: Progress) => {
    const normalized = normalizeProgress(nextProgress);
    writeProgress(normalized);
    setProgress({ ...normalized });

    if (user) {
      void saveProgressToSupabase(user.id, normalized).then(({ error }) => {
        if (error) {
          setActivityError(error.message);
        }
      });
    }
  }, [user]);

  const markComplete = useCallback((moduleId: string, lessonId: string) => {
    const p = readProgress();
    const mod = modules.find(item => item.id === moduleId);
    const isLastLesson = mod?.lessons[mod.lessons.length - 1]?.id === lessonId;

    p.completedLessons[`${moduleId}:${lessonId}`] = true;
    p.lastVisited = { moduleId, lessonId };
    persistProgress(p);

    if (isLastLesson) {
      setView({ type: 'quiz', moduleId });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [persistProgress]);

  const saveQuiz = useCallback((moduleId: string, score: number, total: number) => {
    const p = readProgress();
    const prev = p.quizScores[moduleId];
    const passed = score >= Math.ceil(total * 0.7);
    const bestScore = Math.max(prev?.score ?? 0, score);
    const hasPassed = prev?.passed === true || passed;

    p.quizScores[moduleId] = { score: bestScore, total, passed: hasPassed };

    if (passed) {
      p.completedModules = { ...(p.completedModules ?? {}), [moduleId]: true };

      const moduleIndex = modules.findIndex(item => item.id === moduleId);
      const nextModule = moduleIndex >= 0 ? modules[moduleIndex + 1] : undefined;
      if (nextModule) {
        p.unlockedModules = { ...(p.unlockedModules ?? {}), [nextModule.id]: true };
      }
    }

    persistProgress(p);
  }, [persistProgress]);

  const goToLesson = (mid: string, lid: string) => {
    const p = readProgress();
    p.lastVisited = { moduleId: mid, lessonId: lid };
    persistProgress(p);
    setView({ type: 'lesson', moduleId: mid, lessonId: lid });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startCourse = async (mod: Module) => {
    if (!user) return;

    setActivityError('');

    const currentProgress = readProgress();
    if (!isModuleUnlocked(currentProgress, mod.id)) {
      setActivityError('Complete and pass the previous module quiz to unlock this module.');
      setView({ type: 'overview' });
      return;
    }

    if (moduleProgressPct(currentProgress, mod.id) === 100 && !isModuleComplete(currentProgress, mod.id)) {
      setView({ type: 'quiz', moduleId: mod.id });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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

  const continueAfterQuiz = (moduleId: string) => {
    const currentProgress = readProgress();
    const moduleIndex = modules.findIndex(item => item.id === moduleId);
    const nextModule = moduleIndex >= 0 ? modules[moduleIndex + 1] : undefined;

    if (nextModule && isModuleUnlocked(currentProgress, nextModule.id)) {
      void startCourse(nextModule);
      return;
    }

    setView({ type: 'overview' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (user && (profileLoading || appUserProfile === undefined)) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="rounded-2xl border border-primary-100 bg-primary-50 p-8 text-center font-semibold text-primary-900">
          Loading your profile...
        </div>
      </div>
    );
  }

  if (user && profileError) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center font-semibold text-red-700">
          {profileError}
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
    <div className="min-h-screen bg-[#fbfbf2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
      <DashboardNav view={view} onView={(next) => { setView(next); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      <div className="mb-6 flex flex-col gap-3 rounded-[24px] border border-primary-100 bg-primary-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Signed in</p>
          <p className="mt-1 text-sm font-semibold text-primary-950">{getUserDisplayName(user, resolvedAppUserProfile)}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          disabled={logoutLoading}
          className="rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
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
          onMealBuilder={() => { setView({ type: 'meal-builder' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      )}
      {view.type === 'lesson' && (
        <LessonView
          moduleId={view.moduleId}
          lessonId={view.lessonId}
          progress={progress}
          onComplete={() => markComplete(view.moduleId, view.lessonId)}
          onNext={(mid, lid) => goToLesson(mid, lid)}
        />
      )}
      {view.type === 'quiz' && (
        <QuizView
          moduleId={view.moduleId}
          onSave={(score, total) => saveQuiz(view.moduleId, score, total)}
          onContinue={() => continueAfterQuiz(view.moduleId)}
          onBack={() => setView({ type: 'overview' })}
        />
      )}
      {view.type === 'meal-builder' && (
        <MealBuilderView onBack={() => setView({ type: 'overview' })} />
      )}
      {view.type === 'progress' && <ProgressView progress={progress} />}
      {view.type === 'about' && <AboutCourseView />}
      {view.type === 'profile' && <DashboardProfileView user={user} profile={resolvedAppUserProfile} />}
      </div>
    </div>
  );
};
