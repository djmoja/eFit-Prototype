(function(){
  // Helpers
  const $ = (s, root=document)=> root.querySelector(s);
  const $$ = (s, root=document)=> Array.from(root.querySelectorAll(s));

  // Data
  const trainingPlans = [
    {id:1, title:'HIIT - Hochintensiv', desc:'30 Minuten hochintensives Cardio & Kraft', duration:'30 min', difficulty:'Schwer'},
    {id:2, title:'Kraft - Oberkörper', desc:'Fokus auf Brust, Rücken, Schultern', duration:'45 min', difficulty:'Mittel'},
    {id:3, title:'Yoga & Flexibilität', desc:'Entspannende Dehnübungen & Balance', duration:'60 min', difficulty:'Leicht'},
    {id:4, title:'Full Body', desc:'Ganzkörpertraining für Anfänger', duration:'40 min', difficulty:'Mittel'},
    {id:5, title:'Ausdauer Lauf', desc:'Indoor Cardio Trainingsplan', duration:'35 min', difficulty:'Mittel'},
  ];

  const mealPlans = [
    {id:1, title:'Muskelaufbau', desc:'High-Protein Diät mit 2.500 cal', meals:'5 Mahlzeiten/Tag', focus:'Proteinreich'},
    {id:2, title:'Fettabbau', desc:'Kaloriendefizit mit 1.800 cal', meals:'4 Mahlzeiten/Tag', focus:'Low-Carb'},
    {id:3, title:'Ausgewogen', desc:'Klassische mediterrane Diät 2.200 cal', meals:'3 Mahlzeiten/Day', focus:'Vollwertprodukte'},
    {id:4, title:'Vegan Power', desc:'Pflanzenbasiert & vollständig 2.000 cal', meals:'5 Mahlzeiten/Day', focus:'Vegan'},
  ];

  const matchProfiles = [
    {name:'Lina', level:'Fortgeschritten', goal:'Kraftaufbau', available:'Mo/Do ab 18:00', bio:'Liebt Gewichte, sucht Partner für 3x/Woche.'},
    {name:'Jonas', level:'Einsteiger', goal:'Fettabbau', available:'Mi/Fr ab 17:00', bio:'Cardio-Fan, offen für lockeres Training.'},
    {name:'Marie', level:'Fortgeschritten', goal:'Fit bleiben', available:'Di/Do ab 19:00', bio:'Motiviert, gern Functional Training.'},
    {name:'Tim', level:'Mittel', goal:'Muskeldefinition', available:'Mo/Mi/Sa am Abend', bio:'Fokussiert auf Technik und Disziplin.'},
  ];
  let currentMatchIndex = 0;

  // Navigation
  const pages = $$('[data-page]');
  const stackNavItems = $$('.stack-nav-item');
  const stackNavToggle = $('#stackNavToggle');
  const stackNav = $('#stackNav');
  const stackNavContainer = $('#stackNavContainer');
  const activePageName = $('#activePageName');
  
  let currentPage = 'login';
  let currentUser = null;
  let navExpanded = false;
  let accessibilityEnabled = false;

  function showPage(name){
    pages.forEach(p=> p.classList.toggle('active', p.dataset.page===name));
    stackNavItems.forEach(n=> n.classList.toggle('active', n.dataset.target===name));
    currentPage = name;
    
    // Update toggle button and close nav
    const pageName = {dashboard:'Dashboard', sport:'Sport', ernährung:'Ernährung', community:'Community', profil:'Profil', login:'Login', register:'Registrieren'}[name] || name;
    activePageName.textContent = pageName;
    closeStackNav();
    localStorage.setItem('spa:page', name);
  }

  function toggleStackNav(){
    navExpanded ? closeStackNav() : openStackNav();
  }

  function openStackNav(){
    stackNav.classList.add('open');
    stackNavContainer.classList.add('expanded');
    navExpanded = true;
  }

  function closeStackNav(){
    stackNav.classList.remove('open');
    stackNavContainer.classList.remove('expanded');
    navExpanded = false;
  }

  function setAccessibilityMode(enabled){
    accessibilityEnabled = enabled;
    document.documentElement.classList.toggle('accessibility-mode', enabled);
    localStorage.setItem('spa:accessibility', enabled ? '1' : '0');
    updateAccessibilityToggle();
  }

  function toggleAccessibilityMode(){
    setAccessibilityMode(!accessibilityEnabled);
  }

  function updateAccessibilityToggle(){
    const toggle = $('#accessibilityToggle');
    if(toggle){
      toggle.textContent = accessibilityEnabled ? 'Barrierefrei: AN' : 'Barrierefrei: AUS';
      toggle.setAttribute('aria-pressed', accessibilityEnabled.toString());
    }
  }

  function navigate(page){
    showPage(page);
    window.scrollTo(0, 0);
  }
  window.navigate = navigate;

  // Login / Register
  function setLoginTab(tab){
    $$('.tab-button').forEach(btn=> btn.classList.toggle('active', btn.dataset.tab===tab));
    $$('.tab-panel').forEach(panel=> panel.classList.toggle('active', panel.dataset.panel===tab));
  }

  function showLogin(){
    showPage('login');
    setLoginTab('login');
  }

  function showRegister(){
    showPage('login');
    setLoginTab('register');
  }

  window.showLogin = showLogin;
  window.showRegister = showRegister;

  $$('.tab-button').forEach(btn=> btn.addEventListener('click', ()=> setLoginTab(btn.dataset.tab)));

  $('#loginForm')?.addEventListener('submit', e=> {
    e.preventDefault();
    const email = $('#username').value.trim();
    if(!email) return;
    currentUser = {email, name: email.split('@')[0]};
    localStorage.setItem('spa:user', JSON.stringify(currentUser));
    updateProfile();
    renderTrainingPlans();
    renderMealPlans();
    showPage('dashboard');
    drawCharts();
  });

  $('#registerForm')?.addEventListener('submit', e=> {
    e.preventDefault();
    const name = $('#regName').value.trim();
    const email = $('#regEmail').value.trim();
    const pw1 = $('#regPassword').value;
    const pw2 = $('#regPassword2').value;
    if(!name || !email || pw1!==pw2 || pw1.length<6) {alert('Fehler beim Registrieren'); return}
    currentUser = {email, name};
    localStorage.setItem('spa:user', JSON.stringify(currentUser));
    updateProfile();
    renderTrainingPlans();
    renderMealPlans();
    showPage('dashboard');
    drawCharts();
  });

  // Profile
  function updateProfile(){
    if(currentUser){
      $('#profileName').textContent = currentUser.name;
      $('#profileEmail').textContent = currentUser.email;
      const profile = JSON.parse(localStorage.getItem('spa:profile')||'{}');
      const memberId = profile.memberId || `EF-${Math.floor(100000 + Math.random()*899999)}`;
      $('#memberId').value = memberId;
      $('#fullName').value = profile.fullName || currentUser.name;
      $('#address').value = profile.address || '';
      $('#birthday').value = profile.birthday || '';
      $('#age').value = profile.age || '';
      $('#height').value = profile.height || '';
      $('#weight').value = profile.weight || '';
      $('#bmi').value = profile.bmi || '';
      $('#memberNumberDisplay').textContent = memberId;
      $('#memberNameDisplay').textContent = profile.fullName || currentUser.name;
      const stars = profile.fitnessStars || 0;
      setStarRating(stars);
      localStorage.setItem('spa:profile', JSON.stringify({...profile, memberId}));
    }
  }

  function setStarRating(value){
    $$('.star').forEach(star=> star.classList.toggle('active', Number(star.dataset.value) <= value));
    localStorage.setItem('spa:fitnessStars', value);
  }

  function loadMatchProfile(){
    const profile = matchProfiles[currentMatchIndex % matchProfiles.length];
    $('#matchProfile').innerHTML = `
      <div class="match-name">${profile.name}</div>
      <div class="match-info">${profile.level} • ${profile.goal}</div>
      <div class="match-bio">${profile.bio}</div>
      <div class="match-info">Verfügbar: ${profile.available}</div>
    `;
  }

  // Training Plans
  function renderTrainingPlans(){
    const list = $('#trainingPlansList');
    list.innerHTML = '';
    trainingPlans.forEach(plan=> {
      const div = document.createElement('div');
      div.className = 'plan-item';
      div.innerHTML = `<div class="plan-title">${plan.title}</div><div class="plan-desc">${plan.desc}</div><div class="plan-meta">${plan.duration} • ${plan.difficulty}</div>`;
      div.addEventListener('click', event=> selectPlan('training', plan, event.currentTarget));
      list.appendChild(div);
    });
  }

  // Meal Plans
  function renderMealPlans(){
    const list = $('#mealPlansList');
    list.innerHTML = '';
    mealPlans.forEach(plan=> {
      const div = document.createElement('div');
      div.className = 'plan-item';
      div.innerHTML = `<div class="plan-title">${plan.title}</div><div class="plan-desc">${plan.desc}</div><div class="plan-meta">${plan.meals} • ${plan.focus}</div>`;
      div.addEventListener('click', event=> selectPlan('meal', plan, event.currentTarget));
      list.appendChild(div);
    });
  }

  function selectPlan(type, plan, element){
    const key = `spa:selected_${type}`;
    localStorage.setItem(key, JSON.stringify(plan));
    $$('.plan-item').forEach(el=> el.classList.remove('selected'));
    element.classList.add('selected');
  }

  // Charts
  function drawCharts(){
    drawHydrationChart();
    drawUtilizationChart();
    drawTrainingChart();
  }

  function drawHydrationChart(){
    const svg = $('#hydrationChart');
    svg.innerHTML = '';
    const h = Math.random()*100|0;
    $('#hydrationValue').textContent = h + '%';
    
    const bottleHeight = 100, bottleWidth = 50;
    const fillHeight = (h/100) * bottleHeight;
    
    // Bottle outline
    svg.innerHTML = `
      <rect x="75" y="10" width="${bottleWidth}" height="${bottleHeight}" fill="none" stroke="#0b8f4a" stroke-width="2" rx="4"/>
      <rect x="75" y="${10 + bottleHeight - fillHeight}" width="${bottleWidth}" height="${fillHeight}" fill="#34b76a" opacity="0.6" rx="2"/>
      <text x="100" y="140" text-anchor="middle" font-size="16" fill="#0b8f4a">${h}%</text>
    `;
  }

  function drawUtilizationChart(){
    const svg = $('#utilizationChart');
    svg.innerHTML = '';
    const labels = ['06:00','09:00','12:00','15:00','18:00','21:00','24:00'];
    const data = [60, 75, 45, 80, 55, 90, 65].map(()=> Math.random()*100|0);
    const width = 200, height = 100, margin = 12;
    const plotHeight = height - margin * 2;
    const stepX = (width - margin * 2) / (data.length - 1);
    const points = data.map((val, i)=> ({
      x: margin + stepX * i,
      y: margin + plotHeight - (val / 100) * plotHeight,
      value: val,
      label: labels[i]
    }));
    const xmlns = 'http://www.w3.org/2000/svg';

    const baseLine = document.createElementNS(xmlns, 'line');
    baseLine.setAttribute('x1', margin);
    baseLine.setAttribute('y1', height - margin);
    baseLine.setAttribute('x2', width - margin);
    baseLine.setAttribute('y2', height - margin);
    baseLine.setAttribute('stroke', '#d8d8d8');
    baseLine.setAttribute('stroke-width', '1');
    svg.appendChild(baseLine);

    const path = document.createElementNS(xmlns, 'path');
    path.setAttribute('d', points.map((p, i)=> `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#34b76a');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);

    points.forEach(p=> {
      const circle = document.createElementNS(xmlns, 'circle');
      circle.setAttribute('cx', p.x);
      circle.setAttribute('cy', p.y);
      circle.setAttribute('r', 4);
      circle.setAttribute('fill', '#34b76a');
      circle.setAttribute('stroke', '#fff');
      circle.setAttribute('stroke-width', '2');
      svg.appendChild(circle);

      const text = document.createElementNS(xmlns, 'text');
      text.setAttribute('x', p.x);
      text.setAttribute('y', height - 2);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '9');
      text.setAttribute('fill', '#6b6b6b');
      text.textContent = p.label;
      svg.appendChild(text);
    });
  }

  function drawTrainingChart(){
    const svg = $('#trainingChart');
    svg.innerHTML = '';
    const days = ['Mo','Di','Mi','Do','Fr','Sa','So'];
    const data = [3,5,4,6,5,7,2].map(()=> Math.random()*7|0);
    const width = 200, height = 80, barW = 24, gap = 2;
    let x = 5;
    
    data.forEach((val, i)=> {
      const barH = val*10;
      svg.innerHTML += `<rect x="${x}" y="${height-barH}" width="${barW}" height="${barH}" fill="#17a05a" rx="2"/><text x="${x+barW/2}" y="${height+12}" text-anchor="middle" font-size="9" fill="#6b6b6b">${days[i]}</text>`;
      x += barW + gap;
    });
  }

  // Community
  window.postToFeed = function(){
    const text = $('#postText').value.trim();
    if(!text) return;
    const feed = $('#feedList');
    const div = document.createElement('div');
    div.className = 'feed-item';
    div.innerHTML = `<div class="feed-author">Du (${currentUser?.name || 'Anonym'})</div><div class="feed-text">${escapeHtml(text)}</div><div class="feed-time">gerade eben</div>`;
    feed.prepend(div);
    $('#postText').value = '';
  };

  window.acceptMatch = function(){
    const profile = matchProfiles[currentMatchIndex % matchProfiles.length];
    alert(`Match gefunden: ${profile.name}! Ihr seid beide für ${profile.goal} geeignet.`);
    currentMatchIndex++;
    loadMatchProfile();
  };

  window.rejectMatch = function(){
    currentMatchIndex++;
    loadMatchProfile();
  };

  // Check-in
  window.performCheckin = function(){
    const status = $('#checkinStatus');
    status.textContent = 'NFC-Verbindung wird hergestellt...';
    setTimeout(()=>{
      status.textContent = `NFC-Einchecken erfolgreich um ${new Date().toLocaleTimeString('de')} Uhr`;
    }, 1000);
  };

  // Profile Save
  $('#profileForm')?.addEventListener('submit', e=> {
    e.preventDefault();
    const profile = {
      memberId: $('#memberId').value,
      fullName: $('#fullName').value.trim(),
      address: $('#address').value.trim(),
      birthday: $('#birthday').value,
      age: $('#age').value,
      height: $('#height').value,
      weight: $('#weight').value,
      bmi: $('#bmi').value,
      fitnessStars: Number(localStorage.getItem('spa:fitnessStars') || 0),
    };
    localStorage.setItem('spa:profile', JSON.stringify(profile));
    $('#memberNumberDisplay').textContent = profile.memberId;
    $('#memberNameDisplay').textContent = profile.fullName || currentUser.name;
    updateProfile();
    alert('Profildaten gespeichert');
  });

  function calculateBmi(){
    const height = Number($('#height')?.value) || 0;
    const weight = Number($('#weight')?.value) || 0;
    if(height > 0 && weight > 0){
      const heightMeters = height > 10 ? height / 100 : height;
      const bmi = (weight / (heightMeters * heightMeters)).toFixed(1);
      $('#bmi').value = bmi;
    }
  }

  ['#height','#weight'].forEach(selector=> {
    $(selector)?.addEventListener('input', calculateBmi);
  });

  $$('.star').forEach(star=> star.addEventListener('click', ()=> {
    const value = Number(star.dataset.value);
    setStarRating(value);
  }));

  // Modal Management
  window.openAddTrainingModal = function(){
    $('#addTrainingModal').classList.add('open');
  };

  window.closeAddTrainingModal = function(){
    $('#addTrainingModal').classList.remove('open');
    $('#newTrainingTitle').value = '';
    $('#newTrainingDesc').value = '';
    $('#newTrainingDuration').value = '';
    $('#newTrainingDifficulty').value = '';
  };

  window.openAddMealModal = function(){
    $('#addMealModal').classList.add('open');
  };

  window.closeAddMealModal = function(){
    $('#addMealModal').classList.remove('open');
    $('#newMealTitle').value = '';
    $('#newMealDesc').value = '';
    $('#newMealMeals').value = '';
    $('#newMealFocus').value = '';
  };

  window.saveNewTrainingPlan = function(e){
    e.preventDefault();
    const newPlan = {
      id: trainingPlans.length + 1,
      title: $('#newTrainingTitle').value.trim(),
      desc: $('#newTrainingDesc').value.trim(),
      duration: $('#newTrainingDuration').value.trim(),
      difficulty: $('#newTrainingDifficulty').value.trim(),
      custom: true
    };
    trainingPlans.push(newPlan);
    localStorage.setItem('spa:trainingPlans', JSON.stringify(trainingPlans));
    renderTrainingPlans();
    closeAddTrainingModal();
    alert('Trainingsplan gespeichert!');
  };

  window.saveNewMealPlan = function(e){
    e.preventDefault();
    const newPlan = {
      id: mealPlans.length + 1,
      title: $('#newMealTitle').value.trim(),
      desc: $('#newMealDesc').value.trim(),
      meals: $('#newMealMeals').value.trim(),
      focus: $('#newMealFocus').value.trim(),
      custom: true
    };
    mealPlans.push(newPlan);
    localStorage.setItem('spa:mealPlans', JSON.stringify(mealPlans));
    renderMealPlans();
    closeAddMealModal();
    alert('Essensplan gespeichert!');
  };

  // Modal overlay close
  $$('.modal-overlay').forEach(overlay=> {
    overlay.addEventListener('click', e=> {
      if(e.target.id === 'addTrainingModal') closeAddTrainingModal();
      if(e.target.id === 'addMealModal') closeAddMealModal();
    });
  });

  // Logout
  window.logout = function(){
    localStorage.removeItem('spa:user');
    currentUser = null;
    showPage('login');
  };

  // Utility
  function escapeHtml(s){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

  // Init
  function init(){
    const user = localStorage.getItem('spa:user');
    const accessibilitySetting = localStorage.getItem('spa:accessibility');
    const savedTrainingPlans = localStorage.getItem('spa:trainingPlans');
    const savedMealPlans = localStorage.getItem('spa:mealPlans');
    
    // Load custom plans
    if(savedTrainingPlans){
      try {
        trainingPlans = JSON.parse(savedTrainingPlans);
      } catch(e){}
    }
    if(savedMealPlans){
      try {
        mealPlans = JSON.parse(savedMealPlans);
      } catch(e){}
    }
    
    setAccessibilityMode(accessibilitySetting === '1');
    if(user){
      currentUser = JSON.parse(user);
      updateProfile();
      renderTrainingPlans();
      renderMealPlans();
      showPage('dashboard');
      setTimeout(drawCharts, 100);
    } else {
      setLoginTab('login');
      showPage('login');
    }
    loadMatchProfile();
    
    // Stack Navigation Events
    stackNavToggle.addEventListener('click', toggleStackNav);
    stackNavItems.forEach(btn=> btn.addEventListener('click', ()=> {
      const target = btn.dataset.target;
      if(!currentUser && target!=='login' && target!=='register'){alert('Bitte melde dich an'); return}
      showPage(target);
    }));

    $('#accessibilityToggle')?.addEventListener('click', toggleAccessibilityMode);
  }

  init();
})();