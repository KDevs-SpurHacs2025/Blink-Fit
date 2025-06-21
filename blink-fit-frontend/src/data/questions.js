const questions = [
  {
    type: "choice",
    name: "wearGlasses",
    question: "Do you wear glasses or contact lenses?",
    options: [
      { text: "I don't wear any", level: 0 },
      { text: "Glasses", level: 0 },
      { text: "Contact Lenses", level: 0 },
    ],
  },
  {
    type: "choice",
    name: "eyeConditions",
    question: "Do you have any of the following eye conditions?",
    options: [
      { text: "Dry eyes", level: 0 },
      { text: "Astigmatism", level: 0 },
      { text: "Myopia (Nearsightedness)", level: 0 },
      { text: "Hyperopia (Farsightedness)", level: 0 },
      { text: "Glaucoma", level: 0 },
      { text: "None of the above", level: 0 },
      { text: "I'm not sure", level: 0 },
    ],
  },
  {
    type: "choice",
    name: "eyeStrain",
    question: "Do your eyes feel tired, dry, or strained while using screens?",
    options: [
      { text: "Very often", level: 0 },
      { text: "Sometimes", level: 0 },
      { text: "Rarely", level: 0 },
      { text: "Never", level: 0 },
    ],
  },
  {
    type: "choice",
    name: "screenHours",
    question: "How many hours do you spend on screens daily?",
    options: [
      { text: "Less than 2 hours", level: 0 },
      { text: "2-6 hours", level: 0 },
      { text: "More than 6 hours", level: 0 },
    ],
  },
  {
    type: "choice",
    name: "lightSensitive",
    question: "Are your eyes sensitive to light?",
    options: [
      { text: "Yes", level: 0 },
      { text: "No", level: 0 },
      { text: "Not sure", level: 0 },
    ],
  },
  {
    type: "choice",
    name: "headaches",
    question: "Do you get headaches or blurry vision after using screens?",
    options: [
      { text: "Yes", level: 0 },
      { text: "No", level: 0 },
      { text: "Sometimes", level: 0 },
    ],
  },
  {
    type: "choice",
    name: "goOutside",
    question: "Will you be able to go outside during your breaks today?",
    options: [
      { text: "Yes", level: 0 },
      { text: "No", level: 0 },
    ],
  },
  {
    type: "input",
    question: "Total screen time goal for the day (hours)",
    inputType: "number",
    name: "screenTimeGoal",
  },
  {
    type: "input",
    question: "Typical focus session length (minutes)",
    inputType: "number",
    name: "focusSessionLength",
  },
  {
    type: "input",
    question: "What's your break-time vibe?",
    inputType: "text",
    name: "breakPreference",
  },
  {
    type: "input",
    question: "Do you have a favorite snack during breaks?",
    inputType: "text",
    name: "favoriteSnack",
  },
];

export default questions;
