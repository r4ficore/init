
// ==UserScript==
// @name         ghost.injector.js
// @namespace    R4FI_CORE
// @version      1.0
// @description  Shadow UI Panel for GPT — Prompts, Modes, Roles, Notes
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function () {
  const panel = document.createElement("div");
  panel.id = "ghostPanel";
  panel.style = `
    position: fixed; top: 100px; left: 100px; z-index: 99999;
    background: rgba(10, 10, 10, 0.95); color: #0f0;
    padding: 10px; font-family: monospace; font-size: 13px;
    border: 1px solid #0f0; border-radius: 8px; width: 320px;
  `;
  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <b>∴ΞΣΞ∴ GHOST PANEL</b>
      <button id="ghostMinimize" style="background:#0f0;color:#000;font-weight:bold;border:none;padding:2px 6px;border-radius:3px;cursor:pointer;">–</button>
    </div>
    <div id="ghostContent" style="margin-top:10px;">
      <div><b>📦 Prompty:</b><ul id="ghostPrompts"></ul></div>
      <div><b>🧠 Tryby AI:</b><ul id="ghostModes"></ul></div>
      <div><b>🎭 Role GPT:</b><ul id="ghostRoles"></ul></div>
      <div><b>📝 ghostMemo:</b><textarea id="ghostMemo" style="width:100%;height:80px;background:#111;color:#0f0;"></textarea></div>
      <div style="margin-top:6px;text-align:right;font-size:10px;color:#666;">R4FI CORE</div>
    </div>
  `;
  document.body.appendChild(panel);

  // Drag logic
  panel.onmousedown = function (e) {
    let offsetX = e.clientX - panel.offsetLeft;
    let offsetY = e.clientY - panel.offsetTop;
    function move(e) {
      panel.style.left = (e.clientX - offsetX) + "px";
      panel.style.top = (e.clientY - offsetY) + "px";
    }
    function up() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  // Minimize logic
  document.getElementById("ghostMinimize").onclick = function () {
    const content = document.getElementById("ghostContent");
    content.style.display = content.style.display === "none" ? "block" : "none";
  };

  // Auto-load from GitHub
  fetch("https://raw.githubusercontent.com/r4ficore/init/main/ghost_prompts.json")
    .then(res => res.json())
    .then(data => {
      const addList = (id, list) => {
        const container = document.getElementById(id);
        list.forEach(item => {
          const li = document.createElement("li");
          li.innerHTML = `<a href='#' style='color:#0ff' onclick='ghostInject("${item.prompt}")'>${item.name}</a>`;
          container.appendChild(li);
        });
      };
      addList("ghostPrompts", data.prompts || []);
      addList("ghostModes", data.modes || []);
      addList("ghostRoles", data.roles || []);
    });

  // Inject to GPT input
  window.ghostInject = function (text) {
    const box = [...document.querySelectorAll('textarea')].find(i => i);
    if (!box) return alert("❌ Input box not found");
    box.value = text;
    box.dispatchEvent(new Event("input", { bubbles: true }));
    const btn = document.querySelector("button[class*='send']");
    if (btn) btn.click();
  };

})();
