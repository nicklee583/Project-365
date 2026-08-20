const START=new Date(2026,7,19),KEY='365-project-v2';let s=JSON.parse(localStorage.getItem(KEY)||'{"manual":null,"done":{"poetry":[],"essay":[],"art":[]},"notes":{}}');const $=id=>document.getElementById(id),save=()=>localStorage.setItem(KEY,JSON.stringify(s));
function day(){if(s.manual)return s.manual;let d=new Date(),t=new Date(d.getFullYear(),d.getMonth(),d.getDate());return Math.max(1,Math.min(365,Math.floor((t-START)/86400000)+1))}
function item(type,n){return PROJECT_DATA[type][n-1]}function done(type,n){return s.done[type].includes(n)}
function toggle(type,n){s.done[type]=done(type,n)?s.done[type].filter(x=>x!==n):[...s.done[type],n];save();render()}
function go(url,label){if(url)window.open(url,'_blank','noopener');else alert(label+' is not available yet.')} 
async function loadArtwork(a){
  const frame=$('artFrame'),img=$('artImage'),fallback=$('artFallback'),loading=$('artLoading');
  frame.classList.remove('hasImage','noImage'); loading.style.display='flex'; fallback.style.display='none'; img.removeAttribute('src');

  const title=a.title||'', artist=a.creator||'';
  const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const t=norm(title), ar=norm(artist);
  const words=s=>new Set(s.split(/\s+/).filter(x=>x.length>2));
  const score=(candidateTitle,candidateArtist)=>{
    const ct=norm(candidateTitle), ca=norm(candidateArtist);
    let sc=0;
    if(ct===t) sc+=10; else if(ct.includes(t)||t.includes(ct)) sc+=6;
    const aw=words(ar), cw=words(ca); let common=0; aw.forEach(x=>{if(cw.has(x))common++});
    sc+=common*8;
    return sc;
  };

  // 1. Art Institute: only accept a strong title/artist match.
  try{
    const r=await fetch(`https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(title+" "+artist)}&query[term][is_public_domain]=true&limit=10&fields=id,title,artist_display,date_display,image_id,is_public_domain,website_url`);
    if(r.ok){
      const j=await r.json(), candidates=(j.data||[]).filter(x=>x.image_id&&x.is_public_domain);
      const hit=candidates.map(x=>({x,s:score(x.title,x.artist_display)})).sort((a,b)=>b.s-a.s)[0];
      if(hit && hit.s>=12){
        return showImage(`https://www.artic.edu/iiif/2/${encodeURIComponent(hit.x.image_id)}/full/1200,/0/default.jpg`,
          `${hit.x.title} · ${hit.x.date_display||''} · Art Institute of Chicago · Public domain`,
          `https://www.artic.edu/artworks/${hit.x.id}`, 'View museum record →');
      }
    }
  }catch(e){}

  // 2. Met: only accept strong title/artist match and public domain.
  try{
    const r=await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(title+" "+artist)}`);
    if(r.ok){
      const j=await r.json();
      for(const id of (j.objectIDs||[]).slice(0,12)){
        const rr=await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
        if(!rr.ok) continue;
        const x=await rr.json(), sc=score(x.title,x.artistDisplayName);
        if(x.isPublicDomain&&x.primaryImage&&sc>=12){
          return showImage(x.primaryImage,`${x.title} · ${x.objectDate||''} · The Metropolitan Museum of Art · Public domain`,
            x.objectURL||`https://www.metmuseum.org/art/collection/search/${x.objectID}`,'View museum record →');
        }
      }
    }
  }catch(e){}

  // 3. Wikimedia Commons direct API. Unlike MediaSearch pages, this returns actual image URLs.
  try{
    const api=`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(title+" "+artist)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&format=json&origin=*`;
    const r=await fetch(api);
    if(r.ok){
      const j=await r.json(), pages=Object.values(j.query?.pages||{});
      const good=pages.map(p=>{
        const meta=p.imageinfo?.[0]?.extmetadata||{};
        const license=(meta.LicenseShortName?.value||'').toLowerCase();
        const desc=(meta.ImageDescription?.value||'');
        const sc=score(p.title?.replace(/^File:/,''),desc);
        const open=/public domain|cc0|creative commons attribution|cc by|cc by-sa/.test(license);
        return {p,meta,sc,open};
      }).filter(x=>x.open&&x.p.imageinfo?.[0]?.thumburl).sort((a,b)=>b.sc-a.sc)[0];
      if(good && good.sc>=12){
        const ii=good.p.imageinfo[0];
        const rec=`https://commons.wikimedia.org/wiki/${encodeURIComponent(good.p.title.replace(/ /g,'_'))}`;
        return showImage(ii.thumburl,`${good.p.title.replace(/^File:/,'')} · Wikimedia Commons · ${good.meta.LicenseShortName?.value||'open license'}`,rec,'View image source →');
      }
    }
  }catch(e){}

  showFallback(a.commonsSearchUrl,'No verified image matched automatically. Find an open image below.');

  function showImage(url,caption,record,label){
    img.onload=()=>{frame.classList.add('hasImage');frame.classList.remove('noImage');loading.style.display='none'};
    img.onerror=()=>showFallback(a.commonsSearchUrl,'The selected image could not be loaded. Find an open image below.');
    img.src=url;$('artCaption').textContent=caption;$('artSource').textContent=label;$('artSource').onclick=()=>window.open(record,'_blank','noopener');
  }
  function showFallback(url,caption){
    frame.classList.add('noImage');loading.style.display='none';fallback.style.display='flex';
    $('artCaption').textContent=caption;$('artSource').textContent='Find an open image →';$('artSource').onclick=()=>window.open(url,'_blank','noopener');
  }
}
function render(){let n=day(),p=item('poetry',n),e=item('essay',n),a=item('art',n);
$('artImage').dataset.artKey=n;
$('dateLabel').textContent=new Date(2026,7,19+n-1).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});$('dayNumber').textContent='Day '+n;$('theme').textContent=p.theme;
$('poetryTitle').textContent=p.title;$('poetryCreator').textContent=p.creator;$('poetryFocus').textContent=p.focus;
$('essayTitle').textContent=e.title;$('essayCreator').textContent=e.creator;$('essayFocus').textContent=e.focus;
$('artTitle').textContent=a.title;$('artCreator').textContent=a.creator;$('artFocus').textContent='Look for: '+a.focus+'.';$('artCaption').textContent=a.sourceLabel||'';
$('artImage').alt=a.title+' — '+a.creator;loadArtwork(a)
$('poetryDone').textContent=done('poetry',n)?'Poem completed ✓':'Mark poem complete';$('essayDone').textContent=done('essay',n)?'Essay completed ✓':'Mark essay complete';$('artDone').textContent=done('art',n)?'Artwork explored ✓':'Mark artwork complete';
$('poetryDone').onclick=()=>toggle('poetry',n);$('essayDone').onclick=()=>toggle('essay',n);$('artDone').onclick=()=>toggle('art',n);
$('poetryRead').onclick=()=>go(p.sourceUrl,'Poem');
$('essayRead').onclick=()=>openEssay(e);
$('artSource').onclick=()=>window.open(a.commonsSearchUrl,'_blank','noopener');

async function openEssay(e){
  const q=e.archiveQuery||`title:("${e.title}") AND creator:("${e.creator}")`;
  const url=`https://archive.org/advancedsearch.php?q=${encodeURIComponent(q)}&fl[]=identifier,title,creator&rows=10&page=1&output=json`;
  try{
    const r=await fetch(url); if(r.ok){
      const j=await r.json(), docs=j.response?.docs||[];
      if(docs.length){
        // Prefer a result whose title contains the essay title; otherwise use the first archival item.
        const target=(docs.find(d=>(d.title||'').toLowerCase().includes(e.title.toLowerCase()))||docs[0]);
        if(target.identifier){ window.open(`https://archive.org/details/${encodeURIComponent(target.identifier)}`,'_blank','noopener'); return; }
      }
    }
  }catch(err){}
  window.open(e.archiveSearchUrl||e.primaryUrl,'_blank','noopener');
}
$('note').value=s.notes[n]||'';$('saveNote').onclick=()=>{s.notes[n]=$('note').value;save();$('saveNote').textContent='Saved ✓';setTimeout(()=>$('saveNote').textContent='Save reflection',900)};
let total=s.done.poetry.length+s.done.essay.length+s.done.art.length,pct=Math.round(total/1095*100);$('progress').textContent=pct+'%';$('bar').style.width=pct+'%';$('completionDetail').textContent=`${s.done.poetry.length} poems · ${s.done.essay.length} essays · ${s.done.art.length} artworks`;renderCalendar(n)}
function renderCalendar(today){let c=$('calendar');c.innerHTML='';for(let n=1;n<=365;n++){let b=document.createElement('button');b.className='day'+(n===today?' today':'');let k=[done('poetry',n),done('essay',n),done('art',n)].filter(Boolean).length;if(k===3)b.classList.add('done');else if(k)b.classList.add('partial');b.textContent=n;b.onclick=()=>{s.manual=n;save();render()};c.appendChild(b)}}
$('today').onclick=()=>{s.manual=null;save();render()};$('navToday').onclick=()=>{s.manual=null;save();window.scrollTo({top:0,behavior:'smooth'});render()};$('navCalendar').onclick=()=>$('calendar').scrollIntoView({behavior:'smooth'});$('settings').onclick=()=>$('sheet').classList.remove('hidden');$('close').onclick=()=>$('sheet').classList.add('hidden');$('reset').onclick=()=>{if(confirm('Reset all 365 progress and reflections?')){s={manual:null,done:{poetry:[],essay:[],art:[]},notes:{}};save();$('sheet').classList.add('hidden');render()}};render();