# Pilot Notes

An offline-first private pilot learning notebook with:

- Structured aviation notes in Traditional Chinese
- English-Chinese aviation vocabulary explanations
- Browse, flashcard, and multiple-choice quiz study modes
- Local progress tracking in the browser
- Local images and offline TeX mathematics through KaTeX

## Use

Open `index.html` directly in a browser. The site has no dependencies, build step, server, or internet requirement.

## Add a note

Add an object to `content/notes.js`. Notes use structured sections so content remains separate from HTML presentation.

```js
{
  id: "unique-note-id",
  title: "Note title",
  summary: "Short description",
  category: "Weather",
  tags: ["tag one", "tag two"],
  updated: "YYYY-MM-DD",
  sections: [
    {
      type: "text",
      title: "Section title",
      body: ["Paragraph one.", "Paragraph two."]
    }
  ]
}
```

Supported section types include `text`, `question`, `formula`, `image`, `comparison`, and `takeaway`. See the existing note for examples.

### TeX mathematics

Use TeX in a `formula` section for a centered display equation:

```js
{
  type: "formula",
  title: "Lift equation",
  formula: "L = \\frac{1}{2}\\rho V^2 S C_L",
  body: ["Lift changes with $V^2$, so airspeed has a squared effect."]
}
```

Text between single dollar signs is rendered as inline TeX. KaTeX and its fonts are stored in `vendor/katex`, so formulas work offline.

### Images

Put local images in `images/`, then reference them from an image section:

```js
{
  type: "image",
  title: "Instrument example",
  image: {
    src: "images/altimeter.jpg",
    alt: "Altimeter showing 3,500 feet",
    caption: "Always include useful alternative text and an optional caption."
  }
}
```

Use relative paths and keep the original image files in the repository so they remain available offline.

## Add vocabulary

Add an object to `content/vocabulary.js`:

```js
{
  term: "airspeed",
  pronunciation: "/ˈerˌspiːd/",
  translation: "空速",
  breakdown: "air + speed",
  explanation: "The speed of an aircraft relative to the surrounding air.",
  topic: "Flight Instruments"
}
```

Presentation and behavior live in `assets/styles.css` and `assets/app.js`. Learning content should stay in the `content` directory.
