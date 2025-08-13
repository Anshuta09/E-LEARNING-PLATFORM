/* ========= LearnIt Frontend =========
   Fixes included:
   - Aligned titles (no default blue underline)
   - Tags cluster left, price pinned right
   - Equal-height course cards; actions align bottom
   - Footer no longer overlaps content
   Features:
   - Catalog + search & filters
   - Course detail w/ YouTube embed
   - Progress & notes in localStorage
   - Dashboard overview
   - Theme toggle (persisted)
===================================== */

const EL = (sel, root=document) => root.querySelector(sel);
const ELS = (sel, root=document) => [...root.querySelectorAll(sel)];
const $year = () => { const y = new Date().getFullYear(); ELS('#year').forEach(n=>n.textContent=y); }; $year();

const STORAGE_KEYS = {
  ENROLLED: 'learnit_enrolled',
  PROGRESS: 'learnit_progress',
  NOTES:    'learnit_notes',
  THEME:    'learnit_theme',
};

/* ---------- Courses (added 2 new) ---------- */
const COURSES = [
  {
    id: 'js-foundations',
    title: 'JavaScript Foundations',
    category: 'Programming',
    level: 'Beginner',
    length: '4h 30m',
    lessons: [
      { id:'l1', title:'Intro to JS & Setup', duration:'10:21', yt:'W6NZfCO5SIk' },
      { id:'l2', title:'Variables & Types', duration:'12:05', yt:'XgSjoHgy3Rk' },
      { id:'l3', title:'Functions & Scope', duration:'14:10', yt:'8dWL3wF_OMw' },
      { id:'l4', title:'Arrays & Objects', duration:'15:45', yt:'bCqtb-Z5YGQ' },
      { id:'l5', title:'DOM Basics', duration:'13:11', yt:'0ik6X4DJKCc' },
    ],
    description: 'Master the fundamentals of JavaScript with hands-on examples and mini projects that build confidence.',
    price: 'Free',
    thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'ui-design-essentials',
    title: 'UI Design Essentials',
    category: 'Design',
    level: 'Intermediate',
    length: '3h 10m',
    lessons: [
      { id:'l1', title:'Design Principles 101', duration:'11:06', yt:'snrGZb6xCic' },
      { id:'l2', title:'Color & Typography', duration:'09:55', yt:'Qj1FK8n7WgY' },
      { id:'l3', title:'Layout & Spacing', duration:'12:34', yt:'kEf1xSwX5D8' },
      { id:'l4', title:'Components & Patterns', duration:'10:45', yt:'zQefx5s3C9g' },
    ],
    description: 'Learn practical UI design techniques to ship beautiful, usable interfaces quickly.',
    price: '$29',
    thumb: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'python-data',
    title: 'Python for Data Analysis',
    category: 'Data',
    level: 'Beginner',
    length: '5h 20m',
    lessons: [
      { id:'l1', title:'Python Basics', duration:'13:22', yt:'rfscVS0vtbw' },
      { id:'l2', title:'Pandas Intro', duration:'16:01', yt:'vmEHCJofslg' },
      { id:'l3', title:'Cleaning Data', duration:'10:51', yt:'0s_1IsROgDc' },
      { id:'l4', title:'Visualization', duration:'14:30', yt:'yD3jYlS8FxE' },
      { id:'l5', title:'Mini Project', duration:'09:44', yt:'LHBE6Q9XlzI' },
    ],
    description: 'Analyze, clean, and visualize data with Python and Pandas, with real-world datasets.',
    price: '$39',
    thumb: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop'
  },
  /* NEW #1 */
  {
    id: 'react-projects',
    title: 'React & Frontend Projects',
    category: 'Programming',
    level: 'Intermediate',
    length: '6h 00m',
    lessons: [
      { id:'l1', title:'React Basics & JSX', duration:'12:48', yt:'bMknfKXIFA8' },
      { id:'l2', title:'State & Props', duration:'14:33', yt:'O6P86uwfdR0' },
      { id:'l3', title:'Hooks in Depth', duration:'16:40', yt:'dpw9EHDh2bM' },
      { id:'l4', title:'Routing & API Calls', duration:'15:10', yt:'Law7wfdg_ls' },
      { id:'l5', title:'Deploying Your App', duration:'09:55', yt:'8aGhZQkoFbQ' },
    ],
    description: 'Build real-world React apps from scratch and learn patterns for scalable frontends.',
    price: '$49',
    thumb: 'https://images.unsplash.com/photo-1555066931-6b0c06b1e6e6?q=80&w=1600&auto=format&fit=crop'
  },
  /* NEW #2 */
  {
    id: 'cybersecurity-fundamentals',
    title: 'Cybersecurity Fundamentals',
    category: 'Security',
    level: 'Beginner',
    length: '3h 45m',
    lessons: [
      { id:'l1', title:'Security Landscape', duration:'10:12', yt:'inWWhr5tnEA' },
      { id:'l2', title:'Threats & Vulnerabilities', duration:'11:40', yt:'9t5d7Gf2H6M' },
      { id:'l3', title:'Network Security Basics', duration:'12:55', yt:'3QhU9O6o1zY' },
      { id:'l4', title:'Best Practices & Hardening', duration:'09:48', yt:'wXn3L6Qw7y0' },
    ],
    description: 'Understand core security concepts, common attack vectors, and practical protection strategies.',
    price: 'Free',
    thumb: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1600&auto=format&fit=crop'
  }
];

/* ---------- Utilities ---------- */
const getJSON = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const setJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const pct = (num, den) => den ? Math.round((num/den)*100) : 0;

/* ---------- Theme ---------- */
function applySavedTheme(){
  const saved = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  if(saved === 'light'){ document.documentElement.classList.add('light'); }
}
function toggleTheme(){
  document.documentElement.classList.toggle('light');
  localStorage.setItem(STORAGE_KEYS.THEME, document.documentElement.classList.contains('light')?'light':'dark');
}
applySavedTheme();
document.addEventListener('click', (e)=>{
  if(e.target.id === 'themeToggle'){ toggleTheme(); }
});

/* ---------- Page bootstraps ---------- */
const PAGE = document.documentElement.dataset.page;

/* ===== Catalog (index.html) ===== */
if(PAGE === 'catalog'){
  const courseGrid = EL('#courseGrid');
  const searchInput = EL('#searchInput');
  const categoryFilter = EL('#categoryFilter');
  const levelFilter = EL('#levelFilter');

  // Populate category filter dynamically
  const cats = ['all', ...new Set(COURSES.map(c=>c.category))];
  categoryFilter.innerHTML = cats.map(c=>`<option value="${c}">${c[0].toUpperCase()+c.slice(1)}</option>`).join('');

  function render(){
    const q = (searchInput.value || '').toLowerCase().trim();
    const cat = categoryFilter.value;
    const lvl = levelFilter.value;

    const results = COURSES.filter(c=>{
      const txt = (c.title + ' ' + c.category + ' ' + c.level).toLowerCase();
      const matchesQ = !q || txt.includes(q);
      const matchesC = cat === 'all' || c.category === cat;
      const matchesL = lvl === 'all' || c.level === lvl;
      return matchesQ && matchesC && matchesL;
    });

    courseGrid.innerHTML = results.map(renderCourseCard).join('');
    EL('#emptyState').classList.toggle('hidden', results.length>0);
    attachEnrollHandlers();
    hydrateProgressBadges();
  }

  function renderCourseCard(c){
    const enrolled = getJSON(STORAGE_KEYS.ENROLLED, []).includes(c.id);
    return `
      <article class="card course-card" data-id="${c.id}">
        <a href="course.html?id=${c.id}" class="course-thumb" aria-label="${c.title}">
          <img alt="" src="${c.thumb}">
        </a>
        <h3><a href="course.html?id=${c.id}" class="link">${c.title}</a></h3>

        <div class="course-meta">
          <div class="tags">
            <span class="tag">${c.category}</span>
            <span class="tag">${c.level}</span>
            <span class="tag">${c.length}</span>
          </div>
          <div class="price">${c.price}</div>
        </div>

        <p class="course-desc">${c.description}</p>

        <div class="spacer"></div>

        <div class="row">
          <a class="btn" href="course.html?id=${c.id}">View</a>
          <button class="btn ghost enroll-btn" data-id="${c.id}">
            ${enrolled ? 'Enrolled ✓' : 'Enroll'}
          </button>
          <span class="muted" data-progress="${c.id}" aria-live="polite"></span>
        </div>
      </article>
    `;
  }

  function attachEnrollHandlers(){
    ELS('.enroll-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.dataset.id;
        const list = new Set(getJSON(STORAGE_KEYS.ENROLLED, []));
        if(list.has(id)){ list.delete(id); btn.textContent='Enroll'; }
        else { list.add(id); btn.textContent='Enrolled ✓'; }
        setJSON(STORAGE_KEYS.ENROLLED, [...list]);
        hydrateProgressBadges();
      });
    });
  }

  function hydrateProgressBadges(){
    const progress = getJSON(STORAGE_KEYS.PROGRESS, {});
    COURSES.forEach(c=>{
      const p = progress[c.id]?.completed?.length || 0;
      const total = c.lessons.length;
      const percent = pct(p,total);
      const node = EL(`[data-progress="${c.id}"]`);
      if(node) node.textContent = total ? `${percent}% complete` : '';
    });
  }

  [searchInput, categoryFilter, levelFilter].forEach(el=>el.addEventListener('input', render));
  EL('#clearFilters').addEventListener('click', ()=>{
    searchInput.value=''; categoryFilter.value='all'; levelFilter.value='all'; render();
  });

  render();
}

/* ===== Course Detail (course.html) ===== */
if(PAGE === 'course'){
  const params = new URLSearchParams(location.search);
  const courseId = params.get('id');
  const course = COURSES.find(c=>c.id===courseId);

  const progress = getJSON(STORAGE_KEYS.PROGRESS, {});
  if(!progress[courseId]) progress[courseId] = { completed: [] };
  setJSON(STORAGE_KEYS.PROGRESS, progress);

  const enrolledSet = new Set(getJSON(STORAGE_KEYS.ENROLLED, []));
  const isEnrolled = enrolledSet.has(courseId);

  const titleEl = EL('#courseTitle');
  const metaEl = EL('#courseMeta');
  const descEl = EL('#courseDesc');
  const listEl = EL('#lessonList');
  const bar = EL('#courseProgressBar');
  const text = EL('#courseProgressText');
  const enrollBtn = EL('#enrollBtn');
  const notesArea = EL('#notesArea');

  EL('#backBtn').addEventListener('click', ()=>history.back());

  function updateProgressUI(){
    const done = new Set(getJSON(STORAGE_KEYS.PROGRESS, {})[courseId].completed);
    const total = course.lessons.length;
    const percent = pct(done.size, total);
    bar.style.width = percent + '%';
    text.textContent = `${percent}% complete (${done.size}/${total})`;
  }

  function mountVideo(ytId){
    EL('#videoWrap').innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${ytId}"
        title="Course video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>`;
  }

  function toggleComplete(lessonId, li){
    const state = getJSON(STORAGE_KEYS.PROGRESS, {});
    const arr = new Set(state[courseId].completed);
    if(arr.has(lessonId)){
      arr.delete(lessonId);
      li.classList.remove('done');
      li.querySelector('.complete-btn').textContent = 'Mark complete';
      li.querySelector('.checkbox').checked = false;
    } else {
      arr.add(lessonId);
      li.classList.add('done');
      li.querySelector('.complete-btn').textContent = 'Completed ✓';
      li.querySelector('.checkbox').checked = true;
    }
    state[courseId].completed = [...arr];
    setJSON(STORAGE_KEYS.PROGRESS, state);
    updateProgressUI();
  }

  function saveCurrentLesson(lessonId){
    const state = getJSON(STORAGE_KEYS.PROGRESS, {});
    state[courseId].current = lessonId;
    setJSON(STORAGE_KEYS.PROGRESS, state);
  }

  function renderCourse(){
    if(!course){
      titleEl.textContent = 'Course not found';
      metaEl.textContent = '';
      return;
    }
    titleEl.textContent = course.title;
    metaEl.textContent = `${course.category} • ${course.level} • ${course.length}`;
    descEl.textContent = course.description;

    const state = getJSON(STORAGE_KEYS.PROGRESS, {})[courseId];
    const currentLessonId = state.current || course.lessons[0].id;
    const currentLesson = course.lessons.find(l=>l.id===currentLessonId) || course.lessons[0];
    mountVideo(currentLesson.yt);

    listEl.innerHTML = course.lessons.map(l=>{
      const done = progress[courseId].completed.includes(l.id);
      return `
        <li class="lesson ${done?'done':''}" id="lesson-${l.id}" data-lesson="${l.id}">
          <input class="checkbox" type="checkbox" ${done?'checked':''} aria-label="Mark ${l.title} complete">
          <div>
            <div class="title">${l.title}</div>
            <div class="meta">Duration • ${l.duration}</div>
          </div>
          <div class="actions">
            <button class="btn ghost play-btn">Play</button>
            <button class="btn complete-btn">${done?'Completed ✓':'Mark complete'}</button>
          </div>
        </li>
      `;
    }).join('');

    listEl.addEventListener('click', (e)=>{
      const li = e.target.closest('.lesson');
      if(!li) return;
      const lid = li.dataset.lesson;

      if(e.target.classList.contains('play-btn')){
        const lesson = course.lessons.find(x=>x.id===lid);
        saveCurrentLesson(lid);
        mountVideo(lesson.yt);
        location.hash = `lesson-${lid}`;
        return;
      }
      if(e.target.classList.contains('complete-btn') || e.target.classList.contains('checkbox')){
        toggleComplete(lid, li);
        return;
      }
    });

    enrollBtn.textContent = isEnrolled ? 'Enrolled ✓' : 'Enroll';
    enrollBtn.addEventListener('click', ()=>{
      const set = new Set(getJSON(STORAGE_KEYS.ENROLLED, []));
      if(set.has(courseId)){ set.delete(courseId); enrollBtn.textContent='Enroll'; }
      else { set.add(courseId); enrollBtn.textContent='Enrolled ✓'; }
      setJSON(STORAGE_KEYS.ENROLLED, [...set]);
    });

    // Notes load/save
    const notes = getJSON(STORAGE_KEYS.NOTES, {})[courseId] || '';
    notesArea.value = notes;
    notesArea.addEventListener('input', ()=>{
      const all = getJSON(STORAGE_KEYS.NOTES, {});
      all[courseId] = notesArea.value;
      setJSON(STORAGE_KEYS.NOTES, all);
    });
    EL('#exportNotes').addEventListener('click', ()=>{
      const blob = new Blob([notesArea.value], {type:'text/plain'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${course.title.replace(/\s+/g,'_')}_notes.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
    });

    updateProgressUI();

    // If opened with #lesson-... jump to it
    if(location.hash){
      const node = EL(location.hash);
      if(node) node.scrollIntoView({behavior:'smooth', block:'center'});
    }
  }

  renderCourse();
}

/* ===== Dashboard (dashboard.html) ===== */
if(PAGE === 'dashboard'){
  const grid = EL('#dashboardGrid');
  const stats = EL('#statsGrid');

  function render(){
    const enrolled = new Set(getJSON(STORAGE_KEYS.ENROLLED, []));
    const progress = getJSON(STORAGE_KEYS.PROGRESS, {});
    const enrolledCourses = COURSES.filter(c=>enrolled.has(c.id));

    if(enrolledCourses.length === 0){
      grid.innerHTML = `
        <div class="card empty">
          <h3>No courses yet</h3>
          <p class="muted">Browse the catalog and enroll to start learning.</p>
          <p><a class="btn" href="index.html">Go to Courses</a></p>
        </div>`;
    } else {
      grid.innerHTML = enrolledCourses.map(c=>{
        const done = new Set(progress[c.id]?.completed||[]).size;
        const total = c.lessons.length;
        const percent = pct(done,total);
        const current = progress[c.id]?.current || c.lessons[0].id;
        return `
          <article class="card">
            <div class="row">
              <img src="${c.thumb}" alt="" style="width:64px;height:64px;border-radius:10px;border:1px solid var(--line);object-fit:cover">
              <div>
                <h3 style="margin:0 0 4px">${c.title}</h3>
                <div class="muted">${c.category} • ${c.level} • ${c.length}</div>
              </div>
              <div class="row" style="margin-left:auto">
                <a class="btn" href="course.html?id=${c.id}#lesson-${current}">Resume</a>
                <button class="btn ghost" data-unenroll="${c.id}">Unenroll</button>
              </div>
            </div>
            <div class="progress-wrap">
              <div class="progress"><div class="progress-bar" style="width:${percent}%"></div></div>
              <div class="progress-legend">
                <span>${percent}% complete (${done}/${total})</span>
                <a class="muted" href="course.html?id=${c.id}#lesson-${current}">Continue where you left off →</a>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }

    // Stats
    const totalLessons = COURSES.reduce((a,c)=>a+c.lessons.length,0);
    const completed = Object.values(progress).reduce((sum, p)=> sum + (p.completed?.length||0), 0);
    const overallPct = pct(completed, totalLessons);

    stats.innerHTML = `
      <div class="stat"><h4>Total Courses</h4><div class="big">${COURSES.length}</div></div>
      <div class="stat"><h4>Enrolled</h4><div class="big">${enrolledCourses.length}</div></div>
      <div class="stat"><h4>Lessons Completed</h4><div class="big">${completed}</div></div>
      <div class="stat"><h4>Overall Completion</h4><div class="big">${overallPct}%</div></div>
    `;

    // Unenroll actions
    grid.addEventListener('click', (e)=>{
      const id = e.target.getAttribute('data-unenroll');
      if(!id) return;
      const set = new Set(getJSON(STORAGE_KEYS.ENROLLED, []));
      set.delete(id);
      setJSON(STORAGE_KEYS.ENROLLED, [...set]);
      render();
    });
  }

  render();
}
