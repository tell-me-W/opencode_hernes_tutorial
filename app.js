const chapters = [
  {
    id: "intro",
    title: "Introduction",
    group: "Part 1. 시작",
    summary: "왜 OpenCode harness가 필요한지와 전체 커리큘럼 흐름을 잡습니다.",
    body: `
      <p class="eyebrow">OpenCode Harness Tutorial</p>
      <h1>OpenCode Harness 사내 교육 커리큘럼</h1>
      <p class="lead">이 문서는 팀원이 <code>build-opencode-harness</code> skill을 받아 자기 프로젝트에 설치하고, 문서 기반 phase workflow로 개발과 리뷰를 운영할 수 있게 만드는 단계별 가이드입니다.</p>

      <div class="callout">
        <strong>공유 대상 skill</strong>
        <p><code>.opencode/skills/build-opencode-harness/SKILL.md</code>와 그 하위 <code>agents/</code>, <code>assets/harness-template/</code> 전체를 함께 공유합니다. 단일 문서가 아니라 설치 템플릿을 포함한 패키지로 다루어야 합니다.</p>
      </div>

      <section>
        <h2 id="overview">과정 개요</h2>
        <table>
          <tbody>
            <tr><th>대상</th><td>OpenCode를 프로젝트 운영에 깊게 적용하려는 개발자와 테크 리드</td></tr>
            <tr><th>목표</th><td>빈 프로젝트 또는 기존 프로젝트에 harness를 설치하고, PRD/Architecture/ADR 기반 phase 실행까지 완료</td></tr>
            <tr><th>권장 시간</th><td>2시간 입문 세션 + 2시간 실습 세션 + 팀 프로젝트 적용 과제</td></tr>
            <tr><th>실습 산출물</th><td><code>AGENTS.md</code>, <code>docs/</code>, <code>.opencode/skills/</code>, <code>scripts/</code>, <code>phases/</code></td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 id="learning-goals">학습 목표</h2>
        <ol>
          <li>OpenCode skill 패키지를 프로젝트 로컬 skill로 배치할 수 있습니다.</li>
          <li><code>AGENTS.md</code>를 팀 규칙과 agent 헌법으로 작성할 수 있습니다.</li>
          <li><code>docs/PRD.md</code>, <code>ARCHITECTURE.md</code>, <code>ADR.md</code>를 프로젝트 brain으로 운영할 수 있습니다.</li>
          <li>작업을 phase로 쪼개고 승인 후 실행하는 흐름을 설명할 수 있습니다.</li>
          <li>review skill과 safety hook을 사용해 범위 확장, 위험 명령, 검증 누락을 줄일 수 있습니다.</li>
        </ol>
      </section>

      <section>
        <h2 id="mental-model">한눈에 보는 구조</h2>
        <div class="flow" aria-label="Harness workflow">
          <div class="flow-step"><span>01</span><strong>Skill 설치</strong><p>프로젝트 로컬 skill로 harness installer를 둡니다.</p></div>
          <div class="flow-step"><span>02</span><strong>Project Brain</strong><p>PRD, Architecture, ADR로 agent의 판단 근거를 만듭니다.</p></div>
          <div class="flow-step"><span>03</span><strong>Phase 설계</strong><p>작업을 작은 승인 단위로 분리합니다.</p></div>
          <div class="flow-step"><span>04</span><strong>실행과 Hook</strong><p>러너와 안전 장치가 합의된 흐름을 지킵니다.</p></div>
          <div class="flow-step"><span>05</span><strong>Review/Verify</strong><p>결과를 문서와 done criteria로 검증합니다.</p></div>
        </div>
      </section>

      <section>
        <h2 id="references">참고 문서</h2>
        <ul>
          <li><a href="https://opencode.ai/docs/skills/" target="_blank" rel="noreferrer">OpenCode Agent Skills</a></li>
          <li><a href="https://opencode.ai/docs/agents/" target="_blank" rel="noreferrer">OpenCode Agents</a></li>
          <li><a href="https://opencode.ai/docs/mcp-servers/" target="_blank" rel="noreferrer">OpenCode MCP</a></li>
          <li><a href="https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages" target="_blank" rel="noreferrer">GitHub Pages custom workflows</a></li>
        </ul>
      </section>
    `,
  },
  {
    id: "skill-install",
    title: "01. Skill 설치",
    group: "Part 1. 시작",
    summary: "build-opencode-harness skill을 프로젝트에 배치하고 OpenCode가 읽을 수 있게 합니다.",
    body: `
      <p class="eyebrow">Chapter 01</p>
      <h1>Skill 설치</h1>
      <p class="lead">팀원은 공유받은 <code>build-opencode-harness</code> 디렉터리를 자기 프로젝트의 <code>.opencode/skills/</code> 아래에 배치합니다. 이때 <code>SKILL.md</code>만 복사하지 말고 하위 assets까지 함께 복사해야 합니다.</p>

      <h2 id="copy-path">복사 위치</h2>
      <pre><code>project/
+-- .opencode/
    +-- skills/
        +-- build-opencode-harness/
            +-- SKILL.md
            +-- agents/
            +-- assets/</code></pre>

      <h2 id="windows-copy">Windows 예시</h2>
      <pre><code class="language-powershell">New-Item -ItemType Directory -Force .opencode\\skills
Copy-Item -Recurse C:\\path\\to\\build-opencode-harness .opencode\\skills\\</code></pre>

      <h2 id="use-prompt">사용 프롬프트</h2>
      <p>프로젝트 루트에서 OpenCode에게 다음처럼 요청합니다.</p>
      <pre><code>Use $build-opencode-harness to install a phase-based harness in this project.</code></pre>

      <h2 id="checklist">체크리스트</h2>
      <ul class="status-list">
        <li><code>.opencode/skills/build-opencode-harness/SKILL.md</code>가 존재합니다.</li>
        <li><code>assets/harness-template/</code> 아래 템플릿 파일이 함께 있습니다.</li>
        <li>기존 프로젝트 파일이 있으면 overwrite가 아니라 merge 원칙을 적용합니다.</li>
      </ul>
    `,
  },
  {
    id: "result-tree",
    title: "02. 결과물 구조",
    group: "Part 1. 시작",
    summary: "harness 설치 후 생성되는 파일과 각 역할을 이해합니다.",
    body: `
      <p class="eyebrow">Chapter 02</p>
      <h1>Harness 결과물 구조</h1>
      <p class="lead">설치가 끝나면 프로젝트에는 문서, 로컬 skills, phase runner, hook이 들어옵니다. 이 구조는 agent가 자유롭게 추측하지 않고 문서와 승인된 phase 안에서 일하도록 만드는 장치입니다.</p>

      <h2 id="tree">Required Output Tree</h2>
      <pre class="tree"><code>project/
+-- AGENTS.md
+-- docs/
|   +-- PRD.md
|   +-- ARCHITECTURE.md
|   +-- ADR.md
|   +-- UI_GUIDE.md
+-- .opencode/
|   +-- skills/
|       +-- harness/
|       |   +-- SKILL.md
|       +-- review/
|           +-- SKILL.md
+-- scripts/
|   +-- execute.py
|   +-- hooks/
|       +-- pre_phase.py
|       +-- validate_phase.py
|       +-- post_phase.py
|       +-- tdd_guard.py
|       +-- dangerous_cmd_guard.py
|       +-- circuit_breaker.py
+-- phases/
    +-- _template/
        +-- 00-bootstrap.md
        +-- 10-plan.md
        +-- 20-implement.md
        +-- 30-review.md
        +-- 40-verify.md
        +-- state.json</code></pre>

      <h2 id="layers">4개 레이어</h2>
      <div class="grid-two">
        <div class="info-card"><h3>Project Brain</h3><p><code>docs/</code>는 요구사항, 아키텍처, 의사결정의 기준입니다.</p></div>
        <div class="info-card"><h3>Constitution</h3><p><code>AGENTS.md</code>는 agent가 반드시 지킬 프로젝트 규칙입니다.</p></div>
        <div class="info-card"><h3>Execution Engine</h3><p><code>scripts/execute.py</code>는 승인된 phase와 명령 블록을 실행합니다.</p></div>
        <div class="info-card"><h3>Safety Hooks</h3><p><code>scripts/hooks/</code>는 TDD, 위험 명령, 반복 실패를 감시합니다.</p></div>
      </div>
    `,
  },
  {
    id: "project-brain",
    title: "03. Project Brain",
    group: "Part 2. 문서화",
    summary: "PRD, Architecture, ADR, UI Guide를 agent의 판단 근거로 작성합니다.",
    body: `
      <p class="eyebrow">Chapter 03</p>
      <h1>Project Brain 작성</h1>
      <p class="lead">OpenCode harness의 핵심은 구현 전에 agent가 읽을 수 있는 판단 근거를 명확히 두는 것입니다. 문서가 비어 있으면 agent는 의도를 추측하게 됩니다.</p>

      <h2 id="prd">PRD.md</h2>
      <p><code>PRD.md</code>에는 무엇을 만들지, 누가 쓰는지, MVP 범위와 제외 범위를 씁니다. 특히 MVP 제외 범위는 <code>CRITICAL</code>로 적어 agent가 범위를 넓히지 못하게 합니다.</p>
      <pre><code>## MVP Exclusions

- CRITICAL: 관리자 대시보드는 이번 MVP에서 만들지 않는다.
- CRITICAL: 결제 기능은 외부 링크 안내까지만 제공한다.</code></pre>

      <h2 id="architecture">ARCHITECTURE.md</h2>
      <p>모듈 경계, 데이터 흐름, 빌드/테스트 명령을 기록합니다. agent는 이 파일을 기준으로 새 패턴 도입 여부와 검증 명령을 판단합니다.</p>

      <h2 id="adr">ADR.md</h2>
      <p>왜 그렇게 만들었는지 기록합니다. tradeoff와 rollback condition을 남기면 다음 작업자가 같은 결정을 반복해서 논쟁하지 않아도 됩니다.</p>

      <h2 id="ui-guide">UI_GUIDE.md</h2>
      <p>UI가 있는 프로젝트에서만 사용합니다. 제품 느낌, 레이아웃 규칙, 접근성, 반응형 기준을 적습니다.</p>
    `,
  },
  {
    id: "agents-md",
    title: "04. AGENTS.md",
    group: "Part 2. 문서화",
    summary: "프로젝트 헌법과 CRITICAL 규칙의 의미를 배웁니다.",
    body: `
      <p class="eyebrow">Chapter 04</p>
      <h1>AGENTS.md: 프로젝트 헌법</h1>
      <p class="lead"><code>AGENTS.md</code>는 agent가 변경 전에 읽어야 하는 최상위 규칙입니다. 이 파일은 취향 문서가 아니라 작업을 멈춰야 하는 조건과 리뷰 기준을 담습니다.</p>

      <h2 id="critical-rules">CRITICAL 규칙</h2>
      <p><code>CRITICAL</code>로 시작하는 규칙은 하드 제약입니다. 요구사항이 이 규칙을 어겨야 할 것처럼 보이면 agent는 작업을 멈추고 사용자에게 확인해야 합니다.</p>
      <pre><code>- CRITICAL: API keys and secrets must be read from environment variables only.
- CRITICAL: Do not expand scope beyond docs/PRD.md.
- CRITICAL: If a design decision changes, update docs/ADR.md.</code></pre>

      <h2 id="reading-order">필수 읽기 순서</h2>
      <ol>
        <li><code>AGENTS.md</code></li>
        <li><code>docs/PRD.md</code></li>
        <li><code>docs/ARCHITECTURE.md</code></li>
        <li><code>docs/ADR.md</code></li>
        <li><code>docs/UI_GUIDE.md</code> if UI exists</li>
        <li>현재 phase 파일</li>
      </ol>

      <h2 id="review-rules">리뷰 기준</h2>
      <p>리뷰는 스타일보다 correctness를 먼저 봅니다. 버그, 회귀, 보안 위험, 데이터 손실, API contract 파괴, 배포 위험을 우선순위로 둡니다.</p>
    `,
  },
  {
    id: "phase-workflow",
    title: "05. Phase Workflow",
    group: "Part 3. 실행",
    summary: "bootstrap, plan, implement, review, verify 흐름을 실습합니다.",
    body: `
      <p class="eyebrow">Chapter 05</p>
      <h1>Phase Workflow</h1>
      <p class="lead">harness는 작업을 한 번에 맡기지 않고 작은 phase로 쪼갭니다. 각 phase는 goal, inputs, instructions, done criteria, verification을 가져야 합니다.</p>

      <h2 id="phases">기본 phase</h2>
      <div class="flow">
        <div class="flow-step"><span>00</span><strong>Bootstrap</strong><p>문서가 충분하고 충돌이 없는지 확인합니다.</p></div>
        <div class="flow-step"><span>10</span><strong>Plan</strong><p>작고 검증 가능한 구현 계획을 만듭니다.</p></div>
        <div class="flow-step"><span>20</span><strong>Implement</strong><p>승인된 범위 안에서 TDD로 구현합니다.</p></div>
        <div class="flow-step"><span>30</span><strong>Review</strong><p>docs와 done criteria 기준으로 검토합니다.</p></div>
        <div class="flow-step"><span>40</span><strong>Verify</strong><p>빌드와 테스트 결과를 요약합니다.</p></div>
      </div>

      <h2 id="phase-file">Phase 파일 형식</h2>
      <pre><code>---
id: 20-implement
name: Implement
status: pending
requires:
  - 10-plan
---

# Goal
Implement the approved scope.

# Inputs
- Approved phase design
- AGENTS.md

# Instructions
Work inside the approved scope.

# Done Criteria
- Tests are added or updated.

# Verification
python scripts/hooks/tdd_guard.py
</code></pre>
    `,
  },
  {
    id: "runner",
    title: "06. Runner 사용",
    group: "Part 3. 실행",
    summary: "scripts/execute.py의 status, approve, run을 사용합니다.",
    body: `
      <p class="eyebrow">Chapter 06</p>
      <h1>Runner 사용</h1>
      <p class="lead"><code>scripts/execute.py</code>는 agent를 대체하는 자동 구현기가 아닙니다. 승인된 phase의 명령 블록을 실행하고, 상태와 hook을 관리하는 러너입니다.</p>

      <h2 id="status">상태 확인</h2>
      <pre><code class="language-bash">python scripts/execute.py phases/my-task status</code></pre>

      <h2 id="approve">사용자 승인 기록</h2>
      <p>phase 설계가 사용자에게 승인되기 전에는 run이 막힙니다.</p>
      <pre><code class="language-bash">python scripts/execute.py phases/my-task approve</code></pre>

      <h2 id="run">실행</h2>
      <pre><code class="language-bash">python scripts/execute.py phases/my-task run</code></pre>

      <h2 id="state">state.json</h2>
      <p><code>state.json</code>에는 승인 여부, 현재 phase, 완료 phase, blocked reason, failures가 기록됩니다. 교육 중에는 이 파일을 직접 열어 runner가 무엇을 추적하는지 확인합니다.</p>
    `,
  },
  {
    id: "safety-hooks",
    title: "07. Safety Hooks",
    group: "Part 3. 실행",
    summary: "TDD guard, dangerous command guard, circuit breaker를 이해합니다.",
    body: `
      <p class="eyebrow">Chapter 07</p>
      <h1>Safety Hooks</h1>
      <p class="lead">hook은 agent가 합의된 흐름을 우회하지 못하게 하는 안전 장치입니다. hook이 막으면 우회하지 말고 이유를 보고한 뒤 전략을 바꿉니다.</p>

      <h2 id="hook-table">Hook 역할</h2>
      <table>
        <thead><tr><th>Hook</th><th>역할</th><th>교육 포인트</th></tr></thead>
        <tbody>
          <tr><td><code>pre_phase.py</code></td><td>phase 시작 전 상태 점검</td><td>읽어야 할 문서와 입력이 준비됐는지 확인</td></tr>
          <tr><td><code>tdd_guard.py</code></td><td>TDD 흐름 감시</td><td>새 behavior에는 테스트가 먼저 있어야 함</td></tr>
          <tr><td><code>dangerous_cmd_guard.py</code></td><td>위험 명령 감지</td><td>삭제, reset, credential 작업은 승인 필요</td></tr>
          <tr><td><code>circuit_breaker.py</code></td><td>반복 실패 차단</td><td>같은 실패를 반복하면 전략 변경</td></tr>
        </tbody>
      </table>

      <h2 id="rule">운영 규칙</h2>
      <ul>
        <li>hook을 끄거나 우회하는 방식으로 문제를 해결하지 않습니다.</li>
        <li>막힌 이유를 phase state와 최종 보고에 남깁니다.</li>
        <li>반복 실패는 더 세게 밀어붙이는 신호가 아니라 설계를 다시 볼 신호입니다.</li>
      </ul>
    `,
  },
  {
    id: "harness-skill",
    title: "08. Harness Skill",
    group: "Part 4. 운영",
    summary: "설치 후 프로젝트 로컬 harness skill로 phase를 운영합니다.",
    body: `
      <p class="eyebrow">Chapter 08</p>
      <h1>Harness Skill 사용</h1>
      <p class="lead">설치 후에는 프로젝트 안에 <code>.opencode/skills/harness/SKILL.md</code>가 생깁니다. 이 skill은 phase 설계, 승인, status 확인, run을 운영하는 데 사용합니다.</p>

      <h2 id="prompt">추천 프롬프트</h2>
      <pre><code>Use $harness to design phases for adding user profile editing.
Read AGENTS.md and docs first, then propose a small phase plan.</code></pre>

      <h2 id="operating-rules">운영 규칙</h2>
      <ol>
        <li>먼저 <code>AGENTS.md</code>와 <code>docs/</code>를 읽습니다.</li>
        <li>사용자와 phase 파일을 설계합니다.</li>
        <li>승인 전에는 실행하지 않습니다.</li>
        <li>hook block을 우회하지 않습니다.</li>
      </ol>
    `,
  },
  {
    id: "review-skill",
    title: "09. Review Skill",
    group: "Part 4. 운영",
    summary: "완료된 phase 또는 local diff를 correctness 중심으로 리뷰합니다.",
    body: `
      <p class="eyebrow">Chapter 09</p>
      <h1>Review Skill 사용</h1>
      <p class="lead"><code>.opencode/skills/review/SKILL.md</code>는 스타일 피드백보다 실제 결함을 찾는 리뷰 흐름을 강제합니다. Findings first가 기본 형식입니다.</p>

      <h2 id="review-inputs">리뷰 입력</h2>
      <ul>
        <li><code>AGENTS.md</code></li>
        <li><code>docs/PRD.md</code>, <code>ARCHITECTURE.md</code>, <code>ADR.md</code></li>
        <li>관련 phase 파일</li>
        <li><code>git status --short --branch</code>, <code>git diff --stat</code>, <code>git diff</code></li>
      </ul>

      <h2 id="review-shape">보고 형식</h2>
      <pre><code>**Findings**
- [Important] path/to/file:line Issue title
  Explain the defect and a minimal fix direction.

**Summary**
Briefly state what was reviewed and what verification remains.</code></pre>
    `,
  },
  {
    id: "practice",
    title: "10. 실습 과제",
    group: "Part 5. 적용",
    summary: "빈 프로젝트에 harness를 설치하고 작은 기능을 phase로 완료합니다.",
    body: `
      <p class="eyebrow">Chapter 10</p>
      <h1>실습 과제</h1>
      <p class="lead">교육의 마지막은 작은 프로젝트에 harness를 실제로 설치하고, 문서 작성부터 review까지 한 번 통과하는 것입니다.</p>

      <h2 id="exercise">과제</h2>
      <ol>
        <li>빈 repo 또는 사내 샘플 repo를 준비합니다.</li>
        <li><code>build-opencode-harness</code> skill을 프로젝트에 복사합니다.</li>
        <li>OpenCode에게 harness 설치를 요청합니다.</li>
        <li><code>docs/PRD.md</code>에 "간단한 TODO 목록" MVP를 작성합니다.</li>
        <li><code>docs/ARCHITECTURE.md</code>에 build/test 명령을 작성합니다.</li>
        <li><code>phases/todo-list/</code> 아래 phase를 설계합니다.</li>
        <li>사용자 승인 후 <code>approve</code>, <code>run</code>, <code>review</code>, <code>verify</code> 흐름을 진행합니다.</li>
      </ol>

      <h2 id="completion">완료 기준</h2>
      <ul>
        <li>작업 전 docs가 채워져 있습니다.</li>
        <li>phase done criteria가 명확합니다.</li>
        <li>최소 하나 이상의 검증 명령이 실행됐습니다.</li>
        <li>review 결과와 남은 risk가 기록됐습니다.</li>
      </ul>
    `,
  },
  {
    id: "team-rollout",
    title: "11. 사내 Rollout",
    group: "Part 5. 적용",
    summary: "팀 표준으로 배포할 때의 운영 규칙과 체크리스트를 정리합니다.",
    body: `
      <p class="eyebrow">Chapter 11</p>
      <h1>사내 Rollout 가이드</h1>
      <p class="lead">harness는 파일 템플릿보다 운영 습관이 더 중요합니다. 팀에 배포할 때는 어디까지 자동화하고 어디서 사람 승인을 받을지 명확히 정합니다.</p>

      <h2 id="rollout-plan">도입 순서</h2>
      <ol>
        <li>대표 프로젝트 하나에 pilot 적용</li>
        <li><code>AGENTS.md</code>의 CRITICAL 규칙을 팀 표준으로 합의</li>
        <li>PRD/Architecture/ADR 템플릿을 팀 언어로 보강</li>
        <li>review skill 결과를 PR 리뷰 프로세스에 연결</li>
        <li>반복되는 hook block 사례를 ADR 또는 onboarding 문서에 반영</li>
      </ol>

      <h2 id="team-checklist">팀 체크리스트</h2>
      <table>
        <thead><tr><th>항목</th><th>확인 질문</th></tr></thead>
        <tbody>
          <tr><td>Scope</td><td>PRD의 MVP 제외 범위가 agent가 읽을 만큼 구체적인가?</td></tr>
          <tr><td>Architecture</td><td>새 패턴 도입 시 ARCHITECTURE와 ADR 업데이트가 필요한가?</td></tr>
          <tr><td>Approval</td><td>phase 실행 전에 사용자가 승인했는가?</td></tr>
          <tr><td>Verification</td><td>빌드/테스트 명령이 문서와 phase에 모두 적혀 있는가?</td></tr>
          <tr><td>Review</td><td>style보다 correctness 중심으로 findings가 작성됐는가?</td></tr>
        </tbody>
      </table>

      <h2 id="pages">GitHub Pages 운영</h2>
      <p>이 사이트는 GitHub Actions의 Pages workflow로 배포됩니다. repo settings에서 Pages source를 GitHub Actions로 두고, <code>main</code> branch push 후 workflow가 통과했는지 확인합니다.</p>
    `,
  },
];

const chapterList = document.querySelector("#chapter-list");
const tocList = document.querySelector("#toc-list");
const doc = document.querySelector("#doc");
const searchInput = document.querySelector("#doc-search");

function slugFromHash() {
  return decodeURIComponent(window.location.hash.replace("#", "")) || chapters[0].id;
}

function findChapter(id) {
  return chapters.find((chapter) => chapter.id === id) || chapters[0];
}

function renderNavigation(filter = "") {
  const needle = filter.trim().toLowerCase();
  const current = findChapter(slugFromHash()).id;
  const visible = chapters.filter((chapter) => {
    const haystack = `${chapter.title} ${chapter.group} ${chapter.summary}`.toLowerCase();
    return haystack.includes(needle);
  });

  chapterList.innerHTML = "";

  if (visible.length === 0) {
    const item = document.createElement("li");
    item.className = "empty-state";
    item.textContent = "검색 결과가 없습니다.";
    chapterList.append(item);
    return;
  }

  visible.forEach((chapter, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-current", chapter.id === current ? "page" : "false");
    button.innerHTML = `<span class="chapter-number">${String(index + 1).padStart(2, "0")}</span><span>${chapter.title}</span>`;
    button.addEventListener("click", () => {
      window.location.hash = chapter.id;
    });
    item.append(button);
    chapterList.append(item);
  });
}

function renderToc() {
  tocList.innerHTML = "";
  const headings = [...doc.querySelectorAll("h2[id]")];
  headings.forEach((heading) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${findChapter(slugFromHash()).id}`;
    link.textContent = heading.textContent;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      heading.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    item.append(link);
    tocList.append(item);
  });
}

function renderChapter() {
  const chapter = findChapter(slugFromHash());
  document.title = `${chapter.title} - OpenCode Harness Tutorial`;
  doc.innerHTML = chapter.body;
  doc.focus({ preventScroll: true });
  renderNavigation(searchInput.value);
  renderToc();
  window.scrollTo({ top: 0, behavior: "auto" });
}

searchInput.addEventListener("input", (event) => {
  renderNavigation(event.target.value);
});

window.addEventListener("hashchange", renderChapter);

if (!window.location.hash) {
  window.location.hash = chapters[0].id;
} else {
  renderChapter();
}
