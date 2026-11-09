import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadData, saveData } from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static assets from public and dist
const distPath = path.join(__dirname, '..', 'dist');
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Middleware to load data fresh
app.use((req, res, next) => {
  req.db = loadData();
  next();
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both email and password' });
  }
  const db = req.db;
  res.json({
    token: 'jwt_mock_token_anas_123',
    user: db.user,
    message: 'Login successful'
  });
});

app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password, terms } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!terms) {
    return res.status(400).json({ error: 'You must agree to the Terms of Service' });
  }
  const db = req.db;
  db.user.name = fullName;
  db.user.email = email;
  saveData(db);

  res.json({
    token: 'jwt_mock_token_anas_123',
    user: db.user,
    message: 'Account created successfully'
  });
});

app.post('/api/auth/google', (req, res) => {
  const db = req.db;
  res.json({
    token: 'jwt_mock_google_token_anas',
    user: db.user,
    message: 'Google authentication successful'
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }
  res.json({
    message: `Password reset instructions have been sent to ${email}`
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ user: req.db.user });
});

app.post('/api/auth/language', (req, res) => {
  const { language } = req.body;
  const db = req.db;
  db.user.language = language || 'English';
  saveData(db);
  res.json({ language: db.user.language });
});

// Acts
app.get('/api/acts', (req, res) => {
  const { q, category, jurisdiction, type, year, sort = 'Latest Updated', page = 1, limit = 10 } = req.query;
  let items = [...req.db.acts];

  if (q) {
    const term = q.toLowerCase();
    items = items.filter(a =>
      a.title.toLowerCase().includes(term) ||
      a.number.toLowerCase().includes(term) ||
      (a.description && a.description.toLowerCase().includes(term))
    );
  }

  if (category && category !== 'All Categories' && category !== 'All Acts') {
    items = items.filter(a => a.category === category || a.type === category);
  }

  if (jurisdiction) {
    const list = Array.isArray(jurisdiction) ? jurisdiction : [jurisdiction];
    items = items.filter(a => list.some(j => a.jurisdiction.includes(j)));
  }

  if (type) {
    const list = Array.isArray(type) ? type : [type];
    items = items.filter(a => list.some(t => a.type.toLowerCase().includes(t.toLowerCase())));
  }

  if (year) {
    const list = Array.isArray(year) ? year.map(Number) : [Number(year)];
    items = items.filter(a => list.includes(a.enactmentYear));
  }

  // Sorting
  if (sort === 'Latest Updated' || sort === 'Recent') {
    items.sort((a, b) => b.year - a.year);
  } else if (sort === 'Title A-Z') {
    items.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'Title Z-A') {
    items.sort((a, b) => b.title.localeCompare(a.title));
  }

  const total = 12640; // Display count from reference
  const filteredCount = items.length;
  const p = parseInt(page);
  const l = parseInt(limit);
  const paginated = items.slice((p - 1) * l, p * l);

  res.json({
    acts: paginated.length > 0 ? paginated : items,
    total,
    filteredCount,
    page: p,
    totalPages: 1264
  });
});

app.get('/api/acts/:id', (req, res) => {
  const act = req.db.acts.find(a => a.id === req.params.id);
  if (!act) return res.status(404).json({ error: 'Act not found' });
  res.json(act);
});

// Rules
app.get('/api/rules', (req, res) => {
  const { q, ruleType, year, sort = 'Latest Updated', page = 1, limit = 10 } = req.query;
  let items = [...req.db.rules];

  if (q) {
    const term = q.toLowerCase();
    items = items.filter(r =>
      r.title.toLowerCase().includes(term) ||
      r.number.toLowerCase().includes(term) ||
      r.description.toLowerCase().includes(term)
    );
  }

  if (ruleType) {
    const list = Array.isArray(ruleType) ? ruleType : [ruleType];
    items = items.filter(r => list.some(t => r.jurisdiction.toLowerCase().includes(t.toLowerCase())));
  }

  if (year) {
    const list = Array.isArray(year) ? year.map(Number) : [Number(year)];
    items = items.filter(r => list.includes(r.year));
  }

  res.json({
    rules: items,
    total: 2485,
    totalPages: 249,
    page: parseInt(page)
  });
});

// Amendments
app.get('/api/amendments', (req, res) => {
  const { q, updateType, year, jurisdiction, sort = 'Latest Updated', page = 1 } = req.query;
  let items = [...req.db.amendments];

  if (q) {
    const term = q.toLowerCase();
    items = items.filter(u =>
      u.title.toLowerCase().includes(term) ||
      u.notificationNo.toLowerCase().includes(term) ||
      u.description.toLowerCase().includes(term)
    );
  }

  if (updateType) {
    const list = Array.isArray(updateType) ? updateType : [updateType];
    items = items.filter(u => list.some(t => u.type.toLowerCase().includes(t.toLowerCase())));
  }

  if (jurisdiction) {
    const list = Array.isArray(jurisdiction) ? jurisdiction : [jurisdiction];
    items = items.filter(u => list.some(j => u.jurisdiction.toLowerCase().includes(j.toLowerCase())));
  }

  if (year) {
    const list = Array.isArray(year) ? year.map(Number) : [Number(year)];
    items = items.filter(u => list.includes(u.year));
  }

  res.json({
    amendments: items,
    total: 3215,
    totalPages: 322,
    page: parseInt(page)
  });
});

// Advanced Search
app.get('/api/search/advanced', (req, res) => {
  const { q = '', mode = 'Universal Search', actType, keywordType = 'Any of these words', jurisdiction, fromYear, toYear, docType } = req.query;
  const db = req.db;
  let results = [];

  // Pool from acts, rules, amendments
  db.acts.forEach(a => results.push({
    id: a.id,
    title: a.title,
    docType: 'Act',
    subType: a.type,
    jurisdiction: a.jurisdiction,
    number: a.number,
    status: a.status,
    sections: a.sections || [],
    badge: 'Act'
  }));

  db.rules.forEach(r => results.push({
    id: r.id,
    title: r.title,
    docType: 'Rule',
    subType: 'Rule',
    jurisdiction: r.jurisdiction,
    number: r.number,
    notifiedDate: r.notifiedDate,
    badge: 'Rule'
  }));

  db.amendments.forEach(am => results.push({
    id: am.id,
    title: am.title,
    docType: am.type,
    subType: am.type,
    jurisdiction: am.reference,
    number: am.notificationNo,
    date: am.date,
    badge: am.type
  }));

  // Add specific section result matching screenshot
  results.push({
    id: 'sec-65b',
    title: 'Section 65B – Electronic Records',
    docType: 'Section',
    subType: 'Section',
    jurisdiction: 'Indian Evidence Act, 1872',
    number: 'Chapter V – Of the Production of Evidence',
    badge: 'Section'
  });

  if (q.trim()) {
    const term = q.toLowerCase().trim();
    results = results.filter(item =>
      item.title.toLowerCase().includes(term) ||
      (item.number && item.number.toLowerCase().includes(term)) ||
      (item.jurisdiction && item.jurisdiction.toLowerCase().includes(term))
    );
  }

  res.json({
    results,
    total: 642,
    page: 1,
    totalPages: 65,
    query: q
  });
});

// Notes CRUD
app.get('/api/notes', (req, res) => {
  const { q, type, tag, year } = req.query;
  let notes = [...req.db.notes];

  if (q) {
    const term = q.toLowerCase();
    notes = notes.filter(n =>
      n.title.toLowerCase().includes(term) ||
      n.content.toLowerCase().includes(term) ||
      n.actOrRule.toLowerCase().includes(term) ||
      n.section.toLowerCase().includes(term)
    );
  }

  if (type && type !== 'All Notes') {
    notes = notes.filter(n => n.type.toLowerCase().includes(type.toLowerCase()) || type.toLowerCase().includes(n.type.toLowerCase()));
  }

  if (tag) {
    notes = notes.filter(n => n.tag.toLowerCase() === tag.toLowerCase());
  }

  if (year) {
    notes = notes.filter(n => n.year === Number(year));
  }

  res.json({
    notes,
    totalNotes: 246,
    importantCount: 14,
    recentCount: 20,
    sectionNotesCount: 64
  });
});

app.post('/api/notes', (req, res) => {
  const { title, actOrRule, section, type = 'Section Notes', tag = 'Evidence', content } = req.body;
  if (!title) return res.status(400).json({ error: 'Note title is required' });

  const db = req.db;
  const newNote = {
    id: 'note-' + Date.now(),
    title,
    actOrRule: actOrRule || 'Indian Evidence Act, 1872',
    section: section || 'Section 65B',
    updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    year: new Date().getFullYear(),
    type,
    tag,
    content: content || ''
  };

  db.notes.unshift(newNote);
  saveData(db);
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
  const db = req.db;
  const idx = db.notes.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });

  db.notes[idx] = {
    ...db.notes[idx],
    ...req.body,
    updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  };
  saveData(db);
  res.json(db.notes[idx]);
});

app.delete('/api/notes/:id', (req, res) => {
  const db = req.db;
  db.notes = db.notes.filter(n => n.id !== req.params.id);
  saveData(db);
  res.json({ message: 'Note deleted successfully' });
});

// Bookmarks CRUD
app.get('/api/bookmarks', (req, res) => {
  const { q, type, tag, year } = req.query;
  let bookmarks = [...req.db.bookmarks];

  if (q) {
    const term = q.toLowerCase();
    bookmarks = bookmarks.filter(b =>
      b.title.toLowerCase().includes(term) ||
      b.number.toLowerCase().includes(term) ||
      b.jurisdiction.toLowerCase().includes(term)
    );
  }

  if (type && type !== 'All Bookmarks') {
    bookmarks = bookmarks.filter(b => b.type.toLowerCase().includes(type.toLowerCase()) || type.toLowerCase().includes(b.type.toLowerCase()));
  }

  if (tag) {
    bookmarks = bookmarks.filter(b => b.tag.toLowerCase() === tag.toLowerCase());
  }

  if (year) {
    bookmarks = bookmarks.filter(b => b.year === Number(year));
  }

  res.json({
    bookmarks,
    totalBookmarks: 328,
    importantCount: 56,
    recentCount: 36,
    tagsCount: 18
  });
});

app.post('/api/bookmarks', (req, res) => {
  const { title, type = 'Act', jurisdiction = 'Central Act', number = 'Act No. 1', tag = 'Important' } = req.body;
  if (!title) return res.status(400).json({ error: 'Bookmark title is required' });

  const db = req.db;
  const newBm = {
    id: 'bm-' + Date.now(),
    title,
    type,
    jurisdiction,
    number,
    bookmarkedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    year: new Date().getFullYear(),
    important: false,
    tag
  };

  db.bookmarks.unshift(newBm);
  saveData(db);
  res.status(201).json(newBm);
});

app.patch('/api/bookmarks/:id/important', (req, res) => {
  const db = req.db;
  const bm = db.bookmarks.find(b => b.id === req.params.id);
  if (!bm) return res.status(404).json({ error: 'Bookmark not found' });

  bm.important = !bm.important;
  saveData(db);
  res.json(bm);
});

app.delete('/api/bookmarks/:id', (req, res) => {
  const db = req.db;
  db.bookmarks = db.bookmarks.filter(b => b.id !== req.params.id);
  saveData(db);
  res.json({ message: 'Bookmark removed successfully' });
});

// Subscription
app.get('/api/subscription', (req, res) => {
  const db = req.db;
  res.json({
    plan: db.user.plan,
    planType: db.user.planType,
    planStartDate: db.user.planStartDate,
    validTill: db.user.validTill,
    remainingDays: db.user.remainingDays,
    status: db.user.status,
    invoices: db.invoices,
    features: [
      'Access Indian Government Acts',
      'Rules & Amendments',
      'Notifications & Updates',
      'Search & Bookmark',
      'Download & Print'
    ]
  });
});

app.post('/api/subscription/manage', (req, res) => {
  const { action, planName, planType } = req.body;
  const db = req.db;

  if (action === 'renew') {
    db.user.validTill = '06 Nov 2028';
    db.user.remainingDays += 365;
    db.invoices.unshift({
      invoiceNo: `TRL-INV-00${db.invoices.length + 50}`,
      plan: db.user.planType,
      amount: '₹ 4,999',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Paid'
    });
  } else if (action === 'upgrade') {
    db.user.plan = planName || 'Tamil + English Package (Supreme)';
  } else if (action === 'cancel') {
    db.user.status = 'Cancelling at period end';
  }

  saveData(db);
  res.json({ message: `Subscription successfully updated (${action})`, user: db.user, invoices: db.invoices });
});

app.post('/api/subscription/billing', (req, res) => {
  res.json({ message: 'Billing information updated successfully' });
});

// Help & Support
app.get('/api/help', (req, res) => {
  const db = req.db;
  res.json({
    tutorials: db.helpTutorials,
    faqs: db.faqs,
    stepGuides: db.stepGuides
  });
});

app.post('/api/help/support', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' });
  }
  res.json({ message: 'Thank you! Your support ticket has been submitted. Our team will contact you shortly.' });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  const indexHtml = path.join(distPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.send('Tamil Raw Library Backend API is running.');
  }
});

app.listen(PORT, () => {
  console.log(`Tamil Raw Library API server running on http://localhost:${PORT}`);
});
