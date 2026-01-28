import { WEATHER_API_KEY } from "../config.js";

export const weatherWidget = {
  id: "w7",
  type: "weather",
  w: 1,
  h: 2,
  render(el) {
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.justifyContent = "flex-start";
    el.style.background = "#1e1e1e";
    el.style.borderRadius = "10px";
    el.style.padding = "12px";
    el.style.color = "white";
    el.style.fontFamily = "sans-serif";

    // Header container
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

    const currentTemp = document.createElement("div");
    currentTemp.style.fontSize = "28px";
    currentTemp.style.fontWeight = "700";
    currentTemp.style.lineHeight = "1";

    const feelsLike = document.createElement("div");
    feelsLike.style.fontSize = "12px";
    feelsLike.style.opacity = "0.6";
    feelsLike.style.marginTop = "2px";

    const condition = document.createElement("div");
    condition.style.fontSize = "14px";
    condition.style.opacity = "0.7";
    condition.style.marginTop = "4px";

    const sunEvent = document.createElement("div");
    sunEvent.style.fontSize = "12px";
    sunEvent.style.opacity = "0.7";
    sunEvent.style.marginTop = "6px";

    nowBox.append(currentTemp, feelsLike, condition, sunEvent);
    header.append(city, nowBox);

    // Hourly forecast container (vertical)
    const hours = document.createElement("div");
    hours.style.display = "flex";
    hours.style.flexDirection = "column";
    hours.style.justifyContent = "flex-start";
    hours.style.marginTop = "12px";
    hours.style.gap = "6px";

    // Daily forecast container
    const dailyForecast = document.createElement("div");
    dailyForecast.style.marginTop = "12px";
    dailyForecast.style.fontSize = "12px";
    dailyForecast.style.opacity = "0.8";
    dailyForecast.style.display = "flex";
    dailyForecast.style.flexDirection = "column";
    dailyForecast.style.gap = "4px";

    el.append(header, hours, dailyForecast);

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
    function clearDaily() {
      while (dailyForecast.firstChild) dailyForecast.removeChild(dailyForecast.firstChild);
    }

    function iconToEmoji(iconUrl, conditionText = "") {
      if (!iconUrl) return "❓";
      const iconLower = iconUrl.toLowerCase();
      const condLower = conditionText.toLowerCase();
      if (iconLower.includes("sunny") || condLower.includes("sunny")) return "☀️";
      if (iconLower.includes("clear") || condLower.includes("clear")) return "☀️";
      if (iconLower.includes("partlycloudy") || condLower.includes("partly cloudy")) return "⛅";
      if (iconLower.includes("cloudy") || condLower.includes("cloudy")) return "☁️";
      if (iconLower.includes("rain") || condLower.includes("rain")) return "🌧️";
      if (iconLower.includes("snow") || condLower.includes("snow")) return "❄️";
      if (iconLower.includes("storm") || condLower.includes("storm")) return "⛈️";
      if (iconLower.includes("fog") || condLower.includes("fog")) return "🌫️";
      if (iconLower.includes("night") || condLower.includes("night")) return "🌙";
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
        currentTemp.textContent = `${Math.round(curr.temp_f)}°F`;
        feelsLike.textContent = `Feels like ${Math.round(curr.feelslike_f)}°F`;
        condition.textContent = curr.condition.text;

        // Next sunrise/sunset
        const localTime = new Date(data.location.localtime);

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

        const days = data.forecast.forecastday;
        const sunriseToday = days[0].astro.sunrise;
        const sunsetToday = days[0].astro.sunset;
        const sunriseTomorrow = days[1].astro.sunrise;

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

        // Next 3 hours forecast
        const nowEpoch = curr.last_updated_epoch;
        const todayHours = days[0].hour;
        const next3Hours = todayHours
          .filter(h => h.time_epoch > nowEpoch)
          .slice(0, 3);

        clearHours();

        function addHourRow(label, tempF, iconUrl, condText = "") {
          const row = document.createElement("div");
          row.style.display = "flex";
          row.style.justifyContent = "space-between";
          row.style.fontSize = "12px";
          row.style.opacity = "0.9";

          const labelDiv = document.createElement("div");
          labelDiv.textContent = label;

          const iconDiv = document.createElement("div");
          iconDiv.textContent = iconToEmoji(iconUrl, condText);
          iconDiv.style.fontSize = "18px";

          const tempDiv = document.createElement("div");
          tempDiv.textContent = `${Math.round(tempF)}°`;

          row.append(labelDiv, iconDiv, tempDiv);
          hours.appendChild(row);
        }

        addHourRow("Now", curr.temp_f, curr.condition.icon, curr.condition.text);

        next3Hours.forEach(h =>
          addHourRow(
            new Date(h.time).toLocaleTimeString([], { hour: "numeric", hour12: true }),
            h.temp_f,
            h.condition.icon,
            h.condition.text
          )
        );

        // Show daily forecast (avg condition, high/low)
        clearDaily();

        days.forEach(day => {
          const row = document.createElement("div");
          row.style.display = "flex";
          row.style.justifyContent = "space-between";
          row.style.alignItems = "center";
          row.style.gap = "6px";

          const dateDiv = document.createElement("div");
          dateDiv.textContent = new Date(day.date).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          dateDiv.style.minWidth = "70px";

          const iconDiv = document.createElement("div");
          iconDiv.textContent = iconToEmoji(day.day.condition.icon, day.day.condition.text);
          iconDiv.style.fontSize = "18px";
          iconDiv.style.minWidth = "25px";

          const condDiv = document.createElement("div");
          condDiv.textContent = day.day.condition.text;
          condDiv.style.flexGrow = "1";
          condDiv.style.textAlign = "center";
          condDiv.style.fontSize = "12px";

          const highLowDiv = document.createElement("div");
          highLowDiv.textContent = `${Math.round(day.day.maxtemp_f)}° / ${Math.round(day.day.mintemp_f)}°`;
          highLowDiv.style.minWidth = "60px";
          highLowDiv.style.textAlign = "right";
          highLowDiv.style.fontSize = "12px";

          row.append(dateDiv, iconDiv, condDiv, highLowDiv);
          dailyForecast.appendChild(row);
        });
      } catch (error) {
        console.error("Weather widget error:", error);

        city.textContent = "Charlottesville, VA";
        currentTemp.textContent = `${fallbackMock[0].t}°`;
        feelsLike.textContent = "";
        condition.textContent = "Sunny";
        sunEvent.textContent = "";
        clearHours();
        clearDaily();

        fallbackMock.forEach(m => {
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
