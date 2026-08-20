const START=new Date(2026,7,19),KEY='365-project-v2-5';let s=JSON.parse(localStorage.getItem(KEY)||'{"manual":null,"done":{"poetry":[],"essay":[],"art":[]},"notes":{}}');const $=id=>document.getElementById(id),save=()=>localStorage.setItem(KEY,JSON.stringify(s));
function day(){if(s.manual)return s.manual;let d=new Date(),t=new Date(d.getFullYear(),d.getMonth(),d.getDate());return Math.max(1,Math.min(365,Math.floor((t-START)/86400000)+1))}
function item(type,n){return PROJECT_DATA[type][n-1]}function done(type,n){return s.done[type].includes(n)}
function toggle(type,n){s.done[type]=done(type,n)?s.done[type].filter(x=>x!==n):[...s.done[type],n];save();render()}
function go(url,label){if(url)window.open(url,'_blank','noopener');else alert(label+' is not available yet.')} 
async function loadArtwork(a){
  const frame=$('artFrame'),img=$('artImage'),fallback=$('artFallback'),loading=$('artLoading');
  frame.classList.remove('hasImage','noImage');loading.style.display='flex';fallback.style.display='none';img.removeAttribute('src');

  const title=a.title||'', artist=a.creator||'';
  const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const t=norm(title), ar=norm(artist);
  const artistWords=new Set(ar.split(/\s+/).filter(x=>x.length>2));

  function score(ct,ca,desc=''){
    ct=norm(ct);ca=norm(ca);desc=norm(desc);
    let sc=0;
    if(ct===t) sc+=10; else if(ct.includes(t)||t.includes(ct)) sc+=6;
    const text=ca+' '+desc;
    let common=0; for(const w of artistWords) if(text.includes(w)) common++;
    sc+=common*5;
    if(ca && (ca.includes(ar)||ar.includes(ca))) sc+=8;
    return sc;
  }

  // A) Art Institute
  try{
    const r=await fetch(`https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(title+" "+artist)}&query[term][is_public_domain]=true&limit=10&fields=id,title,artist_display,date_display,image_id,is_public_domain,website_url`);
    if(r.ok){
      const j=await r.json();
      const hit=(j.data||[]).filter(x=>x.image_id&&x.is_public_domain)
        .map(x=>({x,s:score(x.title,x.artist_display)})).sort((a,b)=>b.s-a.s)[0];
      if(hit && hit.s>=10){
        return use(`https://www.artic.edu/iiif/2/${encodeURIComponent(hit.x.image_id)}/full/1200,/0/default.jpg`,
          `${hit.x.title} · ${hit.x.date_display||''} · Art Institute of Chicago · Public domain`,
          `https://www.artic.edu/artworks/${hit.x.id}`,'View museum record →');
      }
    }
  }catch(e){}

  // B) Met
  try{
    const r=await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(title+" "+artist)}`);
    if(r.ok){
      const j=await r.json();
      for(const id of (j.objectIDs||[]).slice(0,15)){
        const rr=await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
        if(!rr.ok) continue;
        const x=await rr.json(), sc=score(x.title,x.artistDisplayName);
        if(x.isPublicDomain&&x.primaryImage&&sc>=10){
          return use(x.primaryImage,`${x.title} · ${x.objectDate||''} · The Metropolitan Museum of Art · Public domain`,
            x.objectURL||`https://www.metmuseum.org/art/collection/search/${x.objectID}`,'View museum record →');
        }
      }
    }
  }catch(e){}

  // C) Wikimedia Commons — explicitly include origin=* for anonymous CORS.
  try{
    const api=`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(title+" "+artist)}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&format=json&origin=*`;
    const r=await fetch(api);
    if(r.ok){
      const j=await r.json(),pages=Object.values(j.query?.pages||{});
      const candidates=pages.map(p=>{
        const ii=p.imageinfo?.[0]||{},m=ii.extmetadata||{};
        const license=(m.LicenseShortName?.value||m.UsageTerms?.value||'').toLowerCase();
        const desc=m.ImageDescription?.value||'';
        const creator=m.Artist?.value||'';
        const sc=score((p.title||'').replace(/^File:/,''),creator,desc);
        const open=/public domain|cc0|cc by|creative commons/.test(license);
        return {p,ii,m,sc,open};
      }).filter(x=>x.open&&(x.ii.thumburl||x.ii.url)).sort((a,b)=>b.sc-a.sc)[0];
      if(candidates && candidates.sc>=10){
        const ii=candidates.ii;
        const imageUrl=ii.thumburl||ii.url;
        const record=`https://commons.wikimedia.org/wiki/${encodeURIComponent(candidates.p.title.replace(/ /g,'_'))}`;
        return use(imageUrl,`${candidates.p.title.replace(/^File:/,'')} · Wikimedia Commons · ${candidates.m.LicenseShortName?.value||candidates.m.UsageTerms?.value||'open license'}`,record,'View image source →');
      }
    }
  }catch(e){}

  // D) Openverse — dedicated openly-licensed image index. It exposes media URL, thumbnail,
  // license and source metadata. We use only results with an open license field.
  try{
    const r=await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(title+" "+artist)}&page_size=10`);
    if(r.ok){
      const j=await r.json();
      const results=(j.results||[]).map(x=>({x,s:score(x.title,x.creator,x.tags?.map(t=>t.name).join(' '))}))
        .filter(z=>z.x.url&&z.x.thumbnail&&z.x.license)
        .sort((a,b)=>b.s-a.s);
      const hit=results[0];
      if(hit && hit.s>=10){
        const x=hit.x;
        return use(x.url||x.thumbnail,`${x.title||title} · ${x.creator||artist} · Openverse · ${x.license.toUpperCase()}`,
          x.foreign_landing_url||x.url||a.openverseSearchUrl,'View image source →');
      }
    }
  }catch(e){}

  showFallback(a.openverseSearchUrl,'No verified open image matched automatically. Find one through Openverse.');

  function use(url,caption,record,label){
    img.onload=()=>{frame.classList.add('hasImage');frame.classList.remove('noImage');loading.style.display='none'};
    img.onerror=()=>showFallback(a.openverseSearchUrl,'The selected image could not be loaded. Try the open-image source.');
    img.src=url;$('artCaption').textContent=caption;$('artSource').textContent=label;
    $('artSource').onclick=()=>window.open(record,'_blank','noopener');
  }
  function showFallback(url,caption){
    frame.classList.add('noImage');loading.style.display='none';fallback.style.display='flex';
    $('artCaption').textContent=caption;$('artSource').textContent='Find an open image →';
    $('artSource').onclick=()=>window.open(url,'_blank','noopener');
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
$('artSource').onclick=()=>window.open(a.openverseSearchUrl,'_blank','noopener');

function openEssay(e){
  // Open a tab synchronously so mobile Safari doesn't treat the later async navigation as a popup.
  const tab=window.open('about:blank','_blank');
  const q=e.title+' '+e.creator;
  if(!tab){ window.location.href=e.wikisourceSearchUrl||e.archiveSearchUrl; return; }
  tab.document.title='Finding essay…';
  tab.document.body.innerHTML='<p style="font-family:system-ui;padding:24px">Finding the open essay source…</p>';

  (async()=>{
    // 1) Wikisource: direct page result when available.
    try{
      const u=`https://en.wikisource.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=0&srlimit=10&format=json&origin=*`;
      const r=await fetch(u); if(r.ok){
        const j=await r.json(), hits=j.query?.search||[];
        const exact=hits.find(h=>h.title.toLowerCase()===e.title.toLowerCase());
        const good=exact||hits.find(h=>h.title.toLowerCase().includes(e.title.toLowerCase()));
        if(good){
          tab.location.href='https://en.wikisource.org/wiki/'+encodeURIComponent(good.title.replace(/ /g,'_'));
          return;
        }
      }
    }catch(err){}

    // 2) Internet Archive: only open a result if it is a real item; otherwise use search.
    try{
      const u=`https://archive.org/advancedsearch.php?q=${encodeURIComponent(e.title+' '+e.creator)}&fl[]=identifier,title,creator&rows=20&page=1&output=json`;
      const r=await fetch(u); if(r.ok){
        const j=await r.json(), docs=j.response?.docs||[];
        const target=docs.find(d=>(d.title||'').toLowerCase().includes(e.title.toLowerCase()));
        if(target?.identifier){
          tab.location.href='https://archive.org/details/'+encodeURIComponent(target.identifier); return;
        }
      }
    }catch(err){}

    tab.location.href=e.archiveSearchUrl||e.wikisourceSearchUrl;
  })();
}
$('note').value=s.notes[n]||'';$('saveNote').onclick=()=>{s.notes[n]=$('note').value;save();$('saveNote').textContent='Saved ✓';setTimeout(()=>$('saveNote').textContent='Save reflection',900)};
let total=s.done.poetry.length+s.done.essay.length+s.done.art.length,pct=Math.round(total/1095*100);$('progress').textContent=pct+'%';$('bar').style.width=pct+'%';$('completionDetail').textContent=`${s.done.poetry.length} poems · ${s.done.essay.length} essays · ${s.done.art.length} artworks`;renderCalendar(n)}
function renderCalendar(today){let c=$('calendar');c.innerHTML='';for(let n=1;n<=365;n++){let b=document.createElement('button');b.className='day'+(n===today?' today':'');let k=[done('poetry',n),done('essay',n),done('art',n)].filter(Boolean).length;if(k===3)b.classList.add('done');else if(k)b.classList.add('partial');b.textContent=n;b.onclick=()=>{s.manual=n;save();render()};c.appendChild(b)}}
$('today').onclick=()=>{s.manual=null;save();render()};$('navToday').onclick=()=>{s.manual=null;save();window.scrollTo({top:0,behavior:'smooth'});render()};$('navCalendar').onclick=()=>$('calendar').scrollIntoView({behavior:'smooth'});$('settings').onclick=()=>$('sheet').classList.remove('hidden');$('close').onclick=()=>$('sheet').classList.add('hidden');$('reset').onclick=()=>{if(confirm('Reset all 365 progress and reflections?')){s={manual:null,done:{poetry:[],essay:[],art:[]},notes:{}};save();$('sheet').classList.add('hidden');render()}};render();