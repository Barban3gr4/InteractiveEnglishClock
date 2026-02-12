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
  for (let i = 0; i < 60; i++) {
    const mark = document.createElement("div");
    mark.className = i % 5 === 0 ? "hour-mark" : "min-mark";
    mark.style.position = "absolute";
    mark.style.width = i % 5 === 0 ? "2px" : "1px";
    mark.style.height = i % 5 === 0 ? "12px" : "6px";
    mark.style.background = i % 5 === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)";
    mark.style.left = "50%";
    mark.style.top = "2px";
    mark.style.transformOrigin = "50% 158px";
    mark.style.transform = `translateX(-50%) rotate(${i * 6}deg)`;
    face.appendChild(mark);
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

  // For other minutes, provide a natural but flexible way
  if (m > 0 && m < 30) {
    return `${m} minutes past ${numberWords[h]}`;
  } else if (m > 30) {
    return `${60 - m} minutes to ${numberWords[nextH]}`;
  }

  return `${h}:${m.toString().padStart(2, "0")}`; // Fallback
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

timeInput.addEventListener("input", updateClock);

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
