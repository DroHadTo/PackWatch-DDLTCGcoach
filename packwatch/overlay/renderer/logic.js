function fill(a) {
  document.getElementById("now").textContent = a.now || "…";
  document.getElementById("why").textContent = a.why || "";
  const hp =
    a.you_hp != null || a.opp_hp != null
      ? `You ${a.you_hp ?? "?"} / they ${a.opp_hp ?? "?"}`
      : "HP unread";
  document.getElementById("deck").textContent =
    (a.turn === "you" ? "YOUR TURN · " : a.turn === "opp" ? "Their turn · " : "Turn unknown · ") + hp;
  document.getElementById("opp").textContent = a.taunt ? "Taunt is up — face is closed." : "No Taunt read.";
  const newest = a.observations && a.observations[0];
  document.getElementById("lessons").textContent = newest
    ? `${newest.title}. ${newest.detail}`
    : (a.dont && a.dont[0]) || "";
  const stamp = a.updated_at ? new Date(a.updated_at).toLocaleTimeString() : "waiting";
  document.getElementById("stats").textContent =
    (a.mode ? a.mode + " · " : "") + `live read ${stamp} · Ctrl+Shift+F · advice only · never clicks`;
}

if (window.packwatch) window.packwatch.onAdvice(fill);
