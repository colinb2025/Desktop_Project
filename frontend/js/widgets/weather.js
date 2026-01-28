export const weatherWidget = {
  id: "w7",
  type: "weather",
  w: 3,
  h: 1,
  render(el) {
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.justifyContent = "space-between";
    el.style.background = "#1e1e1e";
    el.style.borderRadius = "10px";
    el.style.padding = "10px";
    el.style.color = "white";
    el.style.fontFamily = "sans-serif";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";

    const city = document.createElement("div");
    city.textContent = "Charlottesville, VA";
    city.style.fontSize = "14px";
    city.style.opacity = "0.8";

    const current = document.createElement("div");
    current.style.fontSize = "26px";
    current.style.fontWeight = "bold";

    const condition = document.createElement("div");
    condition.style.fontSize = "12px";
    condition.style.opacity = "0.7";

    const nowBox = document.createElement("div");
    nowBox.style.textAlign = "right";
    nowBox.append(current, condition);

    header.append(city, nowBox);

    const hours = document.createElement("div");
    hours.style.display = "flex";
    hours.style.justifyContent = "space-between";
    hours.style.marginTop = "8px";

    const mock = [
      { h: "Now", t: 72, i: "☀️" },
      { h: "3 PM", t: 73, i: "☀️" },
      { h: "4 PM", t: 72, i: "⛅" },
      { h: "5 PM", t: 70, i: "⛅" },
      { h: "6 PM", t: 68, i: "🌥" },
      { h: "7 PM", t: 66, i: "🌙" }
    ];

    current.textContent = `${mock[0].t}°`;
    condition.textContent = "Sunny";

    mock.forEach(m => {
      const col = document.createElement("div");
      col.style.textAlign = "center";
      col.style.fontSize = "12px";

      const hour = document.createElement("div");
      hour.textContent = m.h;
      hour.style.opacity = "0.7";

      const icon = document.createElement("div");
      icon.textContent = m.i;
      icon.style.fontSize = "18px";

      const temp = document.createElement("div");
      temp.textContent = `${m.t}°`;

      col.append(hour, icon, temp);
      hours.appendChild(col);
    });

    el.append(header, hours);
  }
};
