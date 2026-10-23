export function filterPhotos(photos,query,ascending=false){
 const term=query.trim().toLowerCase();return photos.filter(p=>(p.name+' '+p.tags).toLowerCase().includes(term)).slice().sort((a,b)=>ascending?a.date-b.date:b.date-a.date);
}
export async function digest(buffer){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',buffer)),b=>b.toString(16).padStart(2,'0')).join('')}
