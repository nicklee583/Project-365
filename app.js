const START=new Date(2026,7,19),KEY='365-project-v2';let s=JSON.parse(localStorage.getItem(KEY)||'{"manual":null,"done":{"poetry":[],"essay":[],"art":[]},"notes":{}}');const $=id=>document.getElementById(id),save=()=>localStorage.setItem(KEY,JSON.stringify(s));
function day(){if(s.manual)return s.manual;let d=new Date(),t=new Date(d.getFullYear(),d.getMonth(),d.getDate());return Math.max(1,Math.min(365,Math.floor((t-START)/86400000)+1))}
function item(type,n){return PROJECT_DATA[type][n-1]}function done(type,n){return s.done[type].includes(n)}
function toggle(type,n){s.done[type]=done(type,n)?s.done[type].filter(x=>x!==n):[...s.done[type],n];save();render()}
function go(url,label){if(url)window.open(url,'_blank','noopener');else alert(label+' is not available yet.')} 
async function loadArtwork(a){
  const frame=$('artFrame'),img=$('artImage'),fallback=$('artFallback'),loading=$('artLoading');
  frame.classList.remove('hasImage','noImage'); loading.style.display='flex'; fallback.style.display='none';
  img.removeAttribute('src');

  const q=encodeURIComponent(a.title+" "+a.creator);
  // Correct Art Institute query: q=... plus a public-domain term filter.
  const aic=`https://api.artic.edu/api/v1/artworks/search?q=${q}&query[term][is_public_domain]=true&limit=6&fields=id,title,artist_display,date_display,image_id,is_public_domain,is_zoomable,website_url`;
  try{
    const r=await fetch(aic); if(r.ok){
      const j=await r.json();
      const candidates=(j.data||[]).filter(x=>x.image_id && x.is_public_domain);
      const wanted=a.title.toLowerCase();
      const hit=candidates.sort((x,y)=>{
        const ax=(x.title||'').toLowerCase().includes(wanted)?1:0;
        const ay=(y.title||'').toLowerCase().includes(wanted)?1:0;
        return ay-ax;
      })[0];
      if(hit){
        const iiif=`https://www.artic.edu/iiif/2/${encodeURIComponent(hit.image_id)}/full/843,/0/default.jpg`;
        img.onload=()=>{frame.classList.add('hasImage');frame.classList.remove('noImage');loading.style.display='none'};
        img.onerror=()=>tryMet();
        img.src=iiif;
        $('artCaption').textContent=`${hit.title} · ${hit.date_display||''} · Art Institute of Chicago · Public domain`;
        $('artSource').onclick=()=>window.open(`https://www.artic.edu/artworks/${hit.id}`,'_blank','noopener');
        return;
      }
    }
  }catch(e){}

  tryMet();

  async function tryMet(){
    const search=`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${q}`;
    try{
      const r=await fetch(search); if(!r.ok) throw new Error('met search');
      const j=await r.json();
      const ids=(j.objectIDs||[]).slice(0,8);
      for(const id of ids){
        const rr=await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
        if(!rr.ok) continue;
        const x=await rr.json();
        const titleMatch=(x.title||'').toLowerCase().includes(a.title.toLowerCase()) || a.title.toLowerCase().includes((x.title||'').toLowerCase());
        const artistMatch=(x.artistDisplayName||'').toLowerCase().includes(a.creator.toLowerCase()) || a.creator.toLowerCase().includes((x.artistDisplayName||'').toLowerCase());
        if(x.isPublicDomain && x.primaryImage && (titleMatch || artistMatch)){
          img.onload=()=>{frame.classList.add('hasImage');frame.classList.remove('noImage');loading.style.display='none'};
          img.onerror=()=>showNone();
          img.src=x.primaryImage;
          $('artCaption').textContent=`${x.title} · ${x.objectDate||''} · The Metropolitan Museum of Art · Public domain`;
          $('artSource').onclick=()=>window.open(x.objectURL||`https://www.metmuseum.org/art/collection/search/${x.objectID}`,'_blank','noopener');
          return;
        }
      }
    }catch(e){}
    showNone();
  }

  function showNone(){
    frame.classList.add('noImage');loading.style.display='none';fallback.style.display='flex';
    $('artCaption').textContent='No verified open-access image matched automatically. The artwork record can still be researched through a museum collection.';
    $('artSource').onclick=()=>window.open(`https://www.metmuseum.org/art/collection/search?search=${q}`,'_blank','noopener');
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
$('poetryRead').onclick=()=>go(p.sourceUrl,'Poem');$('essayRead').onclick=()=>go(e.sourceUrl,'Essay');$('artSource').onclick=()=>window.open(`https://www.metmuseum.org/art/collection/search?search=${encodeURIComponent(a.title+' '+a.creator)}`,'_blank','noopener');
$('note').value=s.notes[n]||'';$('saveNote').onclick=()=>{s.notes[n]=$('note').value;save();$('saveNote').textContent='Saved ✓';setTimeout(()=>$('saveNote').textContent='Save reflection',900)};
let total=s.done.poetry.length+s.done.essay.length+s.done.art.length,pct=Math.round(total/1095*100);$('progress').textContent=pct+'%';$('bar').style.width=pct+'%';$('completionDetail').textContent=`${s.done.poetry.length} poems · ${s.done.essay.length} essays · ${s.done.art.length} artworks`;renderCalendar(n)}
function renderCalendar(today){let c=$('calendar');c.innerHTML='';for(let n=1;n<=365;n++){let b=document.createElement('button');b.className='day'+(n===today?' today':'');let k=[done('poetry',n),done('essay',n),done('art',n)].filter(Boolean).length;if(k===3)b.classList.add('done');else if(k)b.classList.add('partial');b.textContent=n;b.onclick=()=>{s.manual=n;save();render()};c.appendChild(b)}}
$('today').onclick=()=>{s.manual=null;save();render()};$('navToday').onclick=()=>{s.manual=null;save();window.scrollTo({top:0,behavior:'smooth'});render()};$('navCalendar').onclick=()=>$('calendar').scrollIntoView({behavior:'smooth'});$('settings').onclick=()=>$('sheet').classList.remove('hidden');$('close').onclick=()=>$('sheet').classList.add('hidden');$('reset').onclick=()=>{if(confirm('Reset all 365 progress and reflections?')){s={manual:null,done:{poetry:[],essay:[],art:[]},notes:{}};save();$('sheet').classList.add('hidden');render()}};render();