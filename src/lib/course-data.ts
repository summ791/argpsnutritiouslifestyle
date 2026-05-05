export type Lesson = {
  id: string;
  title: string;
  intro: string;
  points: string[];
  examples: string[];
  takeaway: string;
};

export type QuizQuestion = {
  id: string;
  type: "mcq" | "tf" | "scenario";
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Module = {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
};

export const modules: Module[] = [
  {
    id: "m1",
    number: 1,
    title: "Introduction to Food & Nutrition",
    description: "Why food is fuel, not just taste — and how Tamil Nadu meals fit modern nutrition.",
    icon: "🌱",
    lessons: [
      {
        id: "m1-l1",
        title: "Food as Intelligent Fuel",
        intro: "Food is more than what we eat — it shapes our energy, clarity, and long-term health. Tamil Nadu's traditional dishes already contain the wisdom of balanced nutrition.",
        points: [
          "Food provides energy, builds tissues, and protects the body",
          "Sambar, rasam, poriyal, idli, dosa each have a nutritional role",
          "Tamil Nadu cooking naturally balances grains, dals, and vegetables",
          "Eating mindfully matters more than dieting",
        ],
        examples: [
          "2 idlis + sambar = light, protein-rich breakfast (~250 kcal)",
          "Rice + sambar + poriyal + curd = complete balanced lunch",
          "Banana + handful of nuts = healthy mid-morning snack",
        ],
        takeaway: "You don't need to give up tradition to eat well — you need to understand it.",
      },
      {
        id: "m1-l2",
        title: "Why This Approach Works",
        intro: "Most nutrition books focus on foreign foods. This course focuses only on what Tamil Nadu families actually eat every day.",
        points: [
          "Real home-cooked dishes — not imported diets",
          "Local fruits, millets, dals, and seafood",
          "Realistic Indian serving sizes (1 cup, 1 dosa, 1 ladle)",
          "Practical for students, homemakers, fitness lovers, elders",
        ],
        examples: [
          "1 dosa (medium) ≈ 100–150 g",
          "2 idlis ≈ 100 g",
          "1 cup cooked rice ≈ 150 g",
        ],
        takeaway: "Nutrition is universal — but the food on your plate should feel like home.",
      },
    ],
    quiz: [
      {
        id: "q1", type: "mcq",
        question: "What is the main purpose of food according to this course?",
        options: ["Only taste and pleasure", "Intelligent fuel for body and mind", "Just to fill the stomach", "Cultural tradition only"],
        answer: 1,
        explanation: "Food is intelligent fuel that powers energy, clarity and long-term wellness — taste and tradition are bonuses.",
      },
      {
        id: "q2", type: "tf",
        question: "Tamil Nadu traditional meals can be naturally balanced.",
        options: ["True", "False"],
        answer: 0,
        explanation: "Rice + sambar + poriyal + curd already provides carbs, protein, fiber, and probiotics together.",
      },
      {
        id: "q3", type: "mcq",
        question: "Which of these is closest to one standard serving?",
        options: ["5 idlis", "2 idlis (~100 g)", "1 idli", "10 idlis"],
        answer: 1,
        explanation: "2 idlis ≈ 100 g is the standard household serving used throughout this course.",
      },
    ],
  },
  {
    id: "m2",
    number: 2,
    title: "Calories & Food Understanding",
    description: "What calories really are and how to read any Tamil Nadu dish like a nutritionist.",
    icon: "🔥",
    lessons: [
      {
        id: "m2-l1",
        title: "What is a Calorie?",
        intro: "A calorie is simply a unit of energy. Foods give us energy — some give a lot, some give a little. Knowing the difference helps you choose without restricting.",
        points: [
          "Calories = energy your body uses for everything",
          "Carbs and protein = ~4 kcal/g, fat = ~9 kcal/g",
          "Portion size changes calorie intake more than the food itself",
          "Cooking method (fry vs steam) changes calorie count",
        ],
        examples: [
          "1 idli (steamed) ≈ 50 kcal",
          "1 medium dosa ≈ 130 kcal",
          "1 ghee dosa ≈ 200+ kcal",
        ],
        takeaway: "Same dish, different portion or cooking = different calories. Awareness, not avoidance.",
      },
    ],
    quiz: [
      {
        id: "q1", type: "mcq",
        question: "How many kcal per gram does fat provide?",
        options: ["4", "7", "9", "2"],
        answer: 2,
        explanation: "Fat provides ~9 kcal/g, more than double carbs and protein.",
      },
      {
        id: "q2", type: "scenario",
        question: "Priya eats 4 idlis with sambar. Roughly how many calories?",
        options: ["~100 kcal", "~250 kcal", "~500 kcal", "~1000 kcal"],
        answer: 1,
        explanation: "4 idlis (~200 kcal) + sambar (~50 kcal) ≈ 250 kcal — a light, balanced breakfast.",
      },
      {
        id: "q3", type: "tf",
        question: "Cooking method does not affect calorie count.",
        options: ["True", "False"],
        answer: 1,
        explanation: "Frying adds oil and calories. A steamed idli vs ghee dosa can differ by 150+ kcal.",
      },
    ],
  },
  {
    id: "m3",
    number: 3,
    title: "Measurement & Portion Control",
    description: "Estimate any meal without a weighing scale using household measures.",
    icon: "🥣",
    lessons: [
      {
        id: "m3-l1",
        title: "Household Measures",
        intro: "You don't need a kitchen scale. Tamil Nadu households already have natural measures — cup, ladle, tumbler, plate.",
        points: [
          "1 cup cooked rice ≈ 150 g",
          "1 ladle sambar/kuzhambu ≈ 100 ml",
          "1 chapati ≈ 50–60 g",
          "1 tsp oil ≈ 5 g ≈ 45 kcal",
        ],
        examples: [
          "Lunch plate: 1 cup rice + 1 ladle sambar + ½ cup poriyal",
          "Snack: 1 tumbler buttermilk + 1 banana",
          "Tip: Fill ½ plate with vegetables, ¼ rice, ¼ protein",
        ],
        takeaway: "Your hand and your plate are accurate enough. Consistency beats precision.",
      },
    ],
    quiz: [
      {
        id: "q1", type: "mcq",
        question: "Approximately how much does 1 cup cooked rice weigh?",
        options: ["50 g", "100 g", "150 g", "300 g"],
        answer: 2,
        explanation: "1 cup cooked rice ≈ 150 g, the standard Tamil Nadu household serving.",
      },
      {
        id: "q2", type: "mcq",
        question: "The 'half plate vegetables' rule helps with…",
        options: ["More fiber and fewer calories", "More fat", "Less protein", "More sugar"],
        answer: 0,
        explanation: "Half-plate veggies = high fiber, more fullness, fewer calories naturally.",
      },
    ],
  },
  {
    id: "m4",
    number: 4,
    title: "Daily Nutritional Needs",
    description: "How much energy and protein your body actually needs by age and activity.",
    icon: "⚖️",
    lessons: [
      {
        id: "m4-l1",
        title: "Calories & Protein by Activity",
        intro: "Your daily needs depend on age, gender, and how active you are. There's no single right number — but there's a right range.",
        points: [
          "Sedentary adult woman: ~1800 kcal/day",
          "Sedentary adult man: ~2200 kcal/day",
          "Active person: +300–500 kcal extra",
          "Protein minimum: 0.8 g × body weight (kg)",
          "Active individuals: 1.2–1.6 g × body weight",
        ],
        examples: [
          "60 kg woman, light activity ≈ 48 g protein/day",
          "70 kg man, gym goer ≈ 100 g protein/day",
          "1 cup dal + 2 idlis + 100 g chicken ≈ 35 g protein",
        ],
        takeaway: "Match your plate to your day — desk day or field day, your body knows the difference.",
      },
    ],
    quiz: [
      {
        id: "q1", type: "mcq",
        question: "Minimum daily protein for a 60 kg adult?",
        options: ["20 g", "48 g", "100 g", "200 g"],
        answer: 1,
        explanation: "0.8 × 60 = 48 g/day minimum.",
      },
      {
        id: "q2", type: "tf",
        question: "Active people need more protein than sedentary people.",
        options: ["True", "False"],
        answer: 0,
        explanation: "Active individuals need 1.2–1.6 g per kg body weight to repair and build tissue.",
      },
    ],
  },
  {
    id: "m5",
    number: 5,
    title: "Macronutrients & Micronutrients",
    description: "Carbs, protein, fat — plus vitamins and minerals that quietly run the show.",
    icon: "🧬",
    lessons: [
      {
        id: "m5-l1",
        title: "The Big Three: Carbs, Protein, Fat",
        intro: "Macronutrients give you energy and building blocks. Each plays a different role.",
        points: [
          "Carbs → main energy source (rice, millets, chapati, fruits)",
          "Protein → repair, muscle, immunity (dal, eggs, fish, paneer)",
          "Fat → hormones, brain, vitamin absorption (gingelly oil, coconut, ghee)",
          "Fiber → digestion and blood sugar (vegetables, whole grains)",
        ],
        examples: [
          "Carb-rich: rice, dosa, idli, chapati",
          "Protein-rich: dal, sambar, eggs, fish curry, chicken",
          "Healthy fats: gingelly oil, coconut, peanuts, almonds",
        ],
        takeaway: "Every meal should have all three: a grain, a protein, and a vegetable.",
      },
      {
        id: "m5-l2",
        title: "Vitamins & Minerals",
        intro: "Micronutrients are needed in tiny amounts but make a huge difference to energy, immunity, and mood.",
        points: [
          "Iron → keerai (greens), dates, jaggery, lentils",
          "Calcium → milk, curd, ragi, sesame",
          "Vitamin C → guava, lemon, amla, gooseberry",
          "Potassium → banana, coconut water, tomato",
        ],
        examples: [
          "1 cup cooked keerai = strong iron + calcium",
          "1 guava = full day's vitamin C",
          "1 glass tender coconut water = natural electrolytes",
        ],
        takeaway: "Color your plate. Different colors = different micronutrients.",
      },
    ],
    quiz: [
      {
        id: "q1", type: "mcq",
        question: "Which is the body's main energy source?",
        options: ["Protein", "Carbohydrates", "Fiber", "Water"],
        answer: 1,
        explanation: "Carbs are the primary fuel — especially for brain and muscles.",
      },
      {
        id: "q2", type: "scenario",
        question: "Ravi feels tired and his hemoglobin is low. Which Tamil Nadu food helps most?",
        options: ["White rice", "Keerai (greens) with dal", "Plain dosa", "Sugar tea"],
        answer: 1,
        explanation: "Keerai is iron-rich; combined with dal it boosts hemoglobin naturally.",
      },
      {
        id: "q3", type: "tf",
        question: "Healthy fats like gingelly oil are important for the body.",
        options: ["True", "False"],
        answer: 0,
        explanation: "Healthy fats support hormones, brain function, and absorption of vitamins A, D, E, K.",
      },
    ],
  },
  {
    id: "m6",
    number: 6,
    title: "Tamil Nadu Food Guide",
    description: "Calorie & nutrient values for the foods on your plate every day.",
    icon: "🌶️",
    lessons: [
      {
        id: "m6-l1",
        title: "Common Foods & Their Numbers",
        intro: "Real values for real Tamil Nadu foods, in real serving sizes.",
        points: [
          "Banana (1 medium, 130 g): 60 kcal, 15 g carbs, 1.1 g protein",
          "Watermelon (150 g): 45 kcal, 11 g carbs",
          "Pineapple (150 g): 75 kcal, 19 g carbs",
          "Beans (1 cup cooked): 45 kcal, high fiber",
          "Brown rice (1 cup cooked): 111 kcal, more fiber than white",
          "1 dosa (medium): ~130 kcal",
          "2 idlis: ~100 kcal",
        ],
        examples: [
          "Mango season: 1 medium mango ~150 kcal — enjoy, don't fear",
          "Switch white rice for brown rice 2–3x/week for extra fiber",
        ],
        takeaway: "Numbers are guides, not rules. Use them to plan, not to panic.",
      },
    ],
    quiz: [
      {
        id: "q1", type: "mcq",
        question: "Calories in 1 medium banana (130 g)?",
        options: ["~30", "~60", "~150", "~250"],
        answer: 1,
        explanation: "1 medium banana ≈ 60 kcal — perfect natural snack.",
      },
      {
        id: "q2", type: "mcq",
        question: "Brown rice vs white rice mainly differs in…",
        options: ["Color only", "Fiber content", "Calories only", "Taste only"],
        answer: 1,
        explanation: "Brown rice keeps the bran — much more fiber and minerals than polished white rice.",
      },
    ],
  },
  {
    id: "m7",
    number: 7,
    title: "Real Meal Combinations",
    description: "Build a balanced plate using real Tamil Nadu meals, not imported templates.",
    icon: "🍽️",
    lessons: [
      {
        id: "m7-l1",
        title: "Balanced Plate, Tamil Nadu Style",
        intro: "Forget Western 'protein bowls'. Your sambar-sadam can already be a textbook balanced meal.",
        points: [
          "Breakfast: 2 idlis + sambar + 1 tsp coconut chutney (~300 kcal)",
          "Lunch: 1 cup rice + 1 ladle sambar + ½ cup poriyal + ½ cup curd (~450 kcal)",
          "Snack: 1 banana + handful peanuts (~200 kcal)",
          "Dinner: 2 chapati + 1 cup dal + ½ cup vegetable curry (~400 kcal)",
        ],
        examples: [
          "Light dinner option: 1 bowl rasam rice + poriyal",
          "Higher protein lunch: add 1 boiled egg or 100 g fish curry",
          "Millet swap: ragi dosa instead of rice dosa",
        ],
        takeaway: "Three components per meal: grain + protein + vegetable. That's it.",
      },
    ],
    quiz: [
      {
        id: "q1", type: "scenario",
        question: "Which is the most balanced lunch?",
        options: [
          "2 cups rice + pickle",
          "1 cup rice + sambar + poriyal + curd",
          "Only fruits",
          "Only chicken biryani",
        ],
        answer: 1,
        explanation: "Rice + dal-based sambar + vegetable poriyal + curd covers carbs, protein, fiber, probiotics.",
      },
      {
        id: "q2", type: "tf",
        question: "A balanced plate needs at least one Western superfood.",
        options: ["True", "False"],
        answer: 1,
        explanation: "Local foods like keerai, drumstick, ragi, and dal are already superfoods.",
      },
    ],
  },
  {
    id: "m8",
    number: 8,
    title: "Smart Eating System",
    description: "Habits and frameworks to eat well for life — without dieting.",
    icon: "🌟",
    lessons: [
      {
        id: "m8-l1",
        title: "The Smart Eating Rules",
        intro: "Sustainable nutrition isn't a 30-day plan. It's small rules you keep forever.",
        points: [
          "Eat slowly — your stomach signals fullness in ~20 minutes",
          "Half-plate vegetables, always",
          "Drink water before meals, not during, where possible",
          "Don't skip meals — it leads to overeating later",
          "Sweets are okay occasionally, not daily",
          "Sleep and stress affect nutrition as much as food",
        ],
        examples: [
          "Hotel meals: share biryani, add raita and salad",
          "Festival food: enjoy, then return to normal next meal",
          "Hydration: 2.5–3 L water/day for adults",
        ],
        takeaway: "Eat smart, not less. Tradition + awareness = lifelong wellness.",
      },
    ],
    quiz: [
      {
        id: "q1", type: "tf",
        question: "Skipping meals is a healthy way to lose weight.",
        options: ["True", "False"],
        answer: 1,
        explanation: "Skipping leads to overeating later and slows metabolism. Regular balanced meals work better.",
      },
      {
        id: "q2", type: "mcq",
        question: "Recommended water intake for an adult?",
        options: ["0.5 L", "1 L", "2.5–3 L", "6 L"],
        answer: 2,
        explanation: "About 2.5–3 L per day supports digestion, energy, and skin health.",
      },
      {
        id: "q3", type: "scenario",
        question: "You're invited to a festival biryani lunch. Smart approach?",
        options: [
          "Skip it entirely",
          "Eat double to enjoy",
          "Enjoy a normal portion with raita and salad, return to balanced eating next meal",
          "Eat only rice without curry",
        ],
        answer: 2,
        explanation: "One meal won't undo health. Balance is built across days, not single meals.",
      },
    ],
  },
];

export type FoodItem = {
  name: string;
  emoji: string;
  category: "Breakfast" | "Grains" | "Curries & Dals" | "Non-Veg" | "Vegetables" | "Fruits" | "Snacks" | "Dairy" | "Beverages";
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export const foodItems: FoodItem[] = [
  // Breakfast
  { name: "Idli", emoji: "🍥", category: "Breakfast", serving: "1 piece (~50 g)", calories: 50, protein: 2, carbs: 10, fat: 0.2 },
  { name: "Plain Dosa", emoji: "🥞", category: "Breakfast", serving: "1 medium", calories: 130, protein: 3, carbs: 25, fat: 2 },
  { name: "Masala Dosa", emoji: "🥞", category: "Breakfast", serving: "1 medium", calories: 250, protein: 5, carbs: 40, fat: 8 },
  { name: "Ghee Dosa", emoji: "🧈", category: "Breakfast", serving: "1 medium", calories: 200, protein: 3, carbs: 25, fat: 9 },
  { name: "Ragi Dosa", emoji: "🌾", category: "Breakfast", serving: "1 medium", calories: 110, protein: 3, carbs: 22, fat: 1.5 },
  { name: "Pongal", emoji: "🍚", category: "Breakfast", serving: "1 cup", calories: 280, protein: 8, carbs: 45, fat: 7 },
  { name: "Upma", emoji: "🥣", category: "Breakfast", serving: "1 cup", calories: 220, protein: 5, carbs: 35, fat: 7 },
  { name: "Pesarattu", emoji: "🟢", category: "Breakfast", serving: "1 medium", calories: 150, protein: 8, carbs: 22, fat: 3 },
  { name: "Adai", emoji: "🥮", category: "Breakfast", serving: "1 medium", calories: 180, protein: 7, carbs: 25, fat: 5 },
  { name: "Uttapam", emoji: "🍕", category: "Breakfast", serving: "1 medium", calories: 170, protein: 4, carbs: 28, fat: 4 },
  { name: "Vada", emoji: "🍩", category: "Breakfast", serving: "1 piece", calories: 130, protein: 4, carbs: 15, fat: 6 },
  { name: "Poori", emoji: "🫓", category: "Breakfast", serving: "1 piece", calories: 120, protein: 2, carbs: 15, fat: 6 },
  { name: "Idiyappam", emoji: "🍜", category: "Breakfast", serving: "2 pieces", calories: 160, protein: 3, carbs: 35, fat: 0.5 },
  { name: "Appam", emoji: "🥯", category: "Breakfast", serving: "1 piece", calories: 120, protein: 2, carbs: 22, fat: 2 },

  // Grains
  { name: "White Rice (1 cup)", emoji: "🍚", category: "Grains", serving: "1 cup cooked", calories: 200, protein: 4, carbs: 45, fat: 0.5 },
  { name: "Brown Rice (1 cup)", emoji: "🌾", category: "Grains", serving: "1 cup cooked", calories: 111, protein: 2.5, carbs: 23, fat: 1 },
  { name: "Hand-pounded Rice", emoji: "🌾", category: "Grains", serving: "1 cup cooked", calories: 170, protein: 3.5, carbs: 38, fat: 1 },
  { name: "Chapati", emoji: "🫓", category: "Grains", serving: "1 piece (~50 g)", calories: 120, protein: 3, carbs: 20, fat: 3 },
  { name: "Wheat Roti", emoji: "🫓", category: "Grains", serving: "1 piece", calories: 100, protein: 3, carbs: 18, fat: 2 },
  { name: "Ragi Mudde", emoji: "🟤", category: "Grains", serving: "1 ball", calories: 130, protein: 3, carbs: 27, fat: 1 },
  { name: "Foxtail Millet", emoji: "🌾", category: "Grains", serving: "1 cup cooked", calories: 150, protein: 4, carbs: 30, fat: 1.5 },
  { name: "Pearl Millet (Kambu)", emoji: "🌾", category: "Grains", serving: "1 cup cooked", calories: 160, protein: 5, carbs: 31, fat: 2 },
  { name: "Lemon Rice", emoji: "🍋", category: "Grains", serving: "1 cup", calories: 230, protein: 4, carbs: 42, fat: 5 },
  { name: "Curd Rice", emoji: "🥛", category: "Grains", serving: "1 cup", calories: 220, protein: 6, carbs: 40, fat: 4 },
  { name: "Tamarind Rice", emoji: "🍚", category: "Grains", serving: "1 cup", calories: 240, protein: 4, carbs: 42, fat: 6 },
  { name: "Coconut Rice", emoji: "🥥", category: "Grains", serving: "1 cup", calories: 260, protein: 4, carbs: 40, fat: 9 },
  { name: "Vegetable Biryani", emoji: "🍛", category: "Grains", serving: "1 cup", calories: 320, protein: 7, carbs: 45, fat: 12 },
  { name: "Chicken Biryani", emoji: "🍛", category: "Grains", serving: "1 cup", calories: 400, protein: 18, carbs: 45, fat: 15 },

  // Curries & Dals
  { name: "Sambar", emoji: "🍲", category: "Curries & Dals", serving: "1 ladle (~100 ml)", calories: 80, protein: 4, carbs: 12, fat: 1.5 },
  { name: "Rasam", emoji: "🍵", category: "Curries & Dals", serving: "1 ladle", calories: 40, protein: 2, carbs: 7, fat: 0.5 },
  { name: "Toor Dal", emoji: "🍛", category: "Curries & Dals", serving: "1 cup", calories: 180, protein: 12, carbs: 24, fat: 4 },
  { name: "Moong Dal", emoji: "🥘", category: "Curries & Dals", serving: "1 cup", calories: 160, protein: 13, carbs: 22, fat: 2 },
  { name: "Kuzhambu", emoji: "🍲", category: "Curries & Dals", serving: "1 ladle", calories: 100, protein: 4, carbs: 12, fat: 4 },
  { name: "Vatha Kuzhambu", emoji: "🍲", category: "Curries & Dals", serving: "1 ladle", calories: 110, protein: 3, carbs: 13, fat: 5 },
  { name: "Mor Kuzhambu", emoji: "🥛", category: "Curries & Dals", serving: "1 ladle", calories: 90, protein: 4, carbs: 8, fat: 5 },
  { name: "Kootu", emoji: "🥘", category: "Curries & Dals", serving: "1 cup", calories: 140, protein: 6, carbs: 18, fat: 5 },

  // Non-Veg
  { name: "Chicken Curry", emoji: "🍗", category: "Non-Veg", serving: "100 g", calories: 220, protein: 22, carbs: 5, fat: 12 },
  { name: "Chicken Chettinad", emoji: "🌶️", category: "Non-Veg", serving: "100 g", calories: 260, protein: 24, carbs: 6, fat: 15 },
  { name: "Grilled Chicken", emoji: "🍗", category: "Non-Veg", serving: "100 g", calories: 165, protein: 31, carbs: 0, fat: 4 },
  { name: "Fish Curry", emoji: "🐟", category: "Non-Veg", serving: "100 g", calories: 170, protein: 20, carbs: 4, fat: 8 },
  { name: "Fish Fry", emoji: "🐟", category: "Non-Veg", serving: "100 g", calories: 180, protein: 20, carbs: 3, fat: 9 },
  { name: "Prawn Curry", emoji: "🦐", category: "Non-Veg", serving: "100 g", calories: 160, protein: 22, carbs: 5, fat: 6 },
  { name: "Mutton Curry", emoji: "🍖", category: "Non-Veg", serving: "100 g", calories: 290, protein: 25, carbs: 4, fat: 20 },
  { name: "Boiled Egg", emoji: "🥚", category: "Non-Veg", serving: "1 large", calories: 70, protein: 6, carbs: 0.5, fat: 5 },
  { name: "Egg Omelette", emoji: "🍳", category: "Non-Veg", serving: "1 egg", calories: 100, protein: 7, carbs: 1, fat: 8 },
  { name: "Egg Curry", emoji: "🥚", category: "Non-Veg", serving: "1 egg + gravy", calories: 160, protein: 9, carbs: 6, fat: 11 },

  // Vegetables
  { name: "Beans Poriyal", emoji: "🫛", category: "Vegetables", serving: "½ cup", calories: 60, protein: 2, carbs: 8, fat: 2 },
  { name: "Cabbage Poriyal", emoji: "🥬", category: "Vegetables", serving: "½ cup", calories: 55, protein: 2, carbs: 7, fat: 2 },
  { name: "Carrot Poriyal", emoji: "🥕", category: "Vegetables", serving: "½ cup", calories: 70, protein: 1.5, carbs: 10, fat: 2 },
  { name: "Beetroot Poriyal", emoji: "🥗", category: "Vegetables", serving: "½ cup", calories: 75, protein: 2, carbs: 12, fat: 2 },
  { name: "Drumstick Sambar", emoji: "🌿", category: "Vegetables", serving: "1 ladle", calories: 90, protein: 4, carbs: 12, fat: 2 },
  { name: "Keerai (Greens)", emoji: "🥬", category: "Vegetables", serving: "1 cup cooked", calories: 50, protein: 4, carbs: 7, fat: 1 },
  { name: "Brinjal Curry", emoji: "🍆", category: "Vegetables", serving: "½ cup", calories: 90, protein: 2, carbs: 10, fat: 5 },
  { name: "Avial", emoji: "🥗", category: "Vegetables", serving: "1 cup", calories: 150, protein: 4, carbs: 12, fat: 10 },
  { name: "Ladies Finger Fry", emoji: "🌽", category: "Vegetables", serving: "½ cup", calories: 80, protein: 2, carbs: 9, fat: 4 },
  { name: "Pumpkin Curry", emoji: "🎃", category: "Vegetables", serving: "½ cup", calories: 70, protein: 1.5, carbs: 12, fat: 2 },
  { name: "Mixed Vegetable Curry", emoji: "🥗", category: "Vegetables", serving: "1 cup", calories: 120, protein: 3, carbs: 15, fat: 5 },

  // Fruits
  { name: "Banana", emoji: "🍌", category: "Fruits", serving: "1 medium (~130 g)", calories: 60, protein: 1, carbs: 15, fat: 0.1 },
  { name: "Mango", emoji: "🥭", category: "Fruits", serving: "1 medium", calories: 150, protein: 1.5, carbs: 38, fat: 0.6 },
  { name: "Watermelon", emoji: "🍉", category: "Fruits", serving: "150 g", calories: 45, protein: 1, carbs: 11, fat: 0.2 },
  { name: "Pineapple", emoji: "🍍", category: "Fruits", serving: "150 g", calories: 75, protein: 1, carbs: 19, fat: 0.2 },
  { name: "Guava", emoji: "🍐", category: "Fruits", serving: "1 medium", calories: 70, protein: 2.5, carbs: 15, fat: 1 },
  { name: "Papaya", emoji: "🧡", category: "Fruits", serving: "1 cup", calories: 60, protein: 1, carbs: 15, fat: 0.4 },
  { name: "Apple", emoji: "🍎", category: "Fruits", serving: "1 medium", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: "Orange", emoji: "🍊", category: "Fruits", serving: "1 medium", calories: 65, protein: 1, carbs: 16, fat: 0.2 },
  { name: "Pomegranate", emoji: "🍎", category: "Fruits", serving: "½ cup", calories: 70, protein: 1.5, carbs: 16, fat: 1 },
  { name: "Grapes", emoji: "🍇", category: "Fruits", serving: "1 cup", calories: 100, protein: 1, carbs: 27, fat: 0.2 },
  { name: "Sapota (Chikoo)", emoji: "🟫", category: "Fruits", serving: "1 medium", calories: 80, protein: 0.5, carbs: 20, fat: 1 },
  { name: "Jackfruit", emoji: "🟡", category: "Fruits", serving: "½ cup", calories: 75, protein: 1.5, carbs: 19, fat: 0.5 },
  { name: "Amla (Gooseberry)", emoji: "🟢", category: "Fruits", serving: "1 piece", calories: 15, protein: 0.3, carbs: 3, fat: 0.1 },
  { name: "Dates", emoji: "🟤", category: "Fruits", serving: "2 pieces", calories: 50, protein: 0.5, carbs: 13, fat: 0.1 },

  // Snacks
  { name: "Peanuts (handful)", emoji: "🥜", category: "Snacks", serving: "30 g", calories: 170, protein: 7, carbs: 5, fat: 14 },
  { name: "Almonds", emoji: "🌰", category: "Snacks", serving: "10 pieces", calories: 70, protein: 2.5, carbs: 2.5, fat: 6 },
  { name: "Cashews", emoji: "🥜", category: "Snacks", serving: "10 pieces", calories: 90, protein: 3, carbs: 5, fat: 7 },
  { name: "Roasted Chana", emoji: "🟡", category: "Snacks", serving: "30 g", calories: 110, protein: 6, carbs: 18, fat: 2 },
  { name: "Sundal", emoji: "🥗", category: "Snacks", serving: "½ cup", calories: 130, protein: 7, carbs: 18, fat: 3 },
  { name: "Murukku", emoji: "🥨", category: "Snacks", serving: "1 piece", calories: 90, protein: 1.5, carbs: 10, fat: 5 },
  { name: "Bhajji / Bonda", emoji: "🍩", category: "Snacks", serving: "1 piece", calories: 120, protein: 2, carbs: 14, fat: 6 },
  { name: "Coconut (fresh)", emoji: "🥥", category: "Snacks", serving: "30 g", calories: 100, protein: 1, carbs: 4, fat: 10 },

  // Dairy
  { name: "Curd", emoji: "🥛", category: "Dairy", serving: "½ cup", calories: 60, protein: 4, carbs: 5, fat: 3 },
  { name: "Buttermilk", emoji: "🥛", category: "Dairy", serving: "1 glass", calories: 40, protein: 3, carbs: 5, fat: 1 },
  { name: "Milk (toned)", emoji: "🥛", category: "Dairy", serving: "1 glass", calories: 120, protein: 6, carbs: 12, fat: 5 },
  { name: "Paneer", emoji: "🧀", category: "Dairy", serving: "50 g", calories: 130, protein: 9, carbs: 2, fat: 10 },
  { name: "Ghee", emoji: "🧈", category: "Dairy", serving: "1 tsp", calories: 45, protein: 0, carbs: 0, fat: 5 },

  // Beverages
  { name: "Filter Coffee", emoji: "☕", category: "Beverages", serving: "1 cup with sugar", calories: 80, protein: 3, carbs: 10, fat: 3 },
  { name: "Masala Tea", emoji: "🍵", category: "Beverages", serving: "1 cup with sugar", calories: 70, protein: 2, carbs: 9, fat: 3 },
  { name: "Tender Coconut Water", emoji: "🥥", category: "Beverages", serving: "1 glass", calories: 45, protein: 1.5, carbs: 9, fat: 0.5 },
  { name: "Lemon Water", emoji: "🍋", category: "Beverages", serving: "1 glass", calories: 25, protein: 0, carbs: 6, fat: 0 },
  { name: "Fresh Fruit Juice", emoji: "🧃", category: "Beverages", serving: "1 glass", calories: 110, protein: 1, carbs: 27, fat: 0.3 },
];

export function findLesson(moduleId: string, lessonId: string) {
  const m = modules.find((x) => x.id === moduleId);
  const l = m?.lessons.find((x) => x.id === lessonId);
  return m && l ? { module: m, lesson: l } : null;
}

export function getLessonNeighbors(moduleId: string, lessonId: string) {
  const allLessons: { moduleId: string; lessonId: string }[] = [];
  modules.forEach((m) => m.lessons.forEach((l) => allLessons.push({ moduleId: m.id, lessonId: l.id })));
  const idx = allLessons.findIndex((x) => x.moduleId === moduleId && x.lessonId === lessonId);
  return {
    prev: idx > 0 ? allLessons[idx - 1] : null,
    next: idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
    index: idx,
    total: allLessons.length,
  };
}
