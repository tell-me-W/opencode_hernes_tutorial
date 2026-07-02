const chapters = [
  {
    id: "index",
    file: "content/index.md",
    group: "Overview",
    title: "강의 개요",
    summary: ["문서와 phase를 기준으로 OpenCode를 운영하는 전체 관점을 잡습니다."],
    outputs: ["최종 Harness 폴더 구조 이해", "강의 전체 흐름 확인"],
    commands: ["git status --short --branch"],
  },
  {
    id: "00-introduction",
    file: "content/00-introduction.md",
    group: "Intro",
    title: "소개",
    summary: ["Harness가 필요한 이유와 agent 작업 레일의 의미를 설명합니다."],
    outputs: ["Harness 핵심 요소 목록", "문서 기반 작업 흐름의 mental model"],
    commands: ["opencode --version", "git status --short --branch"],
  },
  {
    id: "01-getting-started",
    file: "content/01-getting-started.md",
    group: "Layer 1",
    title: "Layer 1: docs/ - 프로젝트의 뇌",
    summary: ["PRD, ARCHITECTURE, ADR, UI_GUIDE가 agent 판단 기준이 되는 방식을 정리합니다."],
    outputs: ["docs/ 역할 구분", "MVP 범위와 제외 범위 작성 기준"],
    commands: ["Get-ChildItem docs -Force", "git diff -- docs"],
  },
  {
    id: "02-project-knowledge",
    file: "content/02-project-knowledge.md",
    group: "Layer 2",
    title: "Layer 2: AGENTS.md - 프로젝트의 헌법",
    summary: ["OpenCode가 먼저 읽는 프로젝트 규칙과 CRITICAL 규칙의 역할을 정리합니다."],
    outputs: ["AGENTS.md 초안", "CRITICAL 규칙 후보"],
    commands: ["Get-Content AGENTS.md", "git diff -- AGENTS.md"],
  },
  {
    id: "03-harness-setup",
    file: "content/03-harness-setup.md",
    group: "Layer 3-1",
    title: "실행 엔진 세팅",
    summary: ["make-phase/run-phase skill과 execute.py가 연결되는 설치 구조를 확인합니다."],
    outputs: ["프로젝트 로컬 skill 배치", "설치 검증 결과", "Harness 템플릿 설치 결과"],
    commands: [
      "python scripts/execute.py --help",
      "python -m py_compile scripts/execute.py scripts/hooks/*.py",
      "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/hooks/check.ps1",
    ],
  },
  {
    id: "04-phase-workflow",
    file: "content/04-phase-workflow.md",
    group: "Layer 3-2",
    title: "make-phase/run-phase + execute.py",
    summary: ["승인된 agent step을 opencode run으로 자동 수행하고 상태를 기록하는 흐름입니다."],
    outputs: ["phases/{task-name}/ phase 파일", "agent-output JSONL", "state.json 진행 상태"],
    commands: ["python scripts/execute.py phases/todo-items approve", "python scripts/execute.py phases/todo-items run --max-retries 3 --git-commits"],
  },
  {
    id: "05-safety-design",
    file: "content/05-safety-design.md",
    group: "Layer 4",
    title: "Hooks - 자동 검증 장치",
    summary: ["권한, hook, 반복 실패 대응을 Harness 운영 규칙으로 정리합니다."],
    outputs: ["scripts/hooks/ 안전장치 목록", "execute.py lifecycle hook 기준"],
    commands: ["powershell -NoProfile -ExecutionPolicy Bypass -File scripts/hooks/check.ps1", "python -m py_compile scripts/hooks/*.py"],
  },
  {
    id: "06-practical-workflow",
    file: "content/06-practical-workflow.md",
    group: "Part 6: 실전 워크플로우",
    title: "실전 워크플로우",
    summary: ["요구사항을 phase로 변환하고 승인된 phase를 검증까지 이어가는 실습 흐름입니다."],
    outputs: ["기능/버그/리팩토링 phase 예시", "검증과 문서 업데이트 체크리스트"],
    commands: ["npm test", "npm run build", "git diff --stat"],
  },
];

const chapterList = document.querySelector("#chapter-list");
const lectureBody = document.querySelector("#lecture-body");
const searchInput = document.querySelector("#chapter-search");
const keyPoints = document.querySelector("#key-points");
const outputs = document.querySelector("#outputs");
const commands = document.querySelector("#commands");

const contentCache = new Map();
let pendingSectionId = "";

function currentId() {
  return decodeURIComponent(window.location.hash.replace("#", "")) || chapters[0].id;
}

function currentChapter() {
  return chapters.find((chapter) => chapter.id === currentId()) || chapters[0];
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function renderMarkdownLink(label, href) {
  const localMarkdown = /^\.?\/?([^/#?]+)\.md(?:#([^?]+))?$/.exec(href);
  if (localMarkdown) {
    const chapterId = localMarkdown[1];
    return `<a href="#${chapterId}">${label}</a>`;
  }

  if (/^\.?\/?downloads\/[A-Za-z0-9._-]+\.zip$/.test(href)) {
    return `<a href="${escapeHtml(href)}" download>${label}</a>`;
  }

  return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${label}</a>`;
}

function renderInline(value) {
  let html = escapeHtml(value);
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) =>
    renderMarkdownLink(label, href),
  );
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return html;
}

function navTitle(chapter) {
  if (chapter.group === "Overview") return "OVERVIEW";
  if (chapter.group === "Intro") return "INTRO";
  return chapter.group;
}

function extractChapterSections(markdown) {
  const sections = [];
  let inCodeFence = false;

  markdown
    .replace(/\r\n/g, "\n")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (/^```/.test(trimmed)) {
        inCodeFence = !inCodeFence;
        return;
      }

      if (inCodeFence) return;

      const match = /^##\s+([^#].+)$/.exec(trimmed);
      if (!match) return;

      const title = match[1].trim();
      sections.push({ id: slugify(title), title });
    });

  return sections;
}

function isTableDivider(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function closeList(state, html) {
  if (state.list) {
    html.push(`</${state.list}>`);
    state.list = "";
  }
}

function closeParagraph(state, html) {
  if (state.paragraph.length > 0) {
    html.push(`<p>${renderInline(state.paragraph.join(" "))}</p>`);
    state.paragraph = [];
  }
}

function closeTable(state, html) {
  if (state.table.length > 0) {
    const [head, ...rows] = state.table;
    html.push("<table><thead><tr>");
    head.forEach((cell) => html.push(`<th>${renderInline(cell)}</th>`));
    html.push("</tr></thead><tbody>");
    rows.forEach((row) => {
      html.push("<tr>");
      row.forEach((cell) => html.push(`<td>${renderInline(cell)}</td>`));
      html.push("</tr>");
    });
    html.push("</tbody></table>");
    state.table = [];
  }
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  const state = { paragraph: [], list: "", table: [], code: null, codeLines: [] };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (/^`{3,}/.test(trimmed)) {
      if (state.code) {
        html.push(`<pre><code>${escapeHtml(state.codeLines.join("\n"))}</code></pre>`);
        state.code = null;
        state.codeLines = [];
      } else {
        closeParagraph(state, html);
        closeList(state, html);
        closeTable(state, html);
        state.code = trimmed;
        state.codeLines = [];
      }
      continue;
    }

    if (state.code) {
      state.codeLines.push(line);
      continue;
    }

    if (trimmed === "") {
      closeParagraph(state, html);
      closeList(state, html);
      closeTable(state, html);
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(trimmed);
    if (heading) {
      closeParagraph(state, html);
      closeList(state, html);
      closeTable(state, html);
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = slugify(text);
      html.push(`<h${level} id="${id}">${renderInline(text)}</h${level}>`);
      continue;
    }

    if (trimmed.includes("|") && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      closeParagraph(state, html);
      closeList(state, html);
      state.table.push(splitTableRow(trimmed));
      index += 1;
      continue;
    }

    if (state.table.length > 0 && trimmed.includes("|")) {
      state.table.push(splitTableRow(trimmed));
      continue;
    }

    if (state.table.length > 0) {
      closeTable(state, html);
    }

    const unordered = /^[-*]\s+(.+)$/.exec(trimmed);
    const ordered = /^\d+\.\s+(.+)$/.exec(trimmed);
    if (unordered || ordered) {
      closeParagraph(state, html);
      const tag = unordered ? "ul" : "ol";
      if (state.list && state.list !== tag) closeList(state, html);
      if (!state.list) {
        html.push(`<${tag}>`);
        state.list = tag;
      }
      html.push(`<li>${renderInline((unordered || ordered)[1])}</li>`);
      continue;
    }

    closeList(state, html);
    state.paragraph.push(trimmed);
  }

  closeParagraph(state, html);
  closeList(state, html);
  closeTable(state, html);

  if (state.code) {
    html.push(`<pre><code>${escapeHtml(state.codeLines.join("\n"))}</code></pre>`);
  }

  return html.join("\n");
}

async function loadChapter(chapter) {
  if (contentCache.has(chapter.id)) return contentCache.get(chapter.id);
  const response = await fetch(chapter.file);
  if (!response.ok) throw new Error(`Unable to load ${chapter.file}`);
  const markdown = await response.text();
  contentCache.set(chapter.id, markdown);
  return markdown;
}

async function loadChapterSections() {
  await Promise.all(
    chapters.map(async (chapter) => {
      try {
        const markdown = await loadChapter(chapter);
        chapter.sections = extractChapterSections(markdown);
      } catch {
        chapter.sections = [];
      }
    }),
  );
  renderNavigation(searchInput.value);
}

function scrollToSection(sectionId) {
  if (!sectionId) return;
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function navigateToSection(chapter, sectionId) {
  if (currentChapter().id === chapter.id) {
    scrollToSection(sectionId);
    return;
  }

  pendingSectionId = sectionId;
  window.location.hash = chapter.id;
}

function renderNavigation(filter = "") {
  const needle = filter.trim().toLowerCase();
  const selected = currentChapter().id;
  const visible = chapters.filter((chapter) => {
    const sectionText = (chapter.sections || []).map((section) => section.title).join(" ");
    const haystack = `${chapter.title} ${chapter.group} ${sectionText} ${chapter.summary.join(" ")}`.toLowerCase();
    return haystack.includes(needle);
  });

  chapterList.innerHTML = "";
  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "검색 결과가 없습니다.";
    chapterList.append(empty);
    return;
  }

  visible.forEach((chapter) => {
    const item = document.createElement("li");
    item.className = "chapter-item";
    const button = document.createElement("button");
    button.className = "chapter-button";
    button.type = "button";
    button.textContent = navTitle(chapter);
    button.setAttribute("aria-current", chapter.id === selected ? "page" : "false");
    button.addEventListener("click", () => {
      window.location.hash = chapter.id;
    });
    item.append(button);

    if (chapter.sections && chapter.sections.length > 0) {
      const subList = document.createElement("ol");
      subList.className = "subchapter-list";
      chapter.sections.forEach((section) => {
        const subItem = document.createElement("li");
        const link = document.createElement("button");
        link.className = "subchapter-link";
        link.type = "button";
        link.textContent = section.title;
        link.addEventListener("click", () => navigateToSection(chapter, section.id));
        subItem.append(link);
        subList.append(subItem);
      });
      item.append(subList);
    }

    chapterList.append(item);
  });
}

function fillList(target, items, isCode = false) {
  target.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    if (isCode) li.title = item;
    target.append(li);
  });
}

function renderSupport(chapter) {
  fillList(keyPoints, chapter.summary);
  fillList(outputs, chapter.outputs);
  fillList(commands, chapter.commands, true);
}

async function renderCurrentChapter() {
  const chapter = currentChapter();
  document.title = `${chapter.title} - 오픈코드로 하네스 입문 해보기`;
  lectureBody.innerHTML = '<p class="loading">강의를 불러오는 중입니다...</p>';

  try {
    const markdown = await loadChapter(chapter);
    lectureBody.innerHTML = renderMarkdown(markdown);
  } catch (error) {
    lectureBody.innerHTML = `<h1>${renderInline(chapter.title)}</h1><p>콘텐츠를 불러오지 못했습니다. 로컬에서는 정적 서버로 열어 주세요.</p><pre><code>${escapeHtml(String(error.message))}</code></pre>`;
  }

  lectureBody.focus({ preventScroll: true });
  renderNavigation(searchInput.value);
  renderSupport(chapter);
  if (pendingSectionId) {
    const sectionId = pendingSectionId;
    pendingSectionId = "";
    requestAnimationFrame(() => scrollToSection(sectionId));
  } else {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

searchInput.addEventListener("input", (event) => renderNavigation(event.target.value));
window.addEventListener("hashchange", renderCurrentChapter);

if (!window.location.hash) {
  window.location.hash = chapters[0].id;
} else {
  renderCurrentChapter();
}

loadChapterSections();
