// GitHub-Konfiguration
const token = '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'; // Nur zu Testzwecken
const owner = 'christoph-blank';
const repo = 'blog';
const path = '../../thema1/thema1-content.html'; // Pfad im Repo

const editor = document.getElementById('editor');
const saveBtn = document.getElementById('saveBtn');

// 1️⃣ Thema1 Content laden
fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
  headers: {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3.raw'
  }
})
  .then(res => res.text())
  .then(data => editor.value = data)
  .catch(err => console.error(err));

// 2️⃣ Änderungen speichern
saveBtn.addEventListener('click', async () => {
  try {
    // Zuerst die aktuelle Datei holen, um SHA zu bekommen
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
    const json = await response.json();
    const sha = json.sha;

    const content = btoa(unescape(encodeURIComponent(editor.value))); // Base64

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update thema1-content via Editor',
        content: content,
        sha: sha
      })
    });

    const result = await res.json();
    console.log(result);
    alert('Inhalt erfolgreich gespeichert!');
  } catch (err) {
    console.error(err);
    alert('Fehler beim Speichern');
  }

});
