# AI Agent Content Guide

This repository is an offline private pilot learning notebook. When adding learning material, keep content separate from presentation.

## Repository structure

- `content/notes.js`: aviation learning notes
- `content/vocabulary.js`: English-Chinese vocabulary
- `images/`: local diagrams and note images
- `assets/`: presentation and application behavior
- `vendor/`: bundled offline libraries

For normal content additions, edit only `content/notes.js`, `content/vocabulary.js`, and `images/`. Do not change `index.html`, `assets/`, or `vendor/` unless the requested feature cannot be represented by the existing content schema.

## Adding a note

Append one object to `window.PPL_NOTES` in `content/notes.js`:

```js
{
  id: "unique-kebab-case-id",
  title: "Note title",
  summary: "A concise explanation of what this note teaches.",
  category: "Weather",
  tags: ["search term", "another term"],
  updated: "YYYY-MM-DD",
  sections: [
    {
      type: "text",
      title: "Section title",
      body: ["First paragraph.", "Second paragraph."]
    }
  ]
}
```

Requirements:

- Use a unique, stable, kebab-case `id`.
- Write explanations primarily in Traditional Chinese unless asked otherwise.
- Preserve important English aviation terminology alongside its Chinese explanation.
- Organize reasoning into short sections instead of one long block.
- Include the learner's original question when it helps explain the note.
- Add useful search terms to `tags`.
- Use the actual update date in `YYYY-MM-DD` format.

## Note section types

### Text

```js
{
  type: "text",
  title: "Key concept",
  body: ["Paragraph one.", "Paragraph two."]
}
```

### Question

Use for the learner's question or a misconception being resolved.

```js
{
  type: "question",
  title: "Core question",
  body: ["Why does this happen?"]
}
```

### Formula and TeX

Use a `formula` field for a centered display equation. JavaScript backslashes must be escaped.

```js
{
  type: "formula",
  title: "Lift equation",
  formula: "L = \\frac{1}{2}\\rho V^2 S C_L",
  body: ["Lift changes with $V^2$, so airspeed has a squared effect."]
}
```

Text enclosed by single dollar signs, such as `$P = \\rho RT$`, renders as inline TeX.

### Image

Place the image in `images/` and use a relative path:

```js
{
  type: "image",
  title: "Altimeter example",
  image: {
    src: "images/altimeter.jpg",
    alt: "Altimeter indicating 3,500 feet",
    caption: "The optional caption shown below the image."
  }
}
```

Every image must have accurate, useful `alt` text. Keep images local so the notebook works offline. Prefer optimized SVG, WebP, PNG, or JPEG files with descriptive kebab-case names.

### Comparison

```js
{
  type: "comparison",
  title: "Compare two conditions",
  items: [
    { label: "Condition A", text: "Explanation." },
    { label: "Condition B", text: "Explanation." }
  ]
}
```

### Takeaway

Use for the practical flight conclusion.

```js
{
  type: "takeaway",
  title: "Flight takeaway",
  body: ["Explain how this knowledge affects pilot decisions or aircraft performance."]
}
```

## Adding vocabulary

Append one object to `window.PPL_VOCABULARY` in `content/vocabulary.js`:

```js
{
  term: "airspeed",
  pronunciation: "/ˈerˌspiːd/",
  translation: "空速",
  breakdown: "air + speed",
  explanation: "飛機相對於周圍空氣的速度。",
  topic: "Flight Instruments"
}
```

Requirements:

- Do not add duplicate terms.
- Use standard American English IPA where practical.
- Explain useful prefixes, roots, suffixes, or word origins in `breakdown`.
- Keep `translation` concise and put context in `explanation`.
- Use a consistent aviation topic, such as `Aeromedical`, `Weather`, `Navigation`, or `Flight Instruments`.
- Verify pronunciation, translation, and aviation meaning before adding the entry.

## Content quality

- Preserve factual and technical accuracy; do not invent aviation rules or numbers.
- Distinguish simplified intuition from precise technical definitions.
- Include units and define symbols used in formulas.
- Prefer practical pilot implications over abstract facts alone.
- Avoid external links or remote images as required content because the site must remain offline.
- Do not commit raw source material after it has been accurately migrated unless the user asks to retain it.

## Validation

After editing content, run:

```powershell
node --check content\notes.js
node --check content\vocabulary.js
node --check assets\app.js
git --no-pager diff --check
```

Open `index.html` and confirm that the new note, image, formula, vocabulary pronunciation, flashcard, and quiz content render as expected.
