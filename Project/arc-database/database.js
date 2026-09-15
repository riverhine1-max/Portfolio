const search = document.getElementById('search');
const type = document.getElementById('type');
const rarity = document.getElementById('rarity');
const sort = document.getElementById('sort');
const results = document.getElementById('weapons');
const status = document.getElementById('resultsStatus');
let weapons = [];
function node(tag, text, className) { const e=document.createElement(tag); e.textContent=text; if(className)e.className=className; return e; }
function render() {
 const query=search.value.trim().toLowerCase();
 const filtered=weapons.filter(w=>(!type.value||w.type===type.value)&&(!rarity.value||w.rarity===rarity.value)&&[w.name,w.type,w.ammo,w.rarity].join(' ').toLowerCase().includes(query));
 filtered.sort((a,b)=>sort.value==='name'?a.name.localeCompare(b.name,undefined,{numeric:true}):Number(b[sort.value])-Number(a[sort.value])||a.name.localeCompare(b.name));
 status.textContent=`${filtered.length} of ${weapons.length} weapons`;
 results.replaceChildren(...filtered.map(w=>{const card=node('article','','weapon-card');card.append(node('span',w.rarity,'eyebrow'),node('h2',w.name),node('p',`${w.type} · ${w.ammo} ammo`));const dl=document.createElement('dl');for(const [key,label] of [['damage','Damage'],['fireRate','Fire rate'],['range','Range'],['magazine','Magazine'],['weight','Weight']]){const pair=document.createElement('div');pair.append(node('dt',label),node('dd',w[key]||'—'));dl.append(pair);}card.append(dl);return card;}));
 if(!filtered.length) results.append(node('p','No weapons match. Try another search or reset the filters.','empty-state'));
}
document.getElementById('filters').addEventListener('submit',e=>e.preventDefault());
[search,type,rarity,sort].forEach(e=>e.addEventListener('input',render));
document.getElementById('filters').addEventListener('reset',()=>{requestAnimationFrame(render);});
fetch('data.json').then(r=>{if(!r.ok)throw Error('Data unavailable');return r.json();}).then(data=>{weapons=data.weapons;for(const [select,key] of [[type,'type'],[rarity,'rarity']])for(const value of [...new Set(weapons.map(w=>w[key]))].filter(Boolean).sort())select.append(new Option(value,value));render();}).catch(()=>{status.textContent='The weapon data could not load. Please reload the page to try again.';});
