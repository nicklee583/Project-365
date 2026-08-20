const START=new Date(2026,7,19),KEY='365-project-v2';let s=JSON.parse(localStorage.getItem(KEY)||'{"manual":null,"done":{"poetry":[],"essay":[],"art":[]},"notes":{}}');const $=id=>document.getElementById(id),save=()=>localStorage.setItem(KEY,JSON.stringify(s));
function day(){if(s.manual)return s.manual;let d=new Date(),t=new Date(d.getFullYear(),d.getMonth(),d.getDate());return Math.max(1,Math.min(365,Math.floor((t-START)/86400000)+1))}
function item(type,n){return PROJECT_DATA[type][n-1]}function done(type,n){return s.done[type].includes(n)}
function toggle(type,n){s.done[type]=done(type,n)?s.done[type].filter(x=>x!==n):[...s.done[type],n];save();render()}
function go(url,label){if(url)window.open(url,'_blank','noopener');else alert(label+' is not available yet.')} 
async function loadArtwork(a){
  const frame=$('artFrame'),img=$('artImage'),fallback=$('artFallback'),loading=$('artLoading');
  frame.classList.remove('hasImage','noImage');loading.style.display='flex';fallback.style.display='none';
  if(!a.aicApiQuery){frame.classList.add('noImage');return}
  try{
    const r=await fetch(a.aicApiQuery); if(!r.ok) throw new Error('api');
    const j=await r.json(); const hit=(j.data||[]).find(x=>x.image_id && x.is_public_domain);
    if(!hit) throw new Error('no-match');
    const iiif='https://www.artic.edu/iiif/2/'+encodeURIComponent(hit.image_id)+'/full/843,/0/default.jpg';
    img.onload=()=>{frame.classList.add('hasImage');frame.classList.remove('noImage');loading.style.display='none'};
    img.onerror=()=>{frame.classList.add('noImage');loading.style.display='none';fallback.style.display='flex'};
    img.src=iiif;
    $('artCaption').textContent=(hit.title||a.title)+' · '+(hit.date_display||'')+' · Art Institute of Chicago · Public domain';
  }catch(e){
    frame.classList.add('noImage');loading.style.display='none';fallback.style.display='flex';
    $('artCaption').textContent='No verified open-access image found automatically. Museum record available below.';
  }
}
function render(){let n=day(),p=item('poetry',n),e=item('essay',n),a=item('art',n);
$('dateLabel').textContent=new Date(2026,7,19+n-1).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});$('dayNumber').textContent='Day '+n;$('theme').textContent=p.theme;
$('poetryTitle').textContent=p.title;$('poetryCreator').textContent=p.creator;$('poetryFocus').textContent=p.focus;
$('essayTitle').textContent=e.title;$('essayCreator').textContent=e.creator;$('essayFocus').textContent=e.focus;
$('artTitle').textContent=a.title;$('artCreator').textContent=a.creator;$('artFocus').textContent='Look for: '+a.focus+'.';$('artCaption').textContent=a.sourceLabel||'';
$('artImage').alt=a.title+' — '+a.creator;loadArtwork(a)
$('poetryDone').textContent=done('poetry',n)?'Poem completed ✓':'Mark poem complete';$('essayDone').textContent=done('essay',n)?'Essay completed ✓':'Mark essay complete';$('artDone').textContent=done('art',n)?'Artwork explored ✓':'Mark artwork complete';
$('poetryDone').onclick=()=>toggle('poetry',n);$('essayDone').onclick=()=>toggle('essay',n);$('artDone').onclick=()=>toggle('art',n);
$('poetryRead').onclick=()=>go(p.sourceUrl,'Poem');$('essayRead').onclick=()=>go(e.sourceUrl,'Essay');$('artSource').onclick=()=>go(a.aicSearchUrl||a.museumSearchUrl,'Museum record');
$('note').value=s.notes[n]||'';$('saveNote').onclick=()=>{s.notes[n]=$('note').value;save();$('saveNote').textContent='Saved ✓';setTimeout(()=>$('saveNote').textContent='Save reflection',900)};
let total=s.done.poetry.length+s.done.essay.length+s.done.art.length,pct=Math.round(total/1095*100);$('progress').textContent=pct+'%';$('bar').style.width=pct+'%';$('completionDetail').textContent=`${s.done.poetry.length} poems · ${s.done.essay.length} essays · ${s.done.art.length} artworks`;renderCalendar(n)}
function renderCalendar(today){let c=$('calendar');c.innerHTML='';for(let n=1;n<=365;n++){let b=document.createElement('button');b.className='day'+(n===today?' today':'');let k=[done('poetry',n),done('essay',n),done('art',n)].filter(Boolean).length;if(k===3)b.classList.add('done');else if(k)b.classList.add('partial');b.textContent=n;b.onclick=()=>{s.manual=n;save();render()};c.appendChild(b)}}
$('today').onclick=()=>{s.manual=null;save();render()};$('navToday').onclick=()=>{s.manual=null;save();window.scrollTo({top:0,behavior:'smooth'});render()};$('navCalendar').onclick=()=>$('calendar').scrollIntoView({behavior:'smooth'});$('settings').onclick=()=>$('sheet').classList.remove('hidden');$('close').onclick=()=>$('sheet').classList.add('hidden');$('reset').onclick=()=>{if(confirm('Reset all 365 progress and reflections?')){s={manual:null,done:{poetry:[],essay:[],art:[]},notes:{}};save();$('sheet').classList.add('hidden');render()}};render();