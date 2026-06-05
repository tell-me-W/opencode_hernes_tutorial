const chapters = [
  {
    id: "intro",
    title: "Introduction",
    group: "Part 1. 시작",
    summary: "OpenCode harness 교육의 목적, 산출물, 진행 방식을 잡습니다.",
    body: `
      <p class="eyebrow">OpenCode Harness Tutorial</p>
      <h1>OpenCode Harness 사내 교육 커리큘럼</h1>
      <p class="lead">이 문서는 팀원이 <code>build-opencode-harness</code> skill을 받아 자기 프로젝트에 설치하고, 문서 기반 phase workflow로 개발과 리뷰를 운영할 수 있게 만드는 실전형 가이드입니다.</p>

      <div class="callout">
        <strong>운영 태그: SESSION-INTRO-2H</strong>
        <p>권장 진행은 2시간 입문 세션, 2시간 실습 세션, 1개 팀 프로젝트 적용 과제입니다. 입문 세션에서는 구조와 규칙을 이해하고, 실습 세션에서는 실제 repo에 harness를 설치해 작은 기능을 phase로 완료합니다.</p>
      </div>

      <section>
        <h2 id="why">왜 Harness인가</h2>
        <p>OpenCode를 단순한 코드 생성 도구처럼 쓰면 agent가 요구사항을 추측하고, 범위를 넓히고, 검증을 빠뜨리는 순간이 생깁니다. harness는 그 반대 방향으로 설계되어 있습니다. 먼저 문서를 만들고, 작업을 phase로 쪼개고, 사용자 승인을 받은 뒤, hook과 review로 결과를 검증합니다.</p>
        <p>교육의 핵심 메시지는 하나입니다. agent에게 더 많은 자유를 주는 것이 아니라, 좋은 판단 근거와 안전한 작업 레일을 주는 것입니다.</p>
      </section>

      <section>
        <h2 id="outcomes">교육 후 산출물</h2>
        <table>
          <tbody>
            <tr><th>Project Brain</th><td><code>docs/PRD.md</code>, <code>docs/ARCHITECTURE.md</code>, <code>docs/ADR.md</code>, 필요 시 <code>docs/UI_GUIDE.md</code></td></tr>
            <tr><th>Project Constitution</th><td>agent가 먼저 읽는 <code>AGENTS.md</code>와 CRITICAL 규칙</td></tr>
            <tr><th>Project Skills</th><td><code>.opencode/skills/harness/SKILL.md</code>, <code>.opencode/skills/review/SKILL.md</code></td></tr>
            <tr><th>Execution Layer</th><td><code>scripts/execute.py</code>, <code>scripts/hooks/</code>, <code>phases/</code></td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 id="map">전체 학습 지도</h2>
        <div class="flow">
          <div class="flow-step"><span>01</span><strong>준비</strong><p>OpenCode, git, Python, repo 상태를 점검합니다.</p></div>
          <div class="flow-step"><span>02</span><strong>설치</strong><p>skill 패키지를 로컬 skill로 복사하고 harness를 생성합니다.</p></div>
          <div class="flow-step"><span>03</span><strong>문서화</strong><p>PRD, Architecture, ADR을 채워 agent의 기준을 만듭니다.</p></div>
          <div class="flow-step"><span>04</span><strong>Phase</strong><p>작업을 작게 나누고 승인 후 실행합니다.</p></div>
          <div class="flow-step"><span>05</span><strong>리뷰</strong><p>diff와 done criteria를 기준으로 검증합니다.</p></div>
        </div>
      </section>

      <section>
        <h2 id="official-refs">공식 참고 문서</h2>
        <ul>
          <li><a href="https://opencode.ai/docs/skills/" target="_blank" rel="noreferrer">OpenCode Agent Skills</a></li>
          <li><a href="https://opencode.ai/docs/agents/" target="_blank" rel="noreferrer">OpenCode Agents</a></li>
          <li><a href="https://opencode.ai/docs/config" target="_blank" rel="noreferrer">OpenCode Config</a></li>
          <li><a href="https://opencode.ai/docs/permissions" target="_blank" rel="noreferrer">OpenCode Permissions</a></li>
          <li><a href="https://opencode.ai/docs/mcp-servers/" target="_blank" rel="noreferrer">OpenCode MCP servers</a></li>
        </ul>
      </section>
    `,
  },
  {
    id: "prerequisites",
    title: "00. 사전 준비",
    group: "Part 1. 시작",
    summary: "수강 전에 필요한 도구, 계정, repo 상태를 점검합니다.",
    body: `
      <p class="eyebrow">Chapter 00</p>
      <h1>사전 준비</h1>
      <p class="lead">harness 교육은 실제 프로젝트 루트에서 진행하는 것이 가장 좋습니다. 준비가 덜 된 상태에서 시작하면 skill 자체보다 환경 문제에 시간을 쓰게 됩니다.</p>

      <h2 id="tools">필수 도구</h2>
      <table>
        <thead><tr><th>도구</th><th>확인 명령</th><th>왜 필요한가</th></tr></thead>
        <tbody>
          <tr><td>OpenCode</td><td><code>opencode --version</code></td><td>skill을 로드하고 agent workflow를 실행합니다.</td></tr>
          <tr><td>Git</td><td><code>git status --short --branch</code></td><td>기존 변경을 보호하고 review skill에서 diff를 확인합니다.</td></tr>
          <tr><td>Python 3</td><td><code>python --version</code></td><td><code>scripts/execute.py</code>와 hook을 실행합니다.</td></tr>
          <tr><td>GitHub CLI</td><td><code>gh auth status</code></td><td>PR 리뷰, Pages 확인, repo 상태 확인에 사용합니다.</td></tr>
        </tbody>
      </table>

      <h2 id="repo-state">Repo 상태 점검</h2>
      <pre><code>git status --short --branch
git remote -v
git log --oneline -5</code></pre>
      <p>기존 변경이 있으면 먼저 커밋하거나, 교육용 branch를 만듭니다. harness 설치는 많은 파일을 추가하므로 dirty worktree에서는 어떤 변경이 교육 중 생긴 것인지 헷갈리기 쉽습니다.</p>

      <h2 id="training-folder">교육용 폴더 전략</h2>
      <ul>
        <li>처음 수강자는 빈 repo 또는 작은 샘플 앱에서 시작합니다.</li>
        <li>팀 리드는 실제 제품 repo 복사본에서 시작해 기존 문서와 merge되는 상황을 연습합니다.</li>
        <li>사내 표준을 만들 때는 pilot repo 하나를 정하고, 거기서 나온 규칙을 템플릿에 반영합니다.</li>
      </ul>
    `,
  },
  {
    id: "opencode-concepts",
    title: "01. OpenCode 핵심 개념",
    group: "Part 1. 시작",
    summary: "skills, agents, config, permissions, instructions가 harness와 어떻게 연결되는지 설명합니다.",
    body: `
      <p class="eyebrow">Chapter 01</p>
      <h1>OpenCode 핵심 개념</h1>
      <p class="lead">harness는 OpenCode의 skills, instructions, permissions, agents 개념 위에 올라갑니다. 설치 절차를 외우기 전에 이 네 가지가 어떻게 맞물리는지 이해해야 합니다.</p>

      <h2 id="skills">Skills</h2>
      <p>OpenCode skills는 반복 가능한 작업 절차를 <code>SKILL.md</code>로 정의합니다. 공식 문서 기준으로 OpenCode searches these locations: <code>.opencode/skills/&lt;name&gt;/SKILL.md</code>, global config의 skills 경로, Claude-compatible 경로, agent-compatible 경로를 탐색합니다.</p>
      <pre><code>.opencode/
  skills/
    build-opencode-harness/
      SKILL.md
      agents/
      assets/</code></pre>
      <p>skill 이름은 폴더명과 frontmatter의 <code>name</code>이 맞아야 합니다. 이 교육에서는 <code>build-opencode-harness</code>가 설치용 skill이고, 설치 후에는 <code>harness</code>와 <code>review</code>가 프로젝트 로컬 운영 skill로 생깁니다.</p>

      <h2 id="instructions">Instructions</h2>
      <p>OpenCode config의 <code>instructions</code>는 모델이 읽을 규칙 파일을 지정합니다. harness에서는 <code>AGENTS.md</code>가 그 역할을 합니다. 팀에서 이미 <code>CONTRIBUTING.md</code>나 coding guide가 있다면, <code>AGENTS.md</code>에 요약하거나 instructions에 함께 연결합니다.</p>

      <h2 id="permissions">Permissions</h2>
      <p><code>permission</code> 설정은 action을 자동 실행할지, 사용자에게 물을지, 차단할지를 정합니다. skill 접근은 <code>permission.skill</code> 또는 agent별 permission으로 제어할 수 있습니다.</p>
      <pre><code>{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "*": "ask",
    "edit": "ask",
    "bash": "ask",
    "skill": {
      "*": "allow",
      "experimental-*": "ask"
    }
  }
}</code></pre>

      <h2 id="agents">Agents</h2>
      <p>agent는 역할과 권한을 가진 작업자입니다. harness 관점에서는 모든 agent가 같은 방식으로 일하는 것이 아니라, 계획 agent는 문서를 읽고 phase를 설계하고, 구현 agent는 승인된 phase 안에서만 작업하고, review 흐름은 diff와 done criteria를 기준으로 판단해야 합니다.</p>
    `,
  },
  {
    id: "skill-install",
    title: "02. Skill 설치",
    group: "Part 2. 설치",
    summary: "build-opencode-harness skill을 프로젝트에 복사하고 설치 요청을 실행합니다.",
    body: `
      <p class="eyebrow">Chapter 02</p>
      <h1>Skill 설치</h1>
      <p class="lead">공유 대상은 단일 <code>SKILL.md</code>가 아니라 <code>agents/</code>와 <code>assets/harness-template/</code>를 포함한 전체 디렉터리입니다. 템플릿 assets가 빠지면 harness 설치가 불완전해집니다.</p>

      <h2 id="preflight">복사 전 점검</h2>
      <p><span class="badge">COPY-PREFLIGHT</span></p>
      <ol>
        <li>현재 위치가 적용 대상 프로젝트 루트인지 확인합니다.</li>
        <li><code>.opencode/skills/</code>가 이미 있으면 기존 skill 이름과 충돌하지 않는지 확인합니다.</li>
        <li>기존 <code>AGENTS.md</code>, <code>docs/</code>, <code>scripts/</code>, <code>phases/</code>가 있으면 overwrite가 아니라 merge로 처리합니다.</li>
        <li>교육용 repo라면 복사 전 clean commit을 하나 만들어 rollback 지점을 둡니다.</li>
      </ol>

      <h2 id="copy-windows">Windows 복사 예시</h2>
      <pre><code>New-Item -ItemType Directory -Force .opencode\\skills
Copy-Item -Recurse C:\\Users\\piuto\\Documents\\Codex\\AI-Presentation-Skill\\.opencode\\skills\\build-opencode-harness .opencode\\skills\\</code></pre>

      <h2 id="copy-unix">Linux 또는 macOS 예시</h2>
      <pre><code>mkdir -p .opencode/skills
cp -R /path/to/build-opencode-harness .opencode/skills/</code></pre>

      <h2 id="install-prompt">OpenCode 요청 문장</h2>
      <pre><code>Use $build-opencode-harness to install a phase-based harness in this project.
Preserve existing files and merge rather than overwrite.</code></pre>

      <h2 id="success">성공 확인</h2>
      <pre><code>Test-Path AGENTS.md
Test-Path docs\\PRD.md
Test-Path .opencode\\skills\\harness\\SKILL.md
python scripts\\execute.py phases\\_template status</code></pre>
      <p>마지막 명령이 phase 목록과 <code>approved_by_user: false</code> 상태를 보여주면 설치가 정상입니다. 아직 승인 전이므로 run이 막히는 것이 맞습니다.</p>
    `,
  },
  {
    id: "result-tree",
    title: "03. 결과물 구조",
    group: "Part 2. 설치",
    summary: "설치 후 생성되는 파일의 책임과 소유권을 설명합니다.",
    body: `
      <p class="eyebrow">Chapter 03</p>
      <h1>Harness 결과물 구조</h1>
      <p class="lead">각 파일은 역할이 다릅니다. 교육 중에는 tree를 한 번 외우는 것이 아니라, agent가 언제 어떤 파일을 읽고 어떤 기준으로 멈추는지 연결해서 설명합니다.</p>

      <h2 id="tree">전체 Tree</h2>
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

      <h2 id="ownership">파일별 소유권</h2>
      <table>
        <thead><tr><th>파일</th><th>소유자</th><th>바뀌는 시점</th></tr></thead>
        <tbody>
          <tr><td><code>AGENTS.md</code></td><td>팀 리드</td><td>팀 규칙, 보안 규칙, 리뷰 기준 변경 시</td></tr>
          <tr><td><code>docs/PRD.md</code></td><td>제품/개발 리드</td><td>범위, 제외 범위, 성공 기준 변경 시</td></tr>
          <tr><td><code>docs/ARCHITECTURE.md</code></td><td>개발자</td><td>모듈 경계, 빌드, 테스트 전략 변경 시</td></tr>
          <tr><td><code>docs/ADR.md</code></td><td>결정권자</td><td>중요한 tradeoff가 생겼을 때</td></tr>
          <tr><td><code>phases/*</code></td><td>작업 담당자</td><td>작업 시작 전 설계하고 승인 후 고정</td></tr>
        </tbody>
      </table>

      <h2 id="anti-patterns">구조 안티패턴</h2>
      <ul>
        <li><code>.opencode/skill/</code>처럼 단수 경로를 만드는 것: project-local skills는 <code>.opencode/skills/&lt;name&gt;/SKILL.md</code> 구조를 사용합니다.</li>
        <li><code>commands/</code> 폴더를 따로 만드는 것: 이 harness는 command-like 절차를 skill로 둡니다.</li>
        <li>phase 파일을 <code>phases/</code> 바로 아래 난잡하게 두는 것: 실제 작업은 <code>phases/&lt;task-name&gt;/</code> 아래에 둡니다.</li>
      </ul>
    `,
  },
  {
    id: "project-brain",
    title: "04. Project Brain",
    group: "Part 3. 문서화",
    summary: "PRD, Architecture, ADR, UI Guide가 agent 판단에 주는 영향을 설명합니다.",
    body: `
      <p class="eyebrow">Chapter 04</p>
      <h1>Project Brain 작성 원칙</h1>
      <p class="lead">Project Brain은 문서 보관함이 아니라 agent의 판단 근거입니다. 좋은 문서는 길기만 한 문서가 아니라, 범위와 tradeoff를 분명히 말하는 문서입니다.</p>

      <h2 id="prd-role">PRD의 역할</h2>
      <p>PRD는 agent가 "무엇을 만들지"와 "무엇을 만들지 않을지"를 판단하는 기준입니다. 특히 MVP Exclusions가 중요합니다. 제외 범위가 없으면 agent는 좋아 보이는 기능을 덧붙이기 쉽습니다.</p>

      <h2 id="architecture-role">Architecture의 역할</h2>
      <p>Architecture 문서는 "어디에 코드를 둘지", "어떤 dependency를 쓸지", "어떤 명령으로 검증할지"를 알려줍니다. agent가 새 폴더 구조나 패턴을 만들고 싶어 할 때, 이 문서가 기준이 됩니다.</p>

      <h2 id="adr-role">ADR의 역할</h2>
      <p>ADR은 결정의 이유를 남깁니다. "왜 A가 아니라 B인가"를 쓰지 않으면 다음 phase에서 agent가 같은 문제를 다시 열고 다른 결정을 내릴 수 있습니다.</p>

      <h2 id="ui-guide-role">UI Guide의 역할</h2>
      <p>UI Guide는 UI가 있는 프로젝트에서만 필수입니다. 제품의 톤, density, 컴포넌트 사용 규칙, 반응형 기준을 적어두면 agent가 매번 새로운 디자인 취향을 적용하는 것을 줄입니다.</p>

      <h2 id="doc-quality">좋은 문서의 기준</h2>
      <ul>
        <li>CRITICAL 규칙은 실제로 멈춰야 하는 조건에만 붙입니다.</li>
        <li>검증 명령은 복사해서 실행 가능한 형태로 씁니다.</li>
        <li>빈 <code>TBD</code>는 교육 중 모두 제거합니다.</li>
        <li>문서끼리 충돌하면 구현 전에 충돌을 해결합니다.</li>
      </ul>
    `,
  },
  {
    id: "project-brain-templates",
    title: "05. 문서 작성 워크시트",
    group: "Part 3. 문서화",
    summary: "PRD, Architecture, ADR을 바로 채울 수 있는 질문과 예시를 제공합니다.",
    body: `
      <p class="eyebrow">Chapter 05</p>
      <h1>Project Brain 워크시트</h1>
      <p class="lead">처음부터 완벽한 문서를 쓰려고 하면 오래 걸립니다. 아래 질문에 짧게 답한 뒤, phase를 진행하면서 구체화합니다.</p>

      <h2 id="prd-worksheet">PRD 작성 워크시트</h2>
      <p><span class="badge">PRD-WORKSHEET</span></p>
      <table>
        <thead><tr><th>섹션</th><th>질문</th><th>예시</th></tr></thead>
        <tbody>
          <tr><td>Goal</td><td>이번 MVP가 해결하는 한 가지 문제는?</td><td>팀원이 고객 피드백을 빠르게 등록하고 상태를 추적한다.</td></tr>
          <tr><td>Users</td><td>가장 먼저 쓰는 사람은 누구인가?</td><td>CS 담당자와 제품 매니저</td></tr>
          <tr><td>Core Features</td><td>없으면 제품이 성립하지 않는 기능은?</td><td>피드백 등록, 상태 변경, 목록 필터</td></tr>
          <tr><td>MVP Exclusions</td><td>이번에 절대 만들지 않을 것은?</td><td>CRITICAL: 외부 고객 포털은 만들지 않는다.</td></tr>
          <tr><td>Success Criteria</td><td>완료를 어떻게 증명할 것인가?</td><td>신규 피드백 등록부터 완료 처리까지 테스트가 통과한다.</td></tr>
        </tbody>
      </table>

      <h2 id="architecture-template">Architecture 작성 예시</h2>
      <pre><code># Architecture

## Overview
React single-page app with local JSON persistence for the training MVP.

## Modules And Boundaries
- src/feedback/: feedback domain state and validation
- src/ui/: reusable presentation components
- src/app/: routing and page composition

## Build And Run
npm install
npm run dev

## Test Strategy
npm test
npm run build</code></pre>

      <h2 id="adr-template">ADR 작성 예시</h2>
      <pre><code>## ADR-001: Use local JSON persistence for MVP

Status: Accepted

### Context
The pilot needs a low-friction demo without provisioning a database.

### Decision
Store feedback records in local JSON during the training MVP.

### Alternatives Considered
- SQLite: closer to production, but more setup for first training.
- Remote DB: realistic, but introduces credentials and network risk.

### Tradeoffs
- CRITICAL: Do not design multi-user concurrency in this MVP.

### Rollback Conditions
Move to SQLite when the pilot needs shared data across users.</code></pre>
    `,
  },
  {
    id: "agents-md",
    title: "06. AGENTS.md",
    group: "Part 3. 문서화",
    summary: "프로젝트 헌법과 CRITICAL 규칙의 의미를 배웁니다.",
    body: `
      <p class="eyebrow">Chapter 06</p>
      <h1>AGENTS.md: 프로젝트 헌법</h1>
      <p class="lead"><code>AGENTS.md</code>는 agent가 변경 전에 읽어야 하는 최상위 규칙입니다. 이 파일은 취향 문서가 아니라 작업을 멈춰야 하는 조건과 리뷰 기준을 담습니다.</p>

      <h2 id="critical">CRITICAL 규칙</h2>
      <p><code>CRITICAL</code>은 agent가 임의로 넘기면 안 되는 hard constraint입니다. "좋아 보이는 개선"이라도 CRITICAL 규칙과 충돌하면 멈추고 사용자 확인을 받아야 합니다.</p>
      <pre><code>- CRITICAL: Never hardcode secrets, tokens, passwords, API keys, or private endpoints.
- CRITICAL: Do not expand scope beyond docs/PRD.md.
- CRITICAL: If a design decision changes, update docs/ADR.md.
- CRITICAL: Do not bypass scripts/hooks/tdd_guard.py.</code></pre>

      <h2 id="reading-order">필수 읽기 순서</h2>
      <ol>
        <li><code>AGENTS.md</code></li>
        <li><code>docs/PRD.md</code></li>
        <li><code>docs/ARCHITECTURE.md</code></li>
        <li><code>docs/ADR.md</code></li>
        <li><code>docs/UI_GUIDE.md</code> if UI exists</li>
        <li>현재 phase 파일</li>
      </ol>

      <h2 id="team-custom">팀별 커스터마이징</h2>
      <ul>
        <li>보안팀 요구사항은 CRITICAL 규칙으로 올립니다.</li>
        <li>코드 스타일은 formatter나 lint로 검증할 수 있을 때만 규칙화합니다.</li>
        <li>리뷰 기준은 "중요한 결함 먼저" 원칙을 유지합니다.</li>
        <li>기존 convention을 바꾸는 규칙은 ADR과 함께 변경합니다.</li>
      </ul>
    `,
  },
  {
    id: "phase-workflow",
    title: "07. Phase Workflow",
    group: "Part 4. 실행",
    summary: "bootstrap, plan, implement, review, verify 흐름을 이해합니다.",
    body: `
      <p class="eyebrow">Chapter 07</p>
      <h1>Phase Workflow</h1>
      <p class="lead">phase는 agent에게 주는 작은 계약입니다. 각 phase는 goal, inputs, instructions, done criteria, verification을 가져야 하며, 승인 전 실행하지 않습니다.</p>

      <h2 id="five-phases">기본 5단계</h2>
      <div class="flow">
        <div class="flow-step"><span>00</span><strong>Bootstrap</strong><p>문서와 규칙이 충분한지 확인합니다.</p></div>
        <div class="flow-step"><span>10</span><strong>Plan</strong><p>작고 검증 가능한 phase plan을 만듭니다.</p></div>
        <div class="flow-step"><span>20</span><strong>Implement</strong><p>승인된 범위 안에서 TDD로 구현합니다.</p></div>
        <div class="flow-step"><span>30</span><strong>Review</strong><p>diff, docs, done criteria 기준으로 검토합니다.</p></div>
        <div class="flow-step"><span>40</span><strong>Verify</strong><p>빌드와 테스트 결과를 최종 확인합니다.</p></div>
      </div>

      <h2 id="done-criteria">Done Criteria 작성법</h2>
      <p>done criteria는 "구현 완료"처럼 모호하면 안 됩니다. 무엇을 보면 끝났다고 말할 수 있는지 써야 합니다.</p>
      <table>
        <thead><tr><th>약한 기준</th><th>좋은 기준</th></tr></thead>
        <tbody>
          <tr><td>로그인 화면 구현</td><td>사용자가 이메일과 비밀번호를 입력하면 validation error 또는 success state가 테스트로 검증된다.</td></tr>
          <tr><td>리뷰 완료</td><td>중요 finding이 없거나, finding이 issue로 기록되고 owner가 지정된다.</td></tr>
          <tr><td>검증 완료</td><td><code>npm test</code>와 <code>npm run build</code>가 exit 0으로 끝난다.</td></tr>
        </tbody>
      </table>
    `,
  },
  {
    id: "phase-design-lab",
    title: "08. Phase 설계 실습",
    group: "Part 4. 실행",
    summary: "TODO 기능을 예시로 실제 phase 파일을 설계합니다.",
    body: `
      <p class="eyebrow">Chapter 08</p>
      <h1>Phase 설계 실습</h1>
      <p class="lead">이 장에서는 작은 TODO 기능을 예로 phase를 직접 설계합니다. 목표는 완벽한 기능 구현이 아니라, agent가 일할 수 있는 충분히 작은 계약을 만드는 것입니다.</p>
      <p><span class="badge">PHASE-DESIGN-LAB</span></p>

      <h2 id="scenario">시나리오</h2>
      <p>사용자는 TODO를 추가하고 완료 처리할 수 있어야 합니다. 이번 MVP에서는 로그인, 서버 저장, 협업 기능은 제외합니다.</p>

      <h2 id="task-dir">작업 디렉터리</h2>
      <pre><code>phases/todo-list/
  00-bootstrap.md
  10-plan.md
  20-domain-tests.md
  30-ui-implement.md
  40-review.md
  50-verify.md
  state.json</code></pre>

      <h2 id="sample-phase">샘플 phase</h2>
      <pre><code>---
id: 20-domain-tests
name: Domain Tests
status: pending
requires:
  - 10-plan
---

# Goal
Define TODO domain behavior with failing tests before implementation.

# Inputs
- docs/PRD.md
- docs/ARCHITECTURE.md
- docs/ADR.md

# Instructions
Write tests for adding a TODO, toggling completion, and rejecting empty text.
Do not implement UI in this phase.

# Done Criteria
- Tests fail first for missing domain behavior.
- Minimal domain implementation passes the tests.
- No UI files are changed.

# Verification
npm test -- todo-domain</code></pre>

      <h2 id="approval-script">승인 전 대화 예시</h2>
      <pre><code>Use $harness to design phases for the TODO list MVP.
Before running anything, show me the phase files and explain the done criteria.
After I approve, run python scripts/execute.py phases/todo-list approve.</code></pre>
    `,
  },
  {
    id: "runner",
    title: "09. Runner 사용",
    group: "Part 4. 실행",
    summary: "scripts/execute.py의 status, approve, run 흐름을 설명합니다.",
    body: `
      <p class="eyebrow">Chapter 09</p>
      <h1>Runner 사용</h1>
      <p class="lead"><code>scripts/execute.py</code>는 agent를 대신해 구현하는 도구가 아닙니다. 승인된 phase의 명령 블록을 실행하고, state와 hook을 관리하는 작은 runner입니다.</p>

      <h2 id="status">상태 확인</h2>
      <pre><code>python scripts/execute.py phases/todo-list status</code></pre>
      <p>교육 중에는 status 출력을 함께 읽습니다. <code>approved_by_user</code>, <code>current_phase</code>, <code>completed</code>, <code>blocked</code>, <code>failures</code>가 무엇을 의미하는지 확인합니다.</p>

      <h2 id="approve">승인 기록</h2>
      <pre><code>python scripts/execute.py phases/todo-list approve</code></pre>
      <p>승인은 "사용자가 phase 설계와 done criteria를 봤고 실행을 허락했다"는 기록입니다. 승인 없이 run이 막히는 것은 정상 동작입니다.</p>

      <h2 id="run">실행</h2>
      <pre><code>python scripts/execute.py phases/todo-list run</code></pre>
      <p>runner는 phase markdown 안의 shell command block을 실행합니다. agent가 해야 하는 사고 작업은 자동 실행하지 않습니다. 그래서 phase에 명령을 무리하게 많이 넣기보다, 검증 명령과 상태 확인 명령을 명확히 두는 편이 좋습니다.</p>

      <h2 id="failure">실패했을 때</h2>
      <p>명령이 실패하면 runner는 <code>state.json</code>의 <code>blocked</code>와 <code>failures</code>에 실패 정보를 남깁니다. 다음 시도는 같은 명령 반복이 아니라 실패 원인 분석과 phase 수정이어야 합니다.</p>
    `,
  },
  {
    id: "safety-hooks",
    title: "10. Safety Hooks",
    group: "Part 4. 실행",
    summary: "TDD guard, dangerous command guard, circuit breaker의 운영 의도를 설명합니다.",
    body: `
      <p class="eyebrow">Chapter 10</p>
      <h1>Safety Hooks</h1>
      <p class="lead">hook은 agent가 합의된 흐름을 우회하지 못하게 하는 안전 장치입니다. hook이 막으면 우회하지 말고 이유를 보고한 뒤 전략을 바꿉니다.</p>

      <h2 id="hook-table">Hook 역할</h2>
      <table>
        <thead><tr><th>Hook</th><th>역할</th><th>교육 포인트</th></tr></thead>
        <tbody>
          <tr><td><code>pre_phase.py</code></td><td>phase 시작 전 상태 점검</td><td>문서와 입력이 준비됐는지 확인합니다.</td></tr>
          <tr><td><code>validate_phase.py</code></td><td>phase 완료 조건 점검</td><td>done criteria가 검증 가능한지 봅니다.</td></tr>
          <tr><td><code>tdd_guard.py</code></td><td>TDD 흐름 감시</td><td>새 behavior에는 테스트가 먼저 있어야 합니다.</td></tr>
          <tr><td><code>dangerous_cmd_guard.py</code></td><td>위험 명령 감지</td><td>삭제, reset, credential 작업은 승인 필요합니다.</td></tr>
          <tr><td><code>circuit_breaker.py</code></td><td>반복 실패 차단</td><td>같은 실패를 반복하면 전략을 바꿉니다.</td></tr>
        </tbody>
      </table>

      <h2 id="how-to-teach">가르칠 때 강조할 점</h2>
      <ul>
        <li>hook은 귀찮은 제한이 아니라 팀 합의를 자동으로 확인하는 장치입니다.</li>
        <li>hook block은 실패가 아니라 대화가 필요한 신호입니다.</li>
        <li>hook을 끄는 PR은 매우 강한 근거와 ADR이 있어야 합니다.</li>
      </ul>
    `,
  },
  {
    id: "harness-skill",
    title: "11. Harness Skill",
    group: "Part 5. 운영",
    summary: "설치 후 프로젝트 로컬 harness skill로 phase를 운영합니다.",
    body: `
      <p class="eyebrow">Chapter 11</p>
      <h1>Harness Skill 사용</h1>
      <p class="lead">설치 후에는 프로젝트 안에 <code>.opencode/skills/harness/SKILL.md</code>가 생깁니다. 이 skill은 phase 설계, 승인, status 확인, run을 운영하는 데 사용합니다.</p>

      <h2 id="prompt">기본 프롬프트</h2>
      <pre><code>Use $harness to design phases for adding user profile editing.
Read AGENTS.md and docs first, then propose a small phase plan.
Do not execute until I approve the phase design.</code></pre>

      <h2 id="deep-prompt">더 좋은 프롬프트</h2>
      <pre><code>Use $harness for the feedback status filter task.
First summarize the relevant PRD scope and MVP exclusions.
Then propose phases under phases/feedback-filter/.
Each phase must include goal, inputs, instructions, done criteria, and verification.
Call out any missing docs before implementation.</code></pre>

      <h2 id="review-before-run">실행 전 리뷰 질문</h2>
      <ul>
        <li>이 phase가 PRD 범위를 넘지 않는가?</li>
        <li>Architecture 문서의 모듈 경계를 지키는가?</li>
        <li>검증 명령이 복사해서 실행 가능한가?</li>
        <li>사용자 승인 없이 실행되는 단계가 없는가?</li>
      </ul>
    `,
  },
  {
    id: "review-skill",
    title: "12. Review Skill",
    group: "Part 5. 운영",
    summary: "완료된 phase 또는 local diff를 correctness 중심으로 리뷰합니다.",
    body: `
      <p class="eyebrow">Chapter 12</p>
      <h1>Review Skill 사용</h1>
      <p class="lead"><code>.opencode/skills/review/SKILL.md</code>는 스타일 피드백보다 실제 결함을 찾는 리뷰 흐름을 강제합니다. Findings first가 기본 형식입니다.</p>

      <h2 id="inputs">리뷰 입력</h2>
      <ul>
        <li><code>AGENTS.md</code></li>
        <li><code>docs/PRD.md</code>, <code>docs/ARCHITECTURE.md</code>, <code>docs/ADR.md</code></li>
        <li>관련 phase 파일</li>
        <li><code>git status --short --branch</code>, <code>git diff --stat</code>, <code>git diff</code></li>
      </ul>

      <h2 id="finding-priority">Finding 우선순위</h2>
      <table>
        <thead><tr><th>우선순위</th><th>예시</th></tr></thead>
        <tbody>
          <tr><td>높음</td><td>데이터 손실, 보안 위험, 인증 우회, API contract 파괴</td></tr>
          <tr><td>중간</td><td>요구사항 일부 누락, 에러 상태 미처리, 테스트가 놓친 회귀</td></tr>
          <tr><td>낮음</td><td>운영 위험은 작지만 유지보수 비용을 올리는 설계 문제</td></tr>
        </tbody>
      </table>

      <h2 id="report-shape">보고 형식</h2>
      <pre><code>**Findings**
- [Important] src/feedback/filter.ts:42 Status filter drops archived items
  The PRD says archived feedback must remain visible when "All" is selected.
  Add a regression test for the All filter and keep archived records in that branch.

**Summary**
Reviewed the feedback-filter phase against PRD and Architecture.
Verification still needs npm test after the filter fix.</code></pre>
    `,
  },
  {
    id: "troubleshooting",
    title: "13. Troubleshooting",
    group: "Part 5. 운영",
    summary: "skill이 안 보이거나 runner가 막힐 때 확인할 순서를 제공합니다.",
    body: `
      <p class="eyebrow">Chapter 13</p>
      <h1>Troubleshooting</h1>
      <p class="lead">교육 현장에서 가장 자주 막히는 지점은 skill discovery, 기존 파일 merge, 승인 누락, hook block입니다. 아래 순서대로 보면 대부분 빠르게 원인을 찾을 수 있습니다.</p>
      <p><span class="badge">TROUBLESHOOTING-ORDER</span></p>

      <h2 id="skill-not-found">skill이 안 보일 때</h2>
      <ol>
        <li>경로가 <code>.opencode/skills/build-opencode-harness/SKILL.md</code>인지 확인합니다.</li>
        <li><code>SKILL.md</code> frontmatter의 <code>name</code>이 폴더명과 같은지 확인합니다.</li>
        <li>OpenCode를 프로젝트 루트에서 실행했는지 확인합니다.</li>
        <li><code>opencode.json</code>에서 skill permission이 deny인지 확인합니다.</li>
      </ol>

      <h2 id="install-incomplete">설치 결과물이 부족할 때</h2>
      <ul>
        <li><code>assets/harness-template/</code>가 함께 복사됐는지 확인합니다.</li>
        <li>기존 파일과 충돌해 agent가 merge 확인을 기다리고 있지 않은지 봅니다.</li>
        <li>템플릿 경로가 단수 <code>.opencode/skill</code>이 아니라 복수 <code>.opencode/skills</code>인지 확인합니다.</li>
      </ul>

      <h2 id="runner-blocked">runner가 BLOCKED를 낼 때</h2>
      <table>
        <thead><tr><th>메시지</th><th>원인</th><th>해결</th></tr></thead>
        <tbody>
          <tr><td>phase design is not approved</td><td>사용자 승인 기록이 없음</td><td><code>python scripts/execute.py phases/task approve</code></td></tr>
          <tr><td>dangerous command</td><td>삭제, reset 등 위험 명령 포함</td><td>명령 필요성을 설명하고 사용자 승인 후 진행</td></tr>
          <tr><td>circuit breaker</td><td>같은 실패 반복</td><td>명령 반복 대신 phase나 접근 전략 수정</td></tr>
        </tbody>
      </table>
    `,
  },
  {
    id: "practice",
    title: "14. 실습 과제",
    group: "Part 6. 적용",
    summary: "빈 프로젝트에 harness를 설치하고 작은 기능을 phase로 완료합니다.",
    body: `
      <p class="eyebrow">Chapter 14</p>
      <h1>실습 과제</h1>
      <p class="lead">실습의 목적은 멋진 앱을 만드는 것이 아니라 harness 흐름을 몸으로 익히는 것입니다. 작은 TODO 또는 피드백 목록 기능이 가장 좋습니다.</p>

      <h2 id="exercise-a">Exercise A: 빈 repo 설치</h2>
      <ol>
        <li>새 repo를 만들고 clean commit을 만듭니다.</li>
        <li><code>build-opencode-harness</code> skill을 복사합니다.</li>
        <li>OpenCode에게 harness 설치를 요청합니다.</li>
        <li>생성된 파일 tree를 확인하고 <code>python scripts/execute.py phases/_template status</code>를 실행합니다.</li>
      </ol>

      <h2 id="exercise-b">Exercise B: Project Brain 채우기</h2>
      <ol>
        <li><code>docs/PRD.md</code>에 목표, 사용자, MVP 범위, MVP 제외 범위를 씁니다.</li>
        <li><code>docs/ARCHITECTURE.md</code>에 디렉터리 구조와 test command를 씁니다.</li>
        <li><code>docs/ADR.md</code>에 초기 architecture decision과 tradeoff를 씁니다.</li>
        <li><code>AGENTS.md</code>의 Tech Stack 부분에서 TBD를 제거합니다.</li>
      </ol>

      <h2 id="exercise-c">Exercise C: Phase로 작은 기능 완료</h2>
      <ol>
        <li><code>phases/todo-list/</code>를 만듭니다.</li>
        <li>domain test phase와 UI implement phase를 분리합니다.</li>
        <li>사용자 승인 후 runner approve를 실행합니다.</li>
        <li>구현 후 review skill로 diff를 검토합니다.</li>
        <li>verify phase에서 test/build 결과를 기록합니다.</li>
      </ol>

      <h2 id="rubric">채점 기준</h2>
      <table>
        <thead><tr><th>항목</th><th>통과 기준</th></tr></thead>
        <tbody>
          <tr><td>문서</td><td>PRD, Architecture, ADR에 빈 TBD가 없고 제외 범위가 명확함</td></tr>
          <tr><td>Phase</td><td>각 phase에 goal, inputs, instructions, done criteria, verification이 있음</td></tr>
          <tr><td>검증</td><td>최소 하나의 테스트 또는 빌드 명령이 실제 실행됨</td></tr>
          <tr><td>리뷰</td><td>findings first 형식으로 결과가 기록됨</td></tr>
        </tbody>
      </table>
    `,
  },
  {
    id: "facilitator-guide",
    title: "15. 강사용 진행안",
    group: "Part 6. 적용",
    summary: "사내 교육을 진행하는 강사를 위한 시간표와 데모 순서를 제공합니다.",
    body: `
      <p class="eyebrow">Chapter 15</p>
      <h1>강사용 진행안</h1>
      <p class="lead">같은 내용을 읽는 것과 교육으로 진행하는 것은 다릅니다. 아래 runbook은 2시간 입문 세션 기준입니다.</p>
      <p><span class="badge">FACILITATOR-RUNBOOK</span></p>

      <h2 id="agenda">2시간 입문 세션</h2>
      <table>
        <thead><tr><th>시간</th><th>내용</th><th>강조점</th></tr></thead>
        <tbody>
          <tr><td>0-10분</td><td>문제 제기</td><td>agent가 추측할 때 생기는 실패 사례</td></tr>
          <tr><td>10-25분</td><td>OpenCode skills와 permissions</td><td>로컬 skill 경로와 permission.skill</td></tr>
          <tr><td>25-45분</td><td>harness 설치 데모</td><td>assets까지 복사, 기존 파일 merge</td></tr>
          <tr><td>45-70분</td><td>Project Brain 작성</td><td>MVP exclusions와 ADR tradeoff</td></tr>
          <tr><td>70-95분</td><td>phase 설계 데모</td><td>승인 전 실행 금지, done criteria</td></tr>
          <tr><td>95-115분</td><td>review와 troubleshooting</td><td>findings first, hook block 대응</td></tr>
          <tr><td>115-120분</td><td>과제 안내</td><td>팀 repo에 pilot 적용</td></tr>
        </tbody>
      </table>

      <h2 id="demo-script">데모 스크립트</h2>
      <ol>
        <li>빈 repo에서 <code>git status</code>를 보여줍니다.</li>
        <li>skill 디렉터리를 복사하고, <code>SKILL.md</code>와 <code>assets/</code>를 같이 보여줍니다.</li>
        <li>OpenCode에게 설치를 요청합니다.</li>
        <li>생성된 <code>AGENTS.md</code>에서 CRITICAL 규칙을 읽습니다.</li>
        <li><code>PRD.md</code>에 MVP exclusion을 일부러 비워두고 bootstrap이 왜 멈춰야 하는지 설명합니다.</li>
        <li>phase approve 전 run이 막히는 장면을 보여줍니다.</li>
      </ol>

      <h2 id="questions">토론 질문</h2>
      <ul>
        <li>우리 팀에서 CRITICAL로 올려야 할 보안 규칙은 무엇인가?</li>
        <li>PRD에서 agent가 자주 범위를 넓히는 지점은 어디인가?</li>
        <li>review skill이 PR 리뷰 문화와 충돌하지 않게 하려면 어떤 형식이 좋은가?</li>
      </ul>
    `,
  },
  {
    id: "team-rollout",
    title: "16. 사내 Rollout",
    group: "Part 6. 적용",
    summary: "팀 표준으로 배포할 때의 운영 규칙과 체크리스트를 정리합니다.",
    body: `
      <p class="eyebrow">Chapter 16</p>
      <h1>사내 Rollout 가이드</h1>
      <p class="lead">harness는 파일 템플릿보다 운영 습관이 더 중요합니다. 팀에 배포할 때는 어디까지 자동화하고 어디서 사람 승인을 받을지 명확히 정합니다.</p>

      <h2 id="pilot">Pilot 적용 순서</h2>
      <ol>
        <li>대표 프로젝트 하나를 고릅니다.</li>
        <li>기존 문서와 harness 문서를 merge합니다.</li>
        <li>작은 기능 하나를 phase로 완료합니다.</li>
        <li>막힌 지점과 hook block 사례를 모읍니다.</li>
        <li>팀 표준 <code>AGENTS.md</code>와 문서 템플릿을 업데이트합니다.</li>
      </ol>

      <h2 id="governance">운영 규칙</h2>
      <table>
        <thead><tr><th>영역</th><th>규칙</th></tr></thead>
        <tbody>
          <tr><td>Scope</td><td>PRD의 MVP 제외 범위를 반드시 채운 뒤 구현합니다.</td></tr>
          <tr><td>Architecture</td><td>새 패턴 도입은 ADR 업데이트와 함께만 허용합니다.</td></tr>
          <tr><td>Approval</td><td>phase 실행 전 사용자가 done criteria를 승인합니다.</td></tr>
          <tr><td>Verification</td><td>최종 보고에는 실제 실행한 명령과 결과를 적습니다.</td></tr>
          <tr><td>Review</td><td>style보다 correctness finding을 우선합니다.</td></tr>
        </tbody>
      </table>

      <h2 id="pages">문서 사이트 운영</h2>
      <p>이 사이트는 GitHub Pages로 배포됩니다. 커리큘럼을 바꾼 뒤에는 로컬 검증을 통과시키고 main에 push합니다.</p>
      <pre><code>.\\scripts\\validate-site.ps1
git add .
git commit -m "docs: expand opencode harness curriculum"
git push</code></pre>
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
