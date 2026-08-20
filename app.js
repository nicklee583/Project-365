const START=new Date(2026,7,19),KEY='365-project-v2';let s=JSON.parse(localStorage.getItem(KEY)||'{"manual":null,"done":{"poetry":[],"essay":[],"art":[]},"notes":{}}');const $=id=>document.getElementById(id),save=()=>localStorage.setItem(KEY,JSON.stringify(s));
function day(){if(s.manual)return s.manual;let d=new Date(),t=new Date(d.getFullYear(),d.getMonth(),d.getDate());return Math.max(1,Math.min(365,Math.floor((t-START)/86400000)+1))}
function item(type,n){return PROJECT_DATA[type][n-1]}function done(type,n){return s.done[type].includes(n)}
function toggle(type,n){s.done[type]=done(type,n)?s.done[type].filter(x=>x!==n):[...s.done[type],n];save();render()}
function go(url,label){if(url)window.open(url,'_blank','noopener');else alert(label+' is not available yet.')} 
async function loadArtwork(a){
  const frame=$('artFrame'),img=$('artImage'),fallback=$('artFallback'),loading=$('artLoading');
  frame.classList.remove('hasImage','noImage');loading.style.display='flex';fallback.style.display='none';
  img.removeAttribute('src');

  const q=encodeURIComponent(a.title+" "+a.creator);
  const norm=s=>(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const targetTitle=norm(a.title), targetArtist=norm(a.creator);

  // 1) Art Institute of Chicago
  try{
    const r=await fetch(`https://api.artic.edu/api/v1/artworks/search?q=${q}&query[term][is_public_domain]=true&limit=8&fields=id,title,artist_display,date_display,image_id,is_public_domain,website_url`);
    if(r.ok){
      const j=await r.json();
      const hit=(j.data||[]).find(x=>{
        const t=norm(x.title), ad=norm(x.artist_display);
        return x.image_id && x.is_public_domain &&
          (t.includes(targetTitle) || targetTitle.includes(t) || ad.includes(targetArtist) || targetArtist.includes(ad));
      });
      if(hit) return useImage(`https://www.artic.edu/iiif/2/${encodeURIComponent(hit.image_id)}/full/1200,/0/default.jpg`,
        `${hit.title} · ${hit.date_display||''} · Art Institute of Chicago · Public domain`,
        `https://www.artic.edu/artworks/${hit.id}`);
    }
  }catch(e){}

  // 2) The Met
  try{
    const r=await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${q}`);
    if(r.ok){
      const j=await r.json();
      for(const id of (j.objectIDs||[]).slice(0,10)){
        const rr=await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
        if(!rr.ok) continue;
        const x=await rr.json(), t=norm(x.title), ad=norm(x.artistDisplayName);
        if(x.isPublicDomain && x.primaryImage && (t.includes(targetTitle)||targetTitle.includes(t)||ad.includes(targetArtist)||targetArtist.includes(ad))){
          return useImage(x.primaryImage, `${x.title} · ${x.objectDate||''} · The Metropolitan Museum of Art · Public domain`,
            x.objectURL||`https://www.metmuseum.org/art/collection/search/${x.objectID}`);
        }
      }
    }
  }catch(e){}

  // 3) Wikimedia Commons: use the public search page as a safe image-source fallback.
  // We don't hotlink arbitrary Commons media without verifying the license/metadata.
  return showFallback(a.wikimediaSearchUrl,
    'No verified museum image matched automatically. Try the open image search below.');

  function useImage(url,caption,record){
    img.onload=()=>{frame.classList.add('hasImage');frame.classList.remove('noImage');loading.style.display='none'};
    img.onerror=()=>showFallback(a.wikimediaSearchUrl,'The museum image could not be loaded. An open-image source is available below.');
    img.src=url;$('artCaption').textContent=caption;
    a.fallbackSource=record;
    $('artSource').textContent='View museum record →';
  }
  function showFallback(url,caption){
    frame.classList.add('noImage');loading.style.display='none';fallback.style.display='flex';
    $('artCaption').textContent=caption;
    a.fallbackSource=url;$('artSource').textContent='Find an open image →';
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
$('essayRead').onclick=()=>go(e.primaryUrl,'Essay search');
$('artSource').onclick=()=>window.open(a.fallbackSource||a.wikimediaSearchUrl,'_blank','noopener');
$('note').value=s.notes[n]||'';$('saveNote').onclick=()=>{s.notes[n]=$('note').value;save();$('saveNote').textContent='Saved ✓';setTimeout(()=>$('saveNote').textContent='Save reflection',900)};
let total=s.done.poetry.length+s.done.essay.length+s.done.art.length,pct=Math.round(total/1095*100);$('progress').textContent=pct+'%';$('bar').style.width=pct+'%';$('completionDetail').textContent=`${s.done.poetry.length} poems · ${s.done.essay.length} essays · ${s.done.art.length} artworks`;renderCalendar(n)}
function renderCalendar(today){let c=$('calendar');c.innerHTML='';for(let n=1;n<=365;n++){let b=document.createElement('button');b.className='day'+(n===today?' today':'');let k=[done('poetry',n),done('essay',n),done('art',n)].filter(Boolean).length;if(k===3)b.classList.add('done');else if(k)b.classList.add('partial');b.textContent=n;b.onclick=()=>{s.manual=n;save();render()};c.appendChild(b)}}
$('today').onclick=()=>{s.manual=null;save();render()};$('navToday').onclick=()=>{s.manual=null;save();window.scrollTo({top:0,behavior:'smooth'});render()};$('navCalendar').onclick=()=>$('calendar').scrollIntoView({behavior:'smooth'});$('settings').onclick=()=>$('sheet').classList.remove('hidden');$('close').onclick=()=>$('sheet').classList.add('hidden');$('reset').onclick=()=>{if(confirm('Reset all 365 progress and reflections?')){s={manual:null,done:{poetry:[],essay:[],art:[]},notes:{}};save();$('sheet').classList.add('hidden');render()}};render();