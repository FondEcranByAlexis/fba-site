(()=>{'use strict';
const sections=[
{title:'FBA Wallpapers',links:[['Toutes les collections','fba-wallpapers.html'],['Formule 1 — 22 pilotes','fba-wallpapers-f1.html'],['Éditions limitées','editions-limitees.html'],['Boutique et panier','boutique.html']]},
{title:'FBA Games',links:[['Studio FBA Games (en préparation)',null],['Business Empire Simulator (en préparation)',null]]},
{title:'Nos univers',links:[['Métiers','metiers.html'],['Studio','fba-studio.html'],['Secours','fba-secours.html'],['Forces de l’ordre','fba-force-ordre.html'],['BTP','fba-btp.html'],['Défense','fba-defense.html'],['Métiers insolites','metiers-insolites.html'],['Reportage','fba-reportage.html'],['Productions','fba-productions.html']]}
];
const header=document.querySelector('header');if(!header)return;
const button=document.createElement('button');button.type='button';button.className='fba-nav-button';button.setAttribute('aria-label','Ouvrir le menu');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','fbaNavDrawer');button.innerHTML='<i></i><i></i><i></i>';
const anchor=header.querySelector('.top')||header;anchor.append(button);
const overlay=document.createElement('div');overlay.className='fba-nav-overlay';overlay.hidden=true;
const drawer=document.createElement('aside');drawer.id='fbaNavDrawer';drawer.className='fba-nav-drawer';drawer.setAttribute('aria-label','Navigation FBA');drawer.hidden=true;drawer.inert=true;
const top=document.createElement('div');top.className='fba-nav-top';
const title=document.createElement('p');title.className='fba-nav-title';title.textContent='Explorer FBA';top.append(title);
const close=document.createElement('button');close.type='button';close.className='fba-nav-close';close.setAttribute('aria-label','Fermer le menu');close.textContent='×';top.append(close);drawer.append(top);
const label=document.createElement('label');label.htmlFor='fbaNavSearch';label.textContent='Rechercher une rubrique';drawer.append(label);
const search=document.createElement('input');search.id='fbaNavSearch';search.type='search';search.placeholder='Collections, pilotes, jeux…';drawer.append(search);
const root=document.createElement('div');drawer.append(root);
function addLink(parent,text,url){if(!url){const p=document.createElement('p');p.className='fba-nav-pending';p.textContent=text;parent.append(p);return;}const a=document.createElement('a');a.href=url;a.textContent=text;parent.append(a);}
addLink(root,'Accueil','index.html');
for(const section of sections){const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent=section.title;details.append(summary);for(const [name,url] of section.links)addLink(details,name,url);root.append(details);}
addLink(root,'À propos','index.html#apropos');addLink(root,'Contact','index.html#contact');
const empty=document.createElement('p');empty.className='fba-nav-empty';empty.textContent='Aucune rubrique trouvée.';empty.hidden=true;drawer.append(empty);
document.body.append(overlay,drawer);
let returnFocus=null;
function openMenu(open){if(open)returnFocus=document.activeElement;drawer.hidden=!open;drawer.inert=!open;overlay.hidden=!open;button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');document.body.classList.toggle('fba-nav-open',open);if(open)close.focus();else if(returnFocus&&returnFocus.isConnected)returnFocus.focus();}
button.addEventListener('click',()=>openMenu(drawer.hidden));overlay.addEventListener('click',()=>openMenu(false));close.addEventListener('click',()=>openMenu(false));
drawer.addEventListener('click',e=>{if(e.target.closest('a'))openMenu(false);});
document.addEventListener('keydown',e=>{if(drawer.hidden)return;if(e.key==='Escape'){openMenu(false);return;}if(e.key!=='Tab')return;const visible=[...drawer.querySelectorAll('button,input,summary,a[href]')].filter(el=>el.getClientRects().length);const i=visible.indexOf(document.activeElement);if(e.shiftKey&&i===0){e.preventDefault();visible[visible.length-1].focus();}else if(!e.shiftKey&&i===visible.length-1){e.preventDefault();visible[0].focus();}});
const normalize=s=>s.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
search.addEventListener('input',()=>{const q=normalize(search.value.trim());let count=0;for(const el of root.children){if(el.tagName==='DETAILS'){const links=[...el.querySelectorAll('a,.fba-nav-pending')];const match=normalize(el.querySelector('summary').textContent).includes(q);links.forEach(a=>a.hidden=!!q&&!match&&!normalize(a.textContent).includes(q));el.hidden=!!q&&!match&&!links.some(a=>!a.hidden);if(q&&!el.hidden)el.open=true;}else el.hidden=!!q&&!normalize(el.textContent).includes(q);if(!el.hidden)count++;}empty.hidden=count!==0;});
})();