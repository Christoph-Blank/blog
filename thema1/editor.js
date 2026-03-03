// GitHub-Konfiguration
const token = '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'; // Nur zu Testzwecken
const owner = 'Christoph-Blank';
const repo = 'blog';
const path = 'thema1/thema1-content.html'; // Pfad im Repo

const editor = document.getElementById('editor');
const saveBtn = document.getElementById('saveBtn');

let currentSha = null; // SHA der Datei, wird für Updates benötigt

// 1️⃣ Thema1 Content laden
async function loadContent() {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json' // Standard JSON, enthält SHA und Base64-Content
      }
    });

    if (!res.ok) throw new Error(`Fehler beim Laden: ${res.status} ${res.statusText}`);
    const json = await res.json();

    // SHA speichern für späteres Update
    currentSha = json.sha;

    // Base64-dekodieren
    const content = decodeURIComponent(escape(atob(json.content.replace(/\n/g, ''))));
    editor.value = content;

  } catch (err) {
    console.error(err);
    alert('Fehler beim Laden der Datei!');
  }
}

// 2️⃣ Änderungen speichern
async function saveContent() {
  if (!currentSha) {
    alert('SHA der Datei fehlt. Datei zuerst laden!');
    return;
  }

  try {
    const contentBase64 = btoa(unescape(encodeURIComponent(editor.value))); // Base64 codieren

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update thema1-content via Editor',
        content: contentBase64,
        sha: currentSha
      })
    });

    const result = await res.json();
    if (res.ok) {
      currentSha = result.content.sha; // SHA nach Update aktualisieren
      alert('Inhalt erfolgreich gespeichert!');
    } else {
      console.error(result);
      alert('Fehler beim Speichern: ' + (result.message || 'Unbekannt'));
    }

  } catch (err) {
    console.error(err);
    alert('Fehler beim Speichern der Datei!');
  }
}

// Event Listener
saveBtn.addEventListener('click', saveContent);

// Content beim Laden der Seite abrufen
loadContent();
