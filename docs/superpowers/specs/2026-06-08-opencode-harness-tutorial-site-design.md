# Opencode Harness Tutorial Site Design

## Goal

Build a GitHub Pages-ready tutorial site from `content/*.md` for the course titled `오픈코드로 하네스 입문 해보기`.

## Approved Direction

Use a dependency-free static site deployed through GitHub Actions. The user confirmed GitHub Actions deployment.

## Layout

- Left column: course table of contents and search.
- Center column: rendered lecture body from the selected Markdown chapter.
- Right column: current chapter support panel containing core summary, expected output, verification commands, and in-page section links.

The visual direction follows the supplied reference: quiet documentation UI, warm off-white sidebars, orange emphasis, dense navigation, and a wide reading pane.

## Architecture

- `index.html` provides the application shell.
- `styles.css` owns layout, typography, responsive behavior, and visual polish.
- `app.js` owns chapter metadata, Markdown loading, lightweight Markdown rendering, navigation state, search, and right-panel summaries.
- `content/*.md` remains the source of truth.
- `.github/workflows/pages.yml` deploys the repository as a static Pages artifact on pushes to `main`.
- `scripts/validate-site.ps1` verifies that the static shell, workflow, and referenced content files exist before deployment.

## Behavior

- Initial route loads the first chapter.
- Chapter navigation uses hash routes such as `#00-introduction`.
- Search filters the left chapter list by title and summary.
- The center article renders headings, paragraphs, lists, code fences, inline code, links, and tables used in the current content.
- The right panel changes per chapter and shows concise learning support rather than another marketing block.
- On small screens, the columns collapse into a usable single-column reading flow.

## Verification

- Run `powershell -ExecutionPolicy Bypass -File scripts/validate-site.ps1`.
- Serve locally and visually inspect the page at desktop and mobile widths.

## Self Review

- No placeholder requirements remain.
- The design is focused on one static site and one deployment path.
- The file responsibilities are explicit.
- The design matches the user's requested three-column structure and title.
