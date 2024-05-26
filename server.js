const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Datenbank initialisieren
db.serialize(() => {
  db.run(`CREATE TABLE ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rating INTEGER,
    latitude REAL,
    longitude REAL,
    country TEXT,
    locality TEXT,
    street TEXT,
    postalCode TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Endpunkt für das Empfangen von Bewertungen
app.post('/rating', (req, res) => {
  const { rating, latitude, longitude, country, locality, street, postalCode } = req.body;
  const stmt = db.prepare("INSERT INTO ratings (rating, latitude, longitude, country, locality, street, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?)");
  stmt.run(rating, latitude, longitude, country, locality, street, postalCode, (err) => {
    if (err) {
      return res.status(500).send('Fehler beim Speichern der Bewertung');
    }
    res.status(200).send('Bewertung erfolgreich gespeichert');
  });
  stmt.finalize();
});

// Endpunkt zum Anzeigen der Bewertungen
app.get('/', (req, res) => {
  db.all("SELECT * FROM ratings", (err, rows) => {
    if (err) {
      return res.status(500).send('Fehler beim Abrufen der Bewertungen');
    }
    res.render('index', { ratings: rows });
  });
});

// Server starten
const PORT = process.env.PORT || 40081;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
