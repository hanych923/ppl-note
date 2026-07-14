(() => {
  "use strict";

  const notes = window.PPL_NOTES || [];
  const vocabulary = window.PPL_VOCABULARY || [];
  const masteryKey = "ppl-note-mastered-v1";
  const mastered = new Set(JSON.parse(localStorage.getItem(masteryKey) || "[]"));

  const state = {
    noteCategory: "All",
    noteQuery: "",
    vocabularyQuery: "",
    studyMode: "browse",
    flashcardDeck: [...vocabulary],
    flashcardIndex: 0,
    quizIndex: 0,
    quizScore: 0,
    quizAnswered: false
  };

  const byId = (id) => document.getElementById(id);
  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  };

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  function renderTex(tex, displayMode = false) {
    if (!window.katex) {
      throw new Error("KaTeX failed to load.");
    }
    return window.katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: "warn"
    });
  }

  function renderRichText(text) {
    const parts = String(text).split(/(\$[^$\n]+\$)/g);
    return parts
      .map((part) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          return renderTex(part.slice(1, -1));
        }
        return escapeHtml(part);
      })
      .join("");
  }

  function pronounce(term) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term);
    const englishVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.toLowerCase().startsWith("en-us"));
    utterance.lang = "en-US";
    utterance.rate = 0.82;
    if (englishVoice) utterance.voice = englishVoice;
    window.speechSynthesis.speak(utterance);
  }

  function saveMastery() {
    localStorage.setItem(masteryKey, JSON.stringify([...mastered]));
    renderMastery();
  }

  function renderMastery() {
    byId("mastery-count").textContent = `${mastered.size} / ${vocabulary.length}`;
  }

  function route() {
    const hash = window.location.hash.slice(1) || "notes";
    const [routeName, routeValue] = hash.split("/");
    document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
    document.querySelectorAll(".main-nav a").forEach((link) => {
      link.classList.toggle("active", link.dataset.route === routeName);
    });

    if (routeName === "note" && routeValue) {
      renderNoteDetail(routeValue);
      byId("note-detail-view").classList.add("active");
    } else if (routeName === "vocabulary") {
      byId("vocabulary-view").classList.add("active");
    } else {
      byId("notes-view").classList.add("active");
    }

    window.scrollTo(0, 0);
  }

  function renderNoteFilters() {
    const categories = ["All", ...new Set(notes.map((note) => note.category))];
    byId("note-filters").innerHTML = categories
      .map(
        (category) => `
          <button class="${category === state.noteCategory ? "active" : ""}"
            type="button" data-category="${escapeHtml(category)}">
            ${escapeHtml(category)}
          </button>
        `
      )
      .join("");
  }

  function renderNotes() {
    const query = state.noteQuery.toLowerCase();
    const filtered = notes.filter((note) => {
      const categoryMatches =
        state.noteCategory === "All" || note.category === state.noteCategory;
      const searchable = [note.title, note.summary, note.category, ...note.tags]
        .join(" ")
        .toLowerCase();
      return categoryMatches && searchable.includes(query);
    });

    byId("notes-grid").innerHTML = filtered.length
      ? filtered
          .map(
            (note) => `
              <article class="note-card">
                <span class="note-category">${escapeHtml(note.category)}</span>
                <h2>${escapeHtml(note.title)}</h2>
                <p>${escapeHtml(note.summary)}</p>
                <button type="button" data-note-id="${escapeHtml(note.id)}">
                  Read note →
                </button>
              </article>
            `
          )
          .join("")
      : '<div class="empty-state">No notes match this search.</div>';
  }

  function renderSection(section) {
    const paragraphs = (section.body || [])
      .map((paragraph) => `<p>${renderRichText(paragraph)}</p>`)
      .join("");
    const formula = section.formula
      ? `<div class="formula-display">${renderTex(section.formula, true)}</div>`
      : "";
    const image = section.image
      ? `
        <figure class="note-figure">
          <img src="${escapeHtml(section.image.src)}"
            alt="${escapeHtml(section.image.alt)}" loading="lazy">
          ${
            section.image.caption
              ? `<figcaption>${renderRichText(section.image.caption)}</figcaption>`
              : ""
          }
        </figure>
      `
      : "";
    const comparison = section.items
      ? `<div class="comparison-grid">${section.items
          .map(
            (item) => `
              <div>
                <strong>${escapeHtml(item.label)}</strong>
                <span>${escapeHtml(item.text)}</span>
              </div>
            `
          )
          .join("")}</div>`
      : "";

    return `
      <section class="detail-section ${escapeHtml(section.type)}">
        <h2>${escapeHtml(section.title)}</h2>
        ${formula}${image}${paragraphs}${comparison}
      </section>
    `;
  }

  function renderNoteDetail(id) {
    const note = notes.find((item) => item.id === id);
    if (!note) {
      byId("note-detail").innerHTML = '<div class="empty-state">Note not found.</div>';
      return;
    }

    byId("note-detail").innerHTML = `
      <header>
        <span class="note-category">${escapeHtml(note.category)}</span>
        <h1>${escapeHtml(note.title)}</h1>
        <p class="detail-summary">${escapeHtml(note.summary)}</p>
      </header>
      ${note.sections.map(renderSection).join("")}
    `;
  }

  function filteredVocabulary() {
    const query = state.vocabularyQuery.toLowerCase();
    return vocabulary.filter((word) =>
      [
        word.term,
        word.pronunciation,
        word.translation,
        word.breakdown,
        word.explanation,
        word.topic
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }

  function renderVocabulary() {
    const words = filteredVocabulary();
    byId("vocabulary-list").innerHTML = words.length
      ? words
          .map(
            (word) => `
              <article class="vocabulary-row">
                <div class="word-heading">
                  <h2>${escapeHtml(word.term)}</h2>
                  <span class="pronunciation">${escapeHtml(word.pronunciation)}</span>
                </div>
                <div class="translation">${escapeHtml(word.translation)}</div>
                <div class="word-details">
                  <strong>${escapeHtml(word.breakdown)}</strong><br>
                  ${escapeHtml(word.explanation)}
                </div>
                <div class="word-actions">
                  <button class="pronounce-button" type="button"
                    data-speak="${escapeHtml(word.term)}"
                    aria-label="Pronounce ${escapeHtml(word.term)}">🔊</button>
                  <button class="mastery-toggle ${mastered.has(word.term) ? "mastered" : ""}"
                    type="button" data-term="${escapeHtml(word.term)}"
                    aria-label="${mastered.has(word.term) ? "Mark for review" : "Mark as mastered"}">
                    ${mastered.has(word.term) ? "✓" : "○"}
                  </button>
                </div>
              </article>
            `
          )
          .join("")
      : '<div class="empty-state">No vocabulary matches this search.</div>';
  }

  function setStudyMode(mode) {
    state.studyMode = mode;
    document.querySelectorAll(".study-mode").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `${mode}-mode`);
    });
    document.querySelectorAll("[data-mode]").forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === mode);
    });

    if (mode === "flashcards") renderFlashcard();
    if (mode === "quiz") startQuiz();
  }

  function renderFlashcard() {
    if (!state.flashcardDeck.length) return;
    const word = state.flashcardDeck[state.flashcardIndex];
    byId("flashcard").classList.remove("flipped");
    byId("flashcard-position").textContent =
      `${state.flashcardIndex + 1} of ${state.flashcardDeck.length}`;
    byId("flashcard-front").innerHTML = `
      <span>${escapeHtml(word.term)}</span>
      <small class="flashcard-pronunciation">${escapeHtml(word.pronunciation)}</small>
    `;
    byId("flashcard-back").innerHTML = `
      <span class="flashcard-translation">${escapeHtml(word.translation)}</span>
      <strong>${escapeHtml(word.breakdown)}</strong>
      <span>${escapeHtml(word.explanation)}</span>
    `;
  }

  function advanceFlashcard(markKnown) {
    const word = state.flashcardDeck[state.flashcardIndex];
    if (markKnown) {
      mastered.add(word.term);
    } else {
      mastered.delete(word.term);
    }
    saveMastery();
    state.flashcardIndex = (state.flashcardIndex + 1) % state.flashcardDeck.length;
    renderFlashcard();
    renderVocabulary();
  }

  function startQuiz() {
    state.quizIndex = 0;
    state.quizScore = 0;
    state.quizAnswered = false;
    state.flashcardDeck = shuffle(vocabulary);
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const word = state.flashcardDeck[state.quizIndex];
    const distractors = shuffle(vocabulary.filter((item) => item.term !== word.term)).slice(0, 3);
    const options = shuffle([word, ...distractors]);
    state.quizAnswered = false;

    byId("quiz-progress").textContent =
      `Question ${state.quizIndex + 1} of ${state.flashcardDeck.length}`;
    byId("quiz-score").textContent = `Score ${state.quizScore}`;
    byId("quiz-word").textContent = word.term;
    byId("quiz-feedback").textContent = "";
    byId("next-question").style.display = "none";
    byId("quiz-options").innerHTML = options
      .map(
        (option) => `
          <button class="quiz-option" type="button"
            data-answer="${escapeHtml(option.term)}">
            ${escapeHtml(option.translation)}
          </button>
        `
      )
      .join("");
  }

  function answerQuiz(selectedTerm) {
    if (state.quizAnswered) return;
    state.quizAnswered = true;
    const current = state.flashcardDeck[state.quizIndex];
    const isCorrect = selectedTerm === current.term;

    if (isCorrect) {
      state.quizScore += 1;
      mastered.add(current.term);
      byId("quiz-feedback").textContent = `Correct — ${current.explanation}`;
    } else {
      byId("quiz-feedback").textContent =
        `Not quite. ${current.term} means ${current.translation}.`;
    }

    document.querySelectorAll(".quiz-option").forEach((button) => {
      button.disabled = true;
      if (button.dataset.answer === current.term) button.classList.add("correct");
      if (button.dataset.answer === selectedTerm && !isCorrect) {
        button.classList.add("incorrect");
      }
    });

    byId("quiz-score").textContent = `Score ${state.quizScore}`;
    byId("next-question").textContent =
      state.quizIndex === state.flashcardDeck.length - 1 ? "Restart quiz" : "Next question";
    byId("next-question").style.display = "inline-block";
    saveMastery();
    renderVocabulary();
  }

  byId("note-search").addEventListener("input", (event) => {
    state.noteQuery = event.target.value.trim();
    renderNotes();
  });

  byId("note-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.noteCategory = button.dataset.category;
    renderNoteFilters();
    renderNotes();
  });

  byId("notes-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-note-id]");
    if (button) window.location.hash = `note/${button.dataset.noteId}`;
  });

  byId("back-to-notes").addEventListener("click", () => {
    window.location.hash = "notes";
  });

  byId("vocabulary-search").addEventListener("input", (event) => {
    state.vocabularyQuery = event.target.value.trim();
    renderVocabulary();
  });

  byId("vocabulary-list").addEventListener("click", (event) => {
    const speakButton = event.target.closest("[data-speak]");
    if (speakButton) {
      pronounce(speakButton.dataset.speak);
      return;
    }
    const button = event.target.closest("[data-term]");
    if (!button) return;
    if (mastered.has(button.dataset.term)) mastered.delete(button.dataset.term);
    else mastered.add(button.dataset.term);
    saveMastery();
    renderVocabulary();
  });

  document.querySelector(".mode-switcher").addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (button) setStudyMode(button.dataset.mode);
  });

  byId("flashcard").addEventListener("click", () => {
    byId("flashcard").classList.toggle("flipped");
  });
  byId("pronounce-card").addEventListener("click", () => {
    pronounce(state.flashcardDeck[state.flashcardIndex].term);
  });
  byId("shuffle-cards").addEventListener("click", () => {
    state.flashcardDeck = shuffle(vocabulary);
    state.flashcardIndex = 0;
    renderFlashcard();
  });
  byId("review-again").addEventListener("click", () => advanceFlashcard(false));
  byId("know-word").addEventListener("click", () => advanceFlashcard(true));

  byId("quiz-options").addEventListener("click", (event) => {
    const button = event.target.closest("[data-answer]");
    if (button) answerQuiz(button.dataset.answer);
  });
  byId("next-question").addEventListener("click", () => {
    if (state.quizIndex === state.flashcardDeck.length - 1) {
      startQuiz();
    } else {
      state.quizIndex += 1;
      renderQuizQuestion();
    }
  });

  window.addEventListener("hashchange", route);
  byId("note-count").textContent = String(notes.length).padStart(4, "0");
  renderNoteFilters();
  renderNotes();
  renderVocabulary();
  renderMastery();
  setStudyMode("browse");
  route();
})();
