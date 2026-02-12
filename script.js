const timeInput = document.getElementById("timeInput");
const hourHand = document.getElementById("hourHand");
const minHand = document.getElementById("minHand");
const englishOutput = document.getElementById("englishOutput");

const numberWords = [
  "twelve",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
];

function createMarkers() {
  const face = document.querySelector(".clock-face");
  const markersContainer = document.getElementById("clockMarkers");
  
  // Create ticks
  for (let i = 0; i < 60; i++) {
    const mark = document.createElement("div");
    mark.className = i % 5 === 0 ? "hour-mark" : "min-mark";
    mark.style.position = "absolute";
    mark.style.width = i % 5 === 0 ? "2px" : "1px";
    mark.style.height = i % 5 === 0 ? "10px" : "5px";
    mark.style.background = i % 5 === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)";
    mark.style.left = "50%";
    mark.style.top = "5px";
    mark.style.transformOrigin = "50% 140px";
    mark.style.transform = `translateX(-50%) rotate(${i * 6}deg)`;
    face.appendChild(mark);
  }

  // Create numbers 1-12
  for (let i = 1; i <= 12; i++) {
    const number = document.createElement("span");
    number.className = "marker";
    number.textContent = i;
    
    // Position numbers in a circle
    const angle = (i * 30) * (Math.PI / 180);
    const radius = 115; // Distance from center
    const x = Math.sin(angle) * radius;
    const y = -Math.cos(angle) * radius;
    
    number.style.transform = `translate(${x}px, ${y}px)`;
    markersContainer.appendChild(number);
  }
}

createMarkers();

function updateClock() {
  const timeValue = timeInput.value;
  if (!timeValue) return;

  const [hours24, minutes] = timeValue.split(":").map(Number);
  const hours = hours24 % 12;

  // Update hands
  const minDegrees = (minutes / 60) * 360;
  const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

  minHand.style.transform = `rotate(${minDegrees}deg)`;
  hourHand.style.transform = `rotate(${hourDegrees}deg)`;

  // Visual feedback for zones
  const pastZone = document.querySelector(".zone.past");
  const toZone = document.querySelector(".zone.to");
  
  if (minutes === 0) {
    pastZone.style.opacity = "0.05";
    toZone.style.opacity = "0.05";
  } else if (minutes <= 30) {
    pastZone.style.opacity = "0.3";
    toZone.style.opacity = "0.05";
  } else {
    pastZone.style.opacity = "0.05";
    toZone.style.opacity = "0.3";
  }

  // Update English text
  englishOutput.textContent = convertTimeToEnglish(hours24, minutes);
}

function numberToWords(n) {
  const units = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
  ];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty"];

  if (n < 20) return units[n];
  const unit = n % 10;
  return tens[Math.floor(n / 10)] + (unit !== 0 ? "-" + units[unit] : "");
}

function convertTimeToEnglish(h24, m) {
  let h = h24 % 12;
  if (h === 0) h = 12;

  const nextH = (h % 12) + 1;

  // Mapping exactly to the diagram
  if (m === 0) return `${capitalize(numberWords[h])} o'clock`;
  if (m === 5) return `Five past ${numberWords[h]}`;
  if (m === 10) return `Ten past ${numberWords[h]}`;
  if (m === 15) return `Quarter past ${numberWords[h]}`;
  if (m === 20) return `Twenty past ${numberWords[h]}`;
  if (m === 25) return `Twenty-five past ${numberWords[h]}`;
  if (m === 30) return `Half past ${numberWords[h]}`;

  if (m === 35) return `Twenty-five to ${numberWords[nextH]}`;
  if (m === 40) return `Twenty to ${numberWords[nextH]}`;
  if (m === 45) return `Quarter to ${numberWords[nextH]}`;
  if (m === 50) return `Ten to ${numberWords[nextH]}`;
  if (m === 55) return `Five to ${numberWords[nextH]}`;

  // For other minutes, provide a natural way with words
  if (m > 0 && m < 30) {
    const minWord = numberToWords(m);
    return `${capitalize(minWord)} ${m === 1 ? "minute" : "minutes"} past ${numberWords[h]}`;
  } else if (m > 30) {
    const minRemaining = 60 - m;
    const minWord = numberToWords(minRemaining);
    return `${capitalize(minWord)} ${minRemaining === 1 ? "minute" : "minutes"} to ${numberWords[nextH]}`;
  }

  return `${h}:${m.toString().padStart(2, "0")}`; // Fallback
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

timeInput.addEventListener("input", updateClock);

// Speech Synthesis
const speakBtn = document.getElementById("speakBtn");
speakBtn.addEventListener("click", () => {
  const text = `It's ${englishOutput.textContent}`;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  
  // Highlight card during speech
  const card = document.getElementById("translationResult");
  card.style.borderColor = "var(--primary)";
  card.style.boxShadow = "0 0 30px rgba(99, 102, 241, 0.2)";
  
  utterance.onend = () => {
    card.style.borderColor = "rgba(255, 255, 255, 0.05)";
    card.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.3)";
  };

  window.speechSynthesis.cancel(); // Cancel any ongoing speech
  window.speechSynthesis.speak(utterance);
});

// Initialize
updateClock();

// Reference grid interaction
document.querySelectorAll(".ref-item").forEach((item) => {
  item.addEventListener("click", () => {
    const min = item.getAttribute("data-min");
    const [h] = timeInput.value.split(":");
    timeInput.value = `${h}:${min.toString().padStart(2, "0")}`;
    updateClock();
  });
});
