const questions = [
  {
    type: "choice",
    name: "wearGlasses",
    question: "Do you wear glasses or contact lenses?",
    options: [
      "I don't wear any",
      "Glasses",
      "Contact Lenses"
    ]
  },
  {
    type: "choice",
    name: "eyeConditions",
    question: "Do you have any of the following eye conditions?",
    options: [
      "Dry eyes",
      "Astigmatism",
      "Myopia (Nearsightedness)",
      "Hyperopia (Farsightedness)",
      "Glaucoma",
      "None of the above",
      "I'm not sure"
    ]
  },
    {
    type: "choice",
    name: "eyeStrain",
    question: "Do your eyes feel tried, dry, or strained while using screens?",
    options: [
      "Very often",
      "Sometimes",
      "Rarely",
      "Never"
    ]
  },
    {
    type: "choice",
    name: "screenHours",
    question: "How many hours do you spend on screens daily?",
    options: [
      "Less than 2 hours",
      "2-6 hours",
      "More than 6 hours"
    ]
  },
    {
    type: "choice",
    name: "lightSensitive",
    question: "Are your eyes sensitive to light?",
    options: [
      "Yes",
      "No",
      "Not sure"
    ]
  },
    {
    type: "choice",
    name: "headaches",
    question: "Do you get headaches or blurry vision after using screens?",
    options: [
      "Yes",
      "No",
      "Sometimes"
    ]
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
    name: "breakVibe",
  },
];

export default questions;