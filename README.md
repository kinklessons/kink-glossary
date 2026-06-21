# 📚 Kink Glossary / Definition Search App

A lightweight React + Vite application for browsing, searching, and categorizing a structured dataset of definitions. Built for fast filtering, readability, and easy expansion of large JSON-based content libraries.

---

## ✨ Features

- ⚡ Fast client-side search (instant filtering)
- 🔍 Search across:
  - Question/title
  - Category
  - Definition text
- 🏷 Category filtering dropdown
- 🎯 Debounced search input (performance optimized)
- 🚫 Optional delete/exclusion list support
- 🎨 Clean card-based UI for readability
- 📱 Responsive layout (works on mobile and desktop)

---

## 🧱 Tech Stack

- React (Vite)
- Tailwind CSS
- shadcn/ui components (optional)
- JSON-based data storage
- Modern JavaScript (ES6+)

---

## 📁 Project Structure

src/
├── components/
│   └── ui/           # UI components (Input, Card, etc.)
├── lib/
│   └── utils.ts      # Utility helpers (cn, etc.)
├── App.jsx           # Main search application

public/
└── questionnaires/
    ├── v3.json      # Main dataset
    └── delete.json  # Optional exclusion list

---

## 🚀 Getting Started

### 1. Install dependencies

npm install

---

### 2. Run development server

npm run dev

---

### 3. Build for production

npm run build

---

### 4. Deploy to GitHub Pages

npm run deploy

---

## ⚙️ Configuration

### 📦 Data Source

The app loads data from:

public/questionnaires/v3.json

Each entry should follow this structure:

{
  "id": 1,
  "Question": "Example title",
  "Category": "Example category",
  "Definition": "Example description"
}

---

### 🚫 Delete / Exclusion List (Optional)

You can exclude items using:

public/questionnaires/delete.json

Format:

[
  { "id": 1 },
  { "id": 2 }
]

---

## 🔍 Search Behavior

- Case-insensitive matching
- Matches across all fields
- Debounced input (200ms delay)
- Category filter is applied in combination with search

---

## 🎨 UI Design

Each result is displayed as a card:

- Title (question/term)
- Category badge
- Definition text
- Hover elevation for better UX

---

## 📦 Build Notes

If deploying to GitHub Pages, ensure:

vite.config.js

export default {
  base: "/kink-glossary/",
};

---

## 🧠 Future Improvements

- Fuzzy search (Fuse.js)
- Tag-based filtering
- Expand/collapse long definitions
- Saved favorites
- Pagination or virtualization for large datasets
- Dark mode support

---

## 📄 License

MIT — free to use and modify.

---

## 👤 Author

Built as a lightweight searchable knowledge browser for structured JSON datasets.
