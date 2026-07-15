# OpenCode Harness slides

This directory contains the standalone HTML slide deck for the OpenCode Harness meetup.

## Files

- `index.html`: slide content and deck markup.
- `styles.css`: shared visual system for the deck.
- `app.js`: keyboard navigation, progress, fullscreen, notes, and slide helpers.
- `vendor/`: local third-party assets used by the deck.

## Current narrative note

The deck now includes a new Chapter 3 slide after the Harness definition:

> Harness is not something you build once and leave alone. It should change as the model, execution environment, and team risk criteria change.

This slide sits between:

- Slide 21: the Harness definition slide.
- Slide 22: the Phase overview slide.

That placement keeps the story clear: first define Harness, then explain why it must stay adaptable, then introduce Phase as one concrete way to operate it.

## Editing guidance

- Keep slide text in `index.html`.
- Prefer design-only changes in CSS unless the story itself changes.
- When adding a conceptual point, place it near the chapter section where the audience already has the needed context.
