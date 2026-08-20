const START=new Date(2026,7,19),KEY='365-project-v1';
let s=JSON.parse(localStorage.getItem(KEY)||'{"manual":null,"done":{"poetry":[],"essay":[],"art":[]},"notes":{}}');
const $=id=>document.getElementById(id); const save=()=>localStorage.setItem(KEY,JSON.stringify(s));
function day(){if(s.manual)return s.manual;let n=new Date(),t=new Date(n.getFullYear(),n.getMonth(),n.getDate());return Math.max(1,Math.min(365,Math.floor((t-START)/86400000)+1))}
function item(type,n){return PROJECT_DATA[type][n-1]}
function completed(type,n){return s.done[type].includes(n)}
function toggle(type,n){s.done[type]=completed(type,n)?s.done[type].filter(x=>x!==n):[...s.done[type],n];save();render()}
function openLink(type,n){
  const x=item(type,n);
  if(x.url) location.href=x.url;
  else if(type==='art') alert('The museum/source link is the next connection step for this artwork.');
  else alert('The curated entry is ready; its direct reading link is the next editorial connection step.');
}
function render(){
  const n=day(),p=item('poetry',n),e=item('essay',n),a=item('art',n);
  $('dateLabel').textContent=new Date(2026,7,19+n-1).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  $('dayNumber').textContent='Day '+n;
  $('theme').textContent=p.theme;
  $('poetryTitle').textContent=p.title;$('poetryCreator').textContent=p.creator;$('poetryFocus').textContent=p.focus;
  $('essayTitle').textContent=e.title;$('essayCreator').textContent=e.creator;$('essayFocus').textContent=e.focus;
  $('artTitle').textContent=a.title;$('artCreator').textContent=a.creator;$('artFocus').textContent='Look for: '+a.focus+'.';
  $('poetryDone').textContent=completed('poetry',n)?'Poem completed ✓':'Mark poem complete';
  $('essayDone').textContent=completed('essay',n)?'Essay completed ✓':'Mark essay complete';
  $('artDone').textContent=completed('art',n)?'Artwork explored ✓':'Mark artwork complete';
  $('poetryDone').onclick=()=>toggle('poetry',n);$('essayDone').onclick=()=>toggle('essay',n);$('artDone').onclick=()=>toggle('art',n);
  $('poetryRead').onclick=()=>openLink('poetry',n);$('essayRead').onclick=()=>openLink('essay',n);$('artSource').onclick=()=>openLink('art',n);
  $('note').value=s.notes[n]||'';
  $('saveNote').onclick=()=>{s.notes[n]=$('note').value;save();$('saveNote').textContent='Saved ✓';setTimeout(()=>$('saveNote').textContent='Save reflection',900)};
  const total=s.done.poetry.length+s.done.essay.length+s.done.art.length, pct=Math.round(total/(365*3)*100);
  $('progress').textContent=pct+'%';$('bar').style.width=pct+'%';
  $('completionDetail').textContent=`${s.done.poetry.length} poems · ${s.done.essay.length} essays · ${s.done.art.length} artworks`;
  renderCalendar(n)
}
function renderCalendar(today){
  const c=$('calendar');c.innerHTML='';
  for(let n=1;n<=365;n++){let b=document.createElement('button');b.className='day'+(n===today?' today':'');
    const done=[completed('poetry',n),completed('essay',n),completed('art',n)].filter(Boolean).length;
    if(done===3)b.classList.add('done');else if(done>0)b.classList.add('partial');
    b.textContent=n;b.onclick=()=>{s.manual=n;save();render()};c.appendChild(b)}
}
$('today').onclick=()=>{s.manual=null;save();render()};
$('navToday').onclick=()=>{s.manual=null;save();window.scrollTo({top:0,behavior:'smooth'});render()};
$('navCalendar').onclick=()=>$('calendar').scrollIntoView({behavior:'smooth'});
$('settings').onclick=()=>$('sheet').classList.remove('hidden');$('close').onclick=()=>$('sheet').classList.add('hidden');
$('reset').onclick=()=>{if(confirm('Reset all 365 progress and reflections?')){s={manual:null,done:{poetry:[],essay:[],art:[]},notes:{}};save();$('sheet').classList.add('hidden');render()}};
render();
