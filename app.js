(function(){
var D=window.I18N,KEY='zvitok_lang';
function setLang(l){if(!D[l])l='uk';var t=D[l];document.documentElement.lang=l;
document.querySelectorAll('[data-i18n]').forEach(function(e){var k=e.dataset.i18n;if(t[k]!=null)e.textContent=t[k]});
document.querySelectorAll('[data-i18n-html]').forEach(function(e){var k=e.dataset.i18nHtml;if(t[k]!=null)e.innerHTML=t[k]});
document.querySelectorAll('[data-i18n-ph]').forEach(function(e){e.placeholder=t[e.dataset.i18nPh]||''});
document.querySelectorAll('[data-i18n-aria]').forEach(function(e){e.setAttribute('aria-label',t[e.dataset.i18nAria]||'')});
document.querySelectorAll('[data-lang]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.lang===l)});
document.title=t.title;try{localStorage.setItem(KEY,l)}catch(e){}cur=l;
document.querySelectorAll('.err').forEach(function(e){e.textContent=''});document.querySelectorAll('.invalid').forEach(function(e){e.classList.remove('invalid')});}
var cur,saved;try{saved=localStorage.getItem(KEY)}catch(e){}
var q=new URLSearchParams(location.search).get('lang');setLang(q||saved||'uk');
document.querySelectorAll('[data-lang]').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.lang)})});
var h=document.querySelector('header');addEventListener('scroll',function(){h.classList.toggle('scrolled',scrollY>8)},{passive:true});
var bg=document.querySelector('.burger'),mn=document.getElementById('mnav');
bg.addEventListener('click',function(){var o=mn.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mn.classList.remove('open');bg.setAttribute('aria-expanded',false)})});
if(/shot/.test(location.search))document.documentElement.classList.add('shot');if('IntersectionObserver'in window&&!/shot/.test(location.search)){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll('.rv').forEach(function(e){io.observe(e)})}else document.querySelectorAll('.rv').forEach(function(e){e.classList.add('in')});
var f=document.getElementById('form'),ok=document.getElementById('ok');
function fail(el,m){el.classList.add('invalid');var e=el.closest('div').querySelector('.err')||el.closest('.full').querySelector('.err');e.textContent=m;return false}
f.addEventListener('submit',function(ev){ev.preventDefault();var t=D[cur],good=true,first=null;
f.querySelectorAll('.err').forEach(function(e){e.textContent=''});f.querySelectorAll('.invalid').forEach(function(e){e.classList.remove('invalid')});
function chk(el,cond,msg){if(!cond){fail(el,msg);good=false;first=first||el}}
var n=f.elements.name.value.trim(),p=f.phone.value.replace(/[^\d+]/g,''),m=f.email.value.trim();
chk(f.elements.name,n.length>=2,t.e_name);
chk(f.phone,/^(\+?380|0)\d{9}$/.test(p),t.e_phone);
chk(f.email,/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m),t.e_email);
chk(f.group,f.group.value!=='',t.e_sel);chk(f.tax,f.tax.value!=='',t.e_sel);
chk(f.ok,f.ok.checked,t.e_ok);
if(!good){first.focus();return}
f.style.display='none';ok.classList.add('show');ok.focus();});
document.getElementById('again').addEventListener('click',function(){f.reset();ok.classList.remove('show');f.style.display=''});
})();
