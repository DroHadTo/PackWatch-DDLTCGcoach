chrome.storage.local.get(["lastSnapshot"], function (result) {
  var snapshot = result.lastSnapshot;
  var state = document.getElementById("state");
  if (!snapshot) return;
  var quality = snapshot.readQuality && snapshot.readQuality.complete ? "complete" : "partial";
  state.textContent =
    "Last read: " +
    new Date(snapshot.readAt).toLocaleTimeString() +
    " · turn " +
    snapshot.turn +
    " · HP " +
    (snapshot.yourHp == null ? "?" : snapshot.yourHp) +
    " / " +
    (snapshot.foeHp == null ? "?" : snapshot.foeHp) +
    " · " +
    quality +
    " read.";
});
