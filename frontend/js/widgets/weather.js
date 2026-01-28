import { WEATHER_API_KEY } from "../config.js";

export const weatherWidget = {
  id: "w7",
  type: "weather",
  w: 1,   // 1 column wide
  h: 2,   // 2 rows tall
  render(el) {
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.justifyContent = "flex-start";
    el.style.background = "#1e1e1e";
    el.style.borderRadius = "10px";
    el.style.padding = "12px";
    el.style.color = "white";
    el.style.fontFamily = "sans-serif";

    // Header elements
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.marginBottom = "8px";

    const city = document.createElement("div");
    city.style.fontSize = "14px";
    city.style.opacity = "0.8";

    const nowBox = document.createElement("div");
    nowBox.style.textAlign = "right";

    const current = document.createElement("div");
    current.style.fontSize = "28px";
    current.style.fontWeight = "700";
    current.style.lineHeight = "1";

    const condition = document.createElement("div");
    condition.style.fontSize = "14px";
    condition.style.opacity = "0.7";
    condition.style.marginTop = "2px";

    const sunEvent = document.createElement("div");
    sunEvent.style.fontSize = "12px";
    sunEvent.style.opacity = "0.7";
    sunEvent.style.marginTop = "6px";

    nowBox.append(current, condition, sunEvent);

    header.append(city, nowBox);

    // Hourly forecast container (vertical stacking now)
    const hours = document.createElement("div");
    hours.style.display = "flex";
    hours.style.flexDirection = "column";
    hours.style.justifyContent = "flex-start";
    hours.style.marginTop = "12px";
    hours.style.gap = "6px";

    el.append(header, hours);

    // Fallback mock data
    const fallbackMock = [
      { h: "Now", t: 72, i: "☀️" },
      { h: "3 PM", t: 73, i: "☀️" },
      { h: "4 PM", t: 72, i: "⛅" },
      { h: "5 PM", t: 70, i: "⛅" },
      { h: "6 PM", t: 68, i: "🌥" },
      { h: "7 PM", t: 66, i: "🌙" }
    ];

    function clearHours() {
      while (hours.firstChild) hours.removeChild(hours.firstChild);
    }

    function iconToEmoji(iconUrl) {
      if (!iconUrl) return "❓";
      if (iconUrl.includes("sunny")) return "☀️";
      if (iconUrl.includes("clear")) return "☀️";
      if (iconUrl.includes("partlycloudy")) return "⛅";
      if (iconUrl.includes("cloudy")) return "☁️";
      if (iconUrl.includes("rain")) return "🌧️";
      if (iconUrl.includes("snow")) return "❄️";
      if (iconUrl.includes("storm")) return "⛈️";
      if (iconUrl.includes("fog")) return "🌫️";
      if (iconUrl.includes("night")) return "🌙";
      return "❓";
    }

    async function fetchWeather() {
      const LOCATION = "Charlottesville, VA";

      try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(
          LOCATION
        )}&days=3&aqi=no&alerts=no`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();

        city.textContent = `${data.location.name}, ${data.location.region}`;

        const curr = data.current;
        current.textContent = `${Math.round(curr.temp_f)}°F`;
        condition.textContent = curr.condition.text;

        const localTime = new Date(data.location.localtime);
        const sunriseToday = data.forecast.forecastday[0].astro.sunrise;
        const sunsetToday = data.forecast.forecastday[0].astro.sunset;
        const sunriseTomorrow = data.forecast.forecastday[1].astro.sunrise;

        function parseTime(tstr) {
          const [time, ampm] = tstr.split(" ");
          let [hour, minute] = time.split(":").map(Number);
          if (ampm === "PM" && hour !== 12) hour += 12;
          if (ampm === "AM" && hour === 12) hour = 0;
          return { hour, minute };
        }
        function getDateForTime(baseDate, timeStr) {
          const { hour, minute } = parseTime(timeStr);
          const d = new Date(baseDate);
          d.setHours(hour, minute, 0, 0);
          return d;
        }

        const sunriseDate = getDateForTime(localTime, sunriseToday);
        const sunsetDate = getDateForTime(localTime, sunsetToday);

        let nextSun;
        if (localTime < sunriseDate) {
          nextSun = { type: "Sunrise", time: sunriseToday };
        } else if (localTime < sunsetDate) {
          nextSun = { type: "Sunset", time: sunsetToday };
        } else {
          nextSun = { type: "Sunrise", time: sunriseTomorrow };
        }
        sunEvent.textContent = `${nextSun.type} at ${nextSun.time}`;

        const nowEpoch = curr.last_updated_epoch;
        const todayHours = data.forecast.forecastday[0].hour;
        const next3Hours = todayHours
          .filter((h) => h.time_epoch > nowEpoch)
          .slice(0, 3);

        clearHours();

        function addHourRow(label, tempF, iconUrl) {
          const row = document.createElement("div");
          row.style.display = "flex";
          row.style.justifyContent = "space-between";
          row.style.fontSize = "12px";
          row.style.opacity = "0.9";

          const labelDiv = document.createElement("div");
          labelDiv.textContent = label;

          const iconDiv = document.createElement("div");
          iconDiv.textContent = iconToEmoji(iconUrl);
          iconDiv.style.fontSize = "18px";

          const tempDiv = document.createElement("div");
          tempDiv.textContent = `${Math.round(tempF)}°`;

          row.append(labelDiv, iconDiv, tempDiv);
          hours.appendChild(row);
        }

        addHourRow("Now", curr.temp_f, curr.condition.icon);

        next3Hours.forEach((h) =>
          addHourRow(
            new Date(h.time).toLocaleTimeString([], { hour: "numeric", hour12: true }),
            h.temp_f,
            h.condition.icon
          )
        );
      } catch (error) {
        console.error("Weather widget error:", error);

        city.textContent = "Charlottesville, VA";
        current.textContent = `${fallbackMock[0].t}°`;
        condition.textContent = "Sunny";
        sunEvent.textContent = "";

        clearHours();
        fallbackMock.forEach((m) => {
          const row = document.createElement("div");
          row.style.display = "flex";
          row.style.justifyContent = "space-between";
          row.style.fontSize = "12px";
          row.style.opacity = "0.9";

          const labelDiv = document.createElement("div");
          labelDiv.textContent = m.h;

          const iconDiv = document.createElement("div");
          iconDiv.textContent = m.i;
          iconDiv.style.fontSize = "18px";

          const tempDiv = document.createElement("div");
          tempDiv.textContent = `${m.t}°`;

          row.append(labelDiv, iconDiv, tempDiv);
          hours.appendChild(row);
        });
      }
    }

    fetchWeather();
    setInterval(fetchWeather, 10 * 60 * 1000);
  },
};
