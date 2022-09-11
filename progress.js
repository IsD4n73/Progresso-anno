const daysContainer = document.getElementById("days_cont");
const yBar = document.getElementById("yp_bar");
const mBar = document.getElementById("mp_bar");
const dBar = document.getElementById("dp_bar");
const hBar = document.getElementById("hp_bar");
const yText = document.getElementById("yp_text");
const mText = document.getElementById("mp_text");
const dText = document.getElementById("dp_text");
const hText = document.getElementById("hp_text");
const yNum = document.getElementById("year_num");
let curYearPercent = 0;
const updInterval = 750;
let margin = getComputedStyle(document.documentElement)
	.getPropertyValue("--gridMargin")
	.replace("px", "");
const daynNite = document.getElementById("day_night");

const setDaySize = () => {
	const { width, height } = daysContainer.getBoundingClientRect();
	let contSize = Math.floor(Math.sqrt((width * height) / 365));
	contSize -= margin * 2;
	document.documentElement.style.setProperty("--day_size", contSize + "px");
};

const getDaysArray = (daysCount) => {
	const wrapper = document.createDocumentFragment();
	for (let i = 1; i <= daysCount; i++) {
		let day = document.createElement("div");
		wrapper.append(day);
	}
	return wrapper;
};

const setHoursBarWidth = (date, now) => {
	let elapsed = now - date;
	elapsed = elapsed / 1000 / 60 / 60;
	elapsed = Math.round(elapsed * 10000) / 100 + "%";
	hText.textContent = elapsed;
	hBar.style.width = elapsed;
};

const setDayBarWidth = (date, now) => {
	let elapsed = now - date;
	elapsed = elapsed / 1000 / 60 / 60 / 24;
	elapsed = Math.round(elapsed * 100000) / 1000 + "%";
	dText.textContent = elapsed;
	dBar.style.width = elapsed;
};

const setMonthBarWidth = (date, now) => {
	let elapsed = now - date;
	let curMonthLength = new Date(
		now.getFullYear(),
		now.getMonth() + 1,
		0
	).getDate();
	elapsed = elapsed / 1000 / 60 / 60 / 24 / curMonthLength;
	elapsed = Math.round(elapsed * 1000000) / 10000 + "%";
	mText.textContent = elapsed;
	mBar.style.width = elapsed;
};

const setYearBarWidth = (date, now) => {
	let elapsed = now - date;
	elapsed = elapsed / 1000 / 60 / 60 / 24 / numOfDays(now.getFullYear());
	elapsed = Math.round(elapsed * 10000000) / 100000;
	curYearPercent = elapsed;
	elapsed += "%";
	yText.textContent = elapsed;
	yBar.style.width = elapsed;
};

const setDaysCurrent = () => {
	const currDayNum =
		1 + Math.floor((curYearPercent * daysContainer.childNodes.length) / 100);
	Array.from({ length: currDayNum }, (element, index) => {
		daysContainer
			.querySelector(`:nth-child(${index + 1})`)
			.classList.add("passed");
	});
	daysContainer
		.querySelector(`:nth-child(${currDayNum})`)
		.classList.add("flicker");
};

const startCalculating = () => {
	let date = new Date();
	let now = new Date();
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	setHoursBarWidth(date, now);
	date.setHours(0);
	setDayBarWidth(date, now);
	date.setDate(1);
	setMonthBarWidth(date, now);
	date.setMonth(0);
	setYearBarWidth(date, now);
};

const setYearNumber = () => {
	yNum.innerText = new Date().getFullYear();
};

const init = () => {
	setDaySize();
	daysContainer.append(getDaysArray(365));
	setYearNumber();
	startCalculating();
	setDaysCurrent();
	setInterval(() => {
		startCalculating();
	}, updInterval);
	window.addEventListener("resize", () => {
		daysContainer.innerHTML = "";
		setDaySize();
		daysContainer.append(getDaysArray(365));
		setDaysCurrent();
	});
};

document.addEventListener("DOMContentLoaded", () => {
	init();
});

const dayNightChange = () => {
	if (!daynNite.classList.contains("light")) {
		document.documentElement.style.setProperty("--black", "#111");
		document.documentElement.style.setProperty("--white", "#eee");
		daynNite.classList.toggle("light");
	} else {
		document.documentElement.style.setProperty("--black", "#eee");
		document.documentElement.style.setProperty("--white", "#111");
		daynNite.classList.toggle("light");
	}
};

daynNite.addEventListener("click", () => {
	dayNightChange();
});

const numOfDays = (year) => (isLeapYear(year) ? 366 : 365);

const isLeapYear = (year) => year % 4 === 0;