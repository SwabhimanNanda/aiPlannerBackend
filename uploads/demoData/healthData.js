const healthData = [
  {
    slug: 1,
    date: "April 13",
    overview: {
      steps: 7452,
      calories: 1200,
      sleep: "7.5h",
      bpm: 72,
    },
    goalProgress: {
      steps: { current: 7452, goal: 10000 },
      water: { current: 5, goal: 8 },
      activeMinutes: { current: 35, goal: 60 },
    },
    waterIntake: { value: 1.2, goal: 2.0, unit: "L" },
    nutrition: [
      { type: "Carbs", percentage: 60 },
      { type: "Protein", percentage: 20 },
      { type: "Fats", percentage: 20 },
    ],
  },
  {
    slug: 2,
    date: "April 14",
    overview: {
      steps: 10032,
      calories: 1450,
      sleep: "6.8h",
      bpm: 76,
    },
    goalProgress: {
      steps: { current: 10032, goal: 10000 },
      water: { current: 7, goal: 8 },
      activeMinutes: { current: 60, goal: 60 },
    },
    waterIntake: { value: 1.8, goal: 2.0, unit: "L" },
    nutrition: [
      { type: "Carbs", percentage: 55 },
      { type: "Protein", percentage: 25 },
      { type: "Fats", percentage: 20 },
    ],
  },
  {
    slug: 3,
    date: "April 15",
    overview: {
      steps: 5820,
      calories: 1100,
      sleep: "8.1h",
      bpm: 68,
    },
    goalProgress: {
      steps: { current: 5820, goal: 10000 },
      water: { current: 6, goal: 8 },
      activeMinutes: { current: 40, goal: 60 },
    },
    waterIntake: { value: 1.4, goal: 2.0, unit: "L" },
    nutrition: [
      { type: "Carbs", percentage: 50 },
      { type: "Protein", percentage: 30 },
      { type: "Fats", percentage: 20 },
    ],
  },
  {
    slug: 4,
    date: "April 16",
    overview: {
      steps: 8903,
      calories: 1350,
      sleep: "7.0h",
      bpm: 74,
    },
    goalProgress: {
      steps: { current: 8903, goal: 10000 },
      water: { current: 8, goal: 8 },
      activeMinutes: { current: 58, goal: 60 },
    },
    waterIntake: { value: 2.0, goal: 2.0, unit: "L" },
    nutrition: [
      { type: "Carbs", percentage: 40 },
      { type: "Protein", percentage: 35 },
      { type: "Fats", percentage: 25 },
    ],
  },
  {
    slug: 5,
    date: "April 17",
    overview: {
      steps: 11200,
      calories: 1550,
      sleep: "6.3h",
      bpm: 78,
    },
    goalProgress: {
      steps: { current: 11200, goal: 10000 },
      water: { current: 4, goal: 8 },
      activeMinutes: { current: 50, goal: 60 },
    },
    waterIntake: { value: 1.1, goal: 2.0, unit: "L" },
    nutrition: [
      { type: "Carbs", percentage: 65 },
      { type: "Protein", percentage: 15 },
      { type: "Fats", percentage: 20 },
    ],
  },
  {
    slug: 6,
    date: "April 18",
    overview: {
      steps: 9650,
      calories: 1400,
      sleep: "7.9h",
      bpm: 71,
    },
    goalProgress: {
      steps: { current: 9650, goal: 10000 },
      water: { current: 7, goal: 8 },
      activeMinutes: { current: 55, goal: 60 },
    },
    waterIntake: { value: 1.7, goal: 2.0, unit: "L" },
    nutrition: [
      { type: "Carbs", percentage: 50 },
      { type: "Protein", percentage: 30 },
      { type: "Fats", percentage: 20 },
    ],
  },
  {
    slug: 7,
    date: "April 19",
    overview: {
      steps: 4200,
      calories: 950,
      sleep: "5.5h",
      bpm: 80,
    },
    goalProgress: {
      steps: { current: 4200, goal: 10000 },
      water: { current: 3, goal: 8 },
      activeMinutes: { current: 20, goal: 60 },
    },
    waterIntake: { value: 0.9, goal: 2.0, unit: "L" },
    nutrition: [
      { type: "Carbs", percentage: 70 },
      { type: "Protein", percentage: 10 },
      { type: "Fats", percentage: 20 },
    ],
  },
  {
    slug: 8,
    date: "April 20",
    overview: {
      steps: 10150,
      calories: 1480,
      sleep: "7.2h",
      bpm: 70,
    },
    goalProgress: {
      steps: { current: 10150, goal: 10000 },
      water: { current: 8, goal: 8 },
      activeMinutes: { current: 63, goal: 60 },
    },
    waterIntake: { value: 2.1, goal: 2.0, unit: "L" },
    nutrition: [
      { type: "Carbs", percentage: 45 },
      { type: "Protein", percentage: 35 },
      { type: "Fats", percentage: 20 },
    ],
  },
  {
    slug: 9,
    date: "April 21",
    overview: {
      steps: 7500,
      calories: 1200,
      sleep: "6.5h",
      bpm: 73,
    },
    goalProgress: {
      steps: { current: 7500, goal: 10000 },
      water: { current: 6, goal: 8 },
      activeMinutes: { current: 42, goal: 60 },
    },
    waterIntake: { value: 1.5, goal: 2.0, unit: "L" },
    nutrition: [
      { type: "Carbs", percentage: 55 },
      { type: "Protein", percentage: 25 },
      { type: "Fats", percentage: 20 },
    ],
  },
  {
    slug: 10,
    date: "April 22",
    overview: {
      steps: 8700,
      calories: 1320,
      sleep: "8.0h",
      bpm: 69,
    },
    goalProgress: {
      steps: { current: 8700, goal: 10000 },
      water: { current: 7, goal: 8 },
      activeMinutes: { current: 59, goal: 60 },
    },
    waterIntake: { value: 1.9, goal: 2.0, unit: "L" },
    nutrition: [
      { type: "Carbs", percentage: 50 },
      { type: "Protein", percentage: 30 },
      { type: "Fats", percentage: 20 },
    ],
  },
];

module.exports = healthData;
