import {$,el,notify,database,dbAction,download,bytes} from './common.js';import {filterPhotos,digest} from './core.js';
let db,photos=[],urls=[];
async function refresh(){photos=await dbAction(db,'readonly',s=>s.getAll());render()}
function render(){
 urls.forEach(u=>URL.revokeObjectURL(u));urls=[];
 const list=filterPhotos(photos,$('#query').value,$('#sort').value==='old'),gallery=$('#gallery');gallery.replaceChildren();
 $('#summary').textContent=photos.length+' originals · '+bytes(photos.reduce((s,p)=>s+p.blob.size,0))+' · '+list.length+' matching';
 if(!list.length)gallery.append(el('p','No matching photos. Add originals or change your search.'));
 for(const p of list){
  const card=el('article',undefined,'panel photo'),u=URL.createObjectURL(p.blob);urls.push(u);
  const img=el('img');img.src=u;img.alt=p.name;img.loading='lazy';
  const tags=el('input');tags.value=p.tags;tags.setAttribute('aria-label','Tags for '+p.name);tags.placeholder='Tags, separated by commas';
  tags.onchange=()=>{p.tags=tags.value;dbAction(db,'readwrite',s=>s.put(p)).then(()=>notify('Tags saved.')).catch(e=>notify(e.message))};
  const date=el('input');date.type='date';date.value=new Date(p.date).toISOString().slice(0,10);date.setAttribute('aria-label','Date for '+p.name);
  date.onchange=()=>{const value=Date.parse(date.value);if(!Number.isFinite(value))return;p.date=value;dbAction(db,'readwrite',s=>s.put(p)).then(render).catch(e=>notify(e.message))};
  const a=el('a','Download original','button');a.href=u;a.download=p.name;
  card.append(img,el('small',p.name),el('small',bytes(p.blob.size)),tags,date,a);gallery.append(card);
 }
}
$('#photos').onchange=async e=>{
 const input=e.target;input.disabled=true;let added=0,duplicates=0;
 try{
  for(const f of input.files){
   if(!['image/jpeg','image/png','image/webp','image/gif','image/avif'].includes(f.type))continue;
   if(f.size>30*1024*1024)throw Error('Each photo must be 30 MB or smaller');
   notify('Checking '+f.name+'…');const hash=await digest(await f.arrayBuffer());
   if(photos.some(p=>p.id===hash)){duplicates++;continue}
   const item={id:hash,name:f.name,tags:'',date:f.lastModified||Date.now(),blob:f};
   await dbAction(db,'readwrite',s=>s.put(item));photos.push(item);added++;
  }
  notify(added+' added · '+duplicates+' exact duplicates skipped.');
 }catch(err){notify(err.message)}finally{render();input.disabled=false;input.value=''}
};
$('#query').oninput=render;$('#sort').onchange=render;
$('#export').onclick=()=>download('photo-catalog.json',JSON.stringify(photos.map(({blob,...p})=>({...p,size:blob.size})),null,2));
window.addEventListener('pagehide',()=>urls.forEach(u=>URL.revokeObjectURL(u)));db=await database('private-photo-timeline');await refresh();
