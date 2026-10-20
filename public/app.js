const issues = [
  {id:'CIV-1042', initials:'RK', avatar:'teal', title:'Water has not come to our street for three days', meta:'Ward 4 · 4 min ago', category:'Water access', priority:'High', confidence:'96.2%', channel:'SMS', language:'English', status:'Routed', reason:'', quote:'Water has not come to our street for three days. Elderly residents are struggling to carry water from the next block.'},
  {id:'CIV-1041', initials:'MP', avatar:'violet', title:'La calle está inundada y no se puede pasar', meta:'Ward 2 · 8 min ago', category:'Roads & drainage', priority:'High', confidence:'88.4%', channel:'Web', language:'Spanish', status:'Needs review', reason:'Translated intake', quote:'La calle está inundada y no se puede pasar. Hay niños intentando cruzar para llegar a la escuela.'},
  {id:'CIV-1040', initials:'SK', avatar:'orange', title:'No electricity in the clinic', meta:'Ward 7 · 12 min ago', category:'Electricity', priority:'Critical', confidence:'94.1%', channel:'Voice', language:'Hindi', status:'Routed', reason:'', quote:'The community clinic has no electricity and vaccines may be at risk.'},
  {id:'CIV-1039', initials:'TA', avatar:'teal', title:'Garbage has not been collected for a week', meta:'Ward 1 · 18 min ago', category:'Sanitation', priority:'Medium', confidence:'91.8%', channel:'Social', language:'English', status:'New', reason:'', quote:'Garbage has not been collected for a week near the market.'},
  {id:'CIV-1038', initials:'JL', avatar:'violet', title:'Necesitamos ayuda médica urgente', meta:'Ward 3 · 24 min ago', category:'Health access', priority:'Critical', confidence:'61.4%', channel:'SMS', language:'Spanish', status:'Needs review', reason:'Low confidence', quote:'Necesitamos ayuda médica urgente. Mi father is having trouble breathing and the clinic is closed.'},
  {id:'CIV-1037', initials:'AN', avatar:'orange', title:'Street lights are not working near the bus stop', meta:'Ward 5 · 31 min ago', category:'Electricity', priority:'Low', confidence:'90.3%', channel:'Web', language:'English', status:'Routed', reason:'', quote:'Street lights are not working near the bus stop.'},
  {id:'CIV-1036', initials:'GM', avatar:'teal', title:'Someone is threatening people near the bus stop', meta:'Ward 5 · 36 min ago', category:'Public safety', priority:'Critical', confidence:'79.2%', channel:'Voice', language:'English', status:'Needs review', reason:'Immediate danger', quote:'Someone is threatening people near the bus stop. Please send help now.'}
];
const reviewCases = [
  {id:'CIV-1036', initials:'GM', avatar:'teal', title:'Threat reported near the bus stop', meta:'Ward 5 · 36 min ago', reason:'Possible immediate danger', time:'36m', priority:'Critical', category:'Public safety', confidence:'79.2%', language:'English', quote:'Someone is threatening people near the bus stop. Please send help now.', signals:[['Threat / danger language','+0.42'],['Voice channel transcript','+0.18'],['Location specificity','+0.11']]},
  {id:'CIV-1038', initials:'JL', avatar:'violet', title:'Urgent medical help requested', meta:'Ward 3 · 24 min ago', reason:'Low confidence · translated', time:'24m', priority:'Critical', category:'Health access', confidence:'61.4%', language:'Spanish', quote:'Necesitamos ayuda médica urgente. Mi father is having trouble breathing and the clinic is closed.', signals:[['Urgency phrase','+0.36'],['Mixed-language text','+0.21'],['Translation uncertainty','+0.12']]},
  {id:'CIV-1041', initials:'MP', avatar:'violet', title:'Flooded road blocks school route', meta:'Ward 2 · 8 min ago', reason:'Translated intake', time:'8m', priority:'High', category:'Roads & drainage', confidence:'88.4%', language:'Spanish', quote:'La calle está inundada y no se puede pasar. Hay niños intentando cruzar para llegar a la escuela.', signals:[['Flooding terms','+0.38'],['Vulnerable person cue','+0.17'],['Translation confidence','+0.09']]},
  {id:'CIV-1033', initials:'QF', avatar:'orange', title:'Issue reported in unsupported language', meta:'Ward 8 · 1h ago', reason:'Unsupported language', time:'1h', priority:'Medium', category:'Other', confidence:'42.1%', language:'Other', quote:'[Transcript unavailable for automated interpretation. Human translation required.]', signals:[['Language not supported','+0.51'],['No reliable category','+0.28'],['Manual translation required','+0.19']]}
];
const detailCases = Object.fromEntries(issues.map(x => [x.id, {...x, signals:[['Issue text and category cues','+0.34'],['Channel and language context','+0.18'],['Location metadata','+0.11']]}]));
reviewCases.forEach(x => { detailCases[x.id] = x; });

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
let activeTab = 'overview';
let activeIssueFilter = 'all';

function intakeMarkup() {
  return issues.slice(0,3).map((x, i) => `<div class="intake-item"><span class="avatar ${x.avatar}">${x.initials}</span><div class="intake-main"><strong>${x.title}</strong><small>${x.channel} · ${x.language} · ${x.meta.split('·')[0]}</small></div><div class="intake-meta"><strong class="${x.priority === 'Critical' ? 'critical-text' : ''}">${i === 0 ? 'Processing' : x.priority}</strong><small>${i === 0 ? 'translating…' : x.meta.split('·')[1]}</small></div></div>`).join('');
}
function issueTableMarkup(query='', filter='all') {
  const filtered = issues.filter(x => {
    const matchesQuery = `${x.title} ${x.category} ${x.language} ${x.channel} ${x.meta}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'high' && ['High','Critical'].includes(x.priority)) || (filter === 'review' && x.status === 'Needs review');
    return matchesQuery && matchesFilter;
  });
  return filtered.map(x => `<tr><td class="issue-cell">${x.title}<small>${x.id} · ${x.meta}</small></td><td>${x.category}</td><td><span class="priority ${x.priority.toLowerCase()}">${x.priority}</span></td><td class="confidence"><b>${x.confidence}</b></td><td>${x.channel}</td><td>${x.language}</td><td><span class="status ${x.status === 'Needs review' ? 'review' : x.status === 'New' ? 'new' : 'routed'}">${x.status}</span></td><td><button class="row-action" data-review="${x.id}" aria-label="Inspect ${x.id}">›</button></td></tr>`).join('') || `<tr><td colspan="8" style="text-align:center;color:#718296;padding:30px">No issues match your search.</td></tr>`;
}
function reviewMarkup() { return reviewCases.map((x, i) => `<div class="review-item ${i===0?'selected':''}" data-case="${x.id}"><span class="avatar ${x.avatar}">${x.initials}</span><div><strong>${x.title}</strong><small>${x.meta}</small><small class="review-reason">${x.reason}</small></div><span class="review-time">${x.time}</span></div>`).join(''); }
function detailMarkup(x) { return `<div class="detail-top"><div><p class="section-kicker">Case ${x.id}</p><h2>${x.title}</h2></div><span class="priority ${x.priority.toLowerCase()}">${x.priority}</span></div><div class="detail-body"><div class="detail-quote">“${x.quote}”</div><div class="detail-meta-grid"><div><small>Category</small><strong>${x.category}</strong></div><div><small>Confidence</small><strong style="color:var(--teal)">${x.confidence}</strong></div><div><small>Language</small><strong>${x.language}</strong></div></div><div class="signal-list"><h3>Why this was routed</h3>${x.signals.map(s=>`<div class="signal"><span>${s[0]}</span><b>${s[1]}</b></div>`).join('')}</div><div class="detail-actions"><button class="secondary-button" id="assignBtn">Assign to me</button><button class="primary-button" id="resolveBtn">Mark reviewed</button></div></div>`; }
function showTab(tab) {
  activeTab = tab; const titles={overview:'Overview',triage:'Issue triage',monitoring:'Monitoring',review:'Review queue'};
  $$('.nav-item,.tab').forEach(el=>{ const on=el.dataset.tab===tab; el.classList.toggle('active',on); if(el.classList.contains('tab')) el.setAttribute('aria-selected',String(on)); });
  $$('.tab-panel').forEach(el=>el.classList.toggle('active',el.id===`panel-${tab}`));
  $('#pageTitle').textContent=titles[tab];
  if (tab==='triage') $('#heading').textContent='Issue triage';
  else if (tab==='review') $('#heading').textContent='Review queue';
  else if (tab==='monitoring') $('#heading').textContent='Monitoring';
  else $('#heading').textContent='Good morning, Amina.';
  window.scrollTo({top:0,behavior:'smooth'});
}
function toast(title='Intake simulated', text='A new multilingual report is processing.') { $('#toast strong').textContent=title; $('#toast small').textContent=text; $('#toast').classList.add('show'); setTimeout(()=>$('#toast').classList.remove('show'),3200); }
function openReviewCase(item, element) { $$('.review-item').forEach(x=>x.classList.remove('selected')); element?.classList.add('selected'); $('#detailCard').classList.add('has-detail'); $('#detailCard').innerHTML=detailMarkup(item); $('#assignBtn').onclick=()=>toast('Case assigned','CivicAI-operator is now responsible for this case.'); $('#resolveBtn').onclick=()=>{element?.style.setProperty('opacity','.45'); toast('Review recorded','The case was marked as reviewed in this demo.');}; }
function bindReview() { $$('.review-item').forEach(el=>el.addEventListener('click',()=>openReviewCase(detailCases[el.dataset.case],el))); }

$('#intakeList').innerHTML=intakeMarkup(); $('#issueTable').innerHTML=issueTableMarkup(); $('#reviewList').innerHTML=reviewMarkup(); bindReview();
$$('[data-tab]').forEach(el=>el.addEventListener('click',()=>showTab(el.dataset.tab)));
$('#issueSearch').addEventListener('input',e=>$('#issueTable').innerHTML=issueTableMarkup(e.target.value, activeIssueFilter));
$('#issueTable').addEventListener('click',e=>{ const button=e.target.closest('[data-review]'); if(!button) return; showTab('review'); const target=$(`[data-case="${button.dataset.review}"]`); if(target) target.click(); else openReviewCase(detailCases[button.dataset.review]); });
$$('.filter-chip').forEach((button,i)=>button.addEventListener('click',()=>{ activeIssueFilter=['all','high','review'][i] || 'all'; $$('.filter-chip').forEach(x=>x.classList.remove('active')); button.classList.add('active'); $('#issueTable').innerHTML=issueTableMarkup($('#issueSearch').value, activeIssueFilter); }));
$('#dismissBanner').addEventListener('click',()=>$('.demo-banner').remove());
function simulate() { const t=$('#processingText'); t.textContent='New report received · translating from Hindi'; $('#intakeList').firstElementChild?.classList.add('new-arrival'); toast(); setTimeout(()=>{t.textContent='Simulated intake across 5 channels'},2700); }
$('#simulateBtn').addEventListener('click',simulate); $('#triageSimulate').addEventListener('click',simulate); $('#exportBtn').addEventListener('click',()=>toast('Demo export prepared','No file is downloaded in preview mode.'));
$('.select-button').addEventListener('click',()=>toast('Date range','Showing the last 7 days in demo mode.'));
$$('.icon-button').forEach(button=>button.addEventListener('click',()=>toast('Demo control','This control is available in the full operations workspace.')));
$$('.outline-button').forEach(button=>{ if(button.id!=='exportBtn') button.addEventListener('click',()=>toast('Filters ready','Use the priority chips to narrow the triage list.')); });
$('.user-chip').addEventListener('click',()=>toast('Profile','Signed in as Amina M. · Admin')); 
$('.mobile-menu').addEventListener('click',()=>{ const open=$('.sidebar').classList.toggle('open'); $('.mobile-menu').setAttribute('aria-expanded',String(open)); });
