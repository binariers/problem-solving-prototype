'use strict';

// Vanilla, zero-dependency lesson player. State lives in one object; render() redraws
// the DOM from it. Progress is persisted in localStorage only (no .progress file).

const PROGRESS_KEY = 'quests.progress';
const root = document.getElementById('app');

/* ---------------- Progress (localStorage only) ---------------- */

function loadProgress() {
  try {
    const data = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '');
    if (data && typeof data === 'object' && data.completedLessons && typeof data.completedLessons === 'object') {
      return data;
    }
  } catch (_) { /* missing or invalid -> empty */ }
  return { completedLessons: {} };
}

function saveProgress(p) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); }

function completedIds(unitId) {
  return new Set(loadProgress().completedLessons[unitId] || []);
}

function markComplete(unitId, lessonId) {
  const p = loadProgress();
  const arr = p.completedLessons[unitId] || (p.completedLessons[unitId] = []);
  if (!arr.includes(lessonId)) arr.push(lessonId);
  saveProgress(p);
}

function unitComplete(unitId, unitData) {
  const done = completedIds(unitId);
  return unitData.lessons.length > 0 && unitData.lessons.every(l => done.has(l.id));
}

/* ---------------- App state ---------------- */

const state = {
  screen: 'home',        // 'home' | 'unit' | 'lesson'
  sections: null,
  unitCache: {},         // unitId -> unit.json
  unitMeta: null,        // manifest entry for the open unit
  unitData: null,        // unit.json for the open unit
  lessonIndex: 0,
  lesson: null,          // lesson.json for the open lesson
  // interaction working state
  selected: null,        // single-choice: option id
  multi: [],             // multi-choice: selection order (most recent last)
  order: [],             // order-steps: current id order
  activeStepVisual: null,// order-steps: last tapped step's visual
  showFeedback: false,
  wasCorrect: false,
};

/* ---------------- Tiny DOM helper ---------------- */

function el(tag, props, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else if (v === true) n.setAttribute(k, '');
    else if (v !== false && v != null) n.setAttribute(k, v);
  }
  for (const c of children) if (c != null && c !== false) n.append(c);
  return n;
}

function humanize(id) { return id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }

/* ---------------- Navigation ---------------- */

async function goHome() {
  if (!state.sections) {
    state.sections = (await (await fetch('content/index.json')).json()).sections;
  }
  for (const sec of state.sections) {
    for (const u of sec.units) {
      if (u.available && !state.unitCache[u.id]) {
        state.unitCache[u.id] = await (await fetch(`content/${u.path}/unit.json`)).json();
      }
    }
  }
  state.screen = 'home';
  render();
}

async function openUnit(meta) {
  state.unitMeta = meta;
  state.unitData = state.unitCache[meta.id] ||
    (state.unitCache[meta.id] = await (await fetch(`content/${meta.path}/unit.json`)).json());
  state.screen = 'unit';
  render();
}

async function openLesson(index) {
  const l = state.unitData.lessons[index];
  state.lessonIndex = index;
  state.lesson = await (await fetch(`content/${state.unitMeta.path}/${l.path}/lesson.json`)).json();
  resetInteraction();
  state.screen = 'lesson';
  render();
}

function resetInteraction() {
  state.selected = null;
  state.multi = [];
  state.activeStepVisual = null;
  state.showFeedback = false;
  state.wasCorrect = false;
  if (state.lesson.type === 'order-steps') {
    state.order = scramble(state.lesson.steps.map(s => s.id), state.lesson.answer);
  }
}

function scramble(ids, answer) {
  const reversed = ids.slice().reverse();
  if (reversed.join() !== answer.join()) return reversed;
  return ids.slice(1).concat(ids[0]); // reverse equalled the answer; rotate instead
}

/* ---------------- Visuals ---------------- */

function currentVisualFile() {
  const L = state.lesson;
  if (L.type === 'single-choice' && state.selected) {
    const o = L.options.find(o => o.id === state.selected);
    if (o && o.visual) return o.visual;
  } else if (L.type === 'multi-choice') {
    for (let i = state.multi.length - 1; i >= 0; i--) {
      const o = L.options.find(o => o.id === state.multi[i]);
      if (o && o.visual) return o.visual;
    }
  } else if (L.type === 'order-steps' && state.activeStepVisual) {
    return state.activeStepVisual;
  }
  return L.visual || null;
}

function vizFrame() {
  const file = currentVisualFile();
  if (!file) return el('div', { class: 'viz hidden' });
  const base = `content/${state.unitMeta.path}/${state.unitData.lessons[state.lessonIndex].path}`;
  return el('iframe', { class: 'viz', sandbox: 'allow-scripts', title: 'Supportive visual', src: `${base}/${file}` });
}

/* ---------------- Grading ---------------- */

function canCheck() {
  const L = state.lesson;
  if (L.type === 'single-choice') return state.selected != null;
  if (L.type === 'multi-choice') return state.multi.length >= 1;
  if (L.type === 'order-steps') return true; // every step is always placed
  return false;
}

function check() {
  const L = state.lesson;
  let correct = false;
  if (L.type === 'single-choice') {
    const o = L.options.find(o => o.id === state.selected);
    correct = !!(o && o.correct);
  } else if (L.type === 'multi-choice') {
    const sel = new Set(state.multi);
    correct = L.options.every(o => !!o.correct === sel.has(o.id));
  } else if (L.type === 'order-steps') {
    correct = state.order.join() === L.answer.join();
  }
  state.showFeedback = true;
  state.wasCorrect = correct;
  render();
}

function completeAndAdvance() {
  const lessons = state.unitData.lessons;
  markComplete(state.unitMeta.id, lessons[state.lessonIndex].id);
  if (state.lessonIndex + 1 < lessons.length) openLesson(state.lessonIndex + 1);
  else openUnit(state.unitMeta);
}

/* ---------------- Rendering ---------------- */

function render() {
  root.replaceChildren(
    state.screen === 'home' ? renderHome()
      : state.screen === 'unit' ? renderUnit()
        : renderLesson()
  );
}

function topbar(title, sub, onBack) {
  return el('div', { class: 'topbar' },
    onBack ? el('button', { class: 'iconbtn', onclick: onBack, text: '\u2190' }) : null,
    el('h1', { text: title }),
    sub ? el('span', { class: 'sub', text: sub }) : null
  );
}

function renderHome() {
  const resetBtn = el('button', {
    class: 'iconbtn',
    onclick: () => {
      if (confirm('Reset all progress?')) { localStorage.removeItem(PROGRESS_KEY); render(); }
    },
    text: 'Reset',
  });
  const bar = el('div', { class: 'topbar' }, el('h1', { text: 'Problem-Solving' }), resetBtn);
  const content = el('div', { class: 'content' });

  for (const sec of state.sections) {
    const group = el('div', { class: 'section' }, el('h2', { text: sec.title }));
    let prevComplete = true; // the first unit in a section starts unlocked
    for (const u of sec.units) {
      const data = state.unitCache[u.id];
      const complete = u.available && data ? unitComplete(u.id, data) : false;
      const unlocked = u.available && prevComplete;

      let cls = 'unit-node', badge = '\uD83D\uDD12', sub = 'Coming soon';
      if (u.available && data) {
        const total = data.lessons.length;
        const done = completedIds(u.id).size;
        sub = `${done}/${total} lessons`;
      }
      if (complete) { cls += ' done'; badge = '\u2713'; }
      else if (unlocked) { cls += ' unlocked'; badge = '\u2605'; }

      const node = el('button', {
        class: cls,
        disabled: !(unlocked || complete),
        onclick: (unlocked || complete) ? () => openUnit(u) : undefined,
      },
        el('div', { class: 'badge', text: badge }),
        el('div', { class: 'meta' }, el('div', { text: u.title }), el('small', { text: sub }))
      );
      group.append(node);
      prevComplete = complete;
    }
    content.append(group);
  }
  return el('div', {}, bar, content);
}

function renderUnit() {
  const bar = topbar(state.unitMeta.title, null, goHome);
  const content = el('div', { class: 'content' });
  const done = completedIds(state.unitMeta.id);

  // Group consecutive lessons by stage, preserving unit order.
  const groups = [];
  for (const l of state.unitData.lessons) {
    let g = groups[groups.length - 1];
    if (!g || g.stage !== l.stage) { g = { stage: l.stage, lessons: [] }; groups.push(g); }
    g.lessons.push(l);
  }

  for (const g of groups) {
    const box = el('div', { class: 'stage-group' }, el('h3', { text: g.stage }));
    for (const l of g.lessons) {
      const isDone = done.has(l.id);
      box.append(el('div', { class: 'lesson-row' + (isDone ? ' done' : '') },
        el('div', { class: 'tick', text: isDone ? '\u2713' : '' }),
        el('div', { class: 'name', text: humanize(l.id) })
      ));
    }
    content.append(box);
  }

  const firstIncomplete = state.unitData.lessons.findIndex(l => !done.has(l.id));
  const startIndex = firstIncomplete === -1 ? 0 : firstIncomplete;
  const label = firstIncomplete === -1 ? 'Review from start' : (done.size ? 'Continue' : 'Start');
  const footer = el('div', { class: 'footer' },
    el('button', { class: 'primary', onclick: () => openLesson(startIndex), text: label })
  );

  return el('div', {}, bar, content, footer);
}

function renderLesson() {
  const L = state.lesson;
  const lessonMeta = state.unitData.lessons[state.lessonIndex];
  const bar = topbar(state.unitMeta.title, lessonMeta.stage, () => openUnit(state.unitMeta));
  const content = el('div', { class: 'content' });

  const total = state.unitData.lessons.length;
  const fill = Math.round((state.lessonIndex / total) * 100);
  content.append(el('div', { class: 'progress-strip' }, el('div', { style: `width:${fill}%` })));
  content.append(vizFrame());

  if (L.type === 'info') content.append(renderInfo(L));
  else if (L.type === 'single-choice') content.append(renderChoice(L, false));
  else if (L.type === 'multi-choice') content.append(renderChoice(L, true));
  else if (L.type === 'order-steps') content.append(renderOrder(L));

  return el('div', {}, bar, content, renderFooter(L));
}

function renderInfo(L) {
  return el('div', {},
    el('div', { class: 'info-title', text: L.title }),
    el('div', { class: 'info-body', text: L.body })
  );
}

function renderChoice(L, multi) {
  const wrap = el('div', {}, el('p', { class: 'prompt', text: L.prompt }));
  const locked = state.wasCorrect;
  for (const o of L.options) {
    const selected = multi ? state.multi.includes(o.id) : state.selected === o.id;
    wrap.append(el('button', {
      class: 'option' + (multi ? '' : ' round') + (selected ? ' selected' : ''),
      disabled: locked,
      onclick: () => selectOption(o.id, multi),
    },
      el('div', { class: 'mark' }),
      el('div', { text: o.text })
    ));
  }
  return wrap;
}

function selectOption(id, multi) {
  if (state.wasCorrect) return;
  if (multi) {
    const i = state.multi.indexOf(id);
    if (i >= 0) state.multi.splice(i, 1); else state.multi.push(id);
  } else {
    state.selected = id;
  }
  state.showFeedback = false; // adjusting the answer clears prior feedback
  render();
}

function renderOrder(L) {
  const wrap = el('div', {}, el('p', { class: 'prompt', text: L.prompt }));
  const byId = Object.fromEntries(L.steps.map(s => [s.id, s]));
  const locked = state.wasCorrect;
  state.order.forEach((id, i) => {
    const step = byId[id];
    const up = el('button', { text: '\u25B2', disabled: locked || i === 0, onclick: () => moveStep(i, -1) });
    const down = el('button', { text: '\u25BC', disabled: locked || i === state.order.length - 1, onclick: () => moveStep(i, 1) });
    wrap.append(el('div', {
      class: 'step' + (step.visual ? ' has-viz' : ''),
      onclick: () => tapStep(step),
    },
      el('div', { class: 'pos', text: String(i + 1) }),
      el('div', { class: 'txt', text: step.text }),
      el('div', { class: 'movers' }, up, down)
    ));
  });
  return wrap;
}

function moveStep(i, dir) {
  if (state.wasCorrect) return;
  const j = i + dir;
  if (j < 0 || j >= state.order.length) return;
  const o = state.order;
  [o[i], o[j]] = [o[j], o[i]];
  state.showFeedback = false;
  render();
}

function tapStep(step) {
  if (step.visual) { state.activeStepVisual = step.visual; render(); }
}

function renderFooter(L) {
  const footer = el('div', { class: 'footer' });

  if (state.showFeedback) {
    if (state.wasCorrect) {
      footer.append(el('div', { class: 'feedback correct' },
        el('div', { text: 'Correct!' }),
        L.explanation ? el('div', { class: 'exp', text: L.explanation }) : null
      ));
    } else {
      footer.append(el('div', { class: 'feedback incorrect' }, el('div', { text: 'Not quite \u2014 try again' })));
    }
  }

  if (L.type === 'info') {
    footer.append(el('button', { class: 'primary', text: 'Continue', onclick: completeAndAdvance }));
  } else if (state.wasCorrect) {
    footer.append(el('button', { class: 'primary', text: 'Continue', onclick: completeAndAdvance }));
  } else {
    footer.append(el('button', { class: 'primary', text: 'Check', disabled: !canCheck(), onclick: check }));
  }
  return footer;
}

/* ---------------- Boot ---------------- */

goHome();
