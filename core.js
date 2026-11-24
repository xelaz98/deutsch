// ───────── ВЕРСИЯ НА ДАННИТЕ + EXPORT/IMPORT НА ЦЕЛИЯ ПРОГРЕС ─────────
const DATA_SCHEMA = 3;
const LSget = (k, d) => { try { const v = localStorage.getItem("dl:" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const LSset = (k, v) => { try { localStorage.setItem("dl:" + k, JSON.stringify(v)); return true; } catch (e) { return false; } };
// пълно копие на учебната база (всички ключове dl:*)
function exportAll() {
  const data = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith("dl:")) data[k] = localStorage.getItem(k); }
  return { app: "deutsch", schema: DATA_SCHEMA, exported: new Date().toISOString(), data };
}
function importAll(obj) {
  if (!obj || obj.app !== "deutsch" || typeof obj.data !== "object") throw new Error("Файлът не е копие от това приложение.");
  const keys = Object.keys(obj.data).filter((k) => k.startsWith("dl:")); if (!keys.length) throw new Error("Копието е празно.");
  const backup = exportAll(); try { localStorage.setItem("dl-backup-before-import", JSON.stringify(backup)); } catch (e) {}
  Object.keys(backup.data).forEach((k) => localStorage.removeItem(k));
  keys.forEach((k) => localStorage.setItem(k, obj.data[k]));
  return keys.length;
}
