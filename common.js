/* Звиток demo cabinets: shared UI (header, language, demo date, notifications, submit flow, dialogs) */
(function(){
var Z=window.ZV,D=window.I18N,KEY='zvitok_lang',PAGE=document.body.dataset.page,AUD=PAGE==='fop'?'fop':'acc',cur='uk';
function t(k,p){var s=(D[cur]&&D[cur][k]!=null)?D[cur][k]:(D.uk[k]!=null?D.uk[k]:k);if(p&&typeof s==='string')s=s.replace(/\{(\w+)\}/g,function(m,x){return p[x]!=null?p[x]:m});return s}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var ROM=['','I','II','III','IV'];
function period(p){if(/Q/.test(p)){var a=p.split('-Q');return t('q',{q:cur==='en'?a[1]:ROM[a[1]],y:a[0]})}if(/^\d{4}$/.test(p))return t('yr',{y:p});var b=p.split('-');return t('mon')[+b[1]-1]+' '+b[0]}
function rlabel(r){return r?t('ty_'+r.type)+', '+period(r.period):''}
function fname(id,s){var f=Z.fop(id);return f?(s?f.short:f.name)[cur]:''}
function leftTxt(l){return l<0?t('l_over',{n:-l}):l===0?t('l_0'):l===1?t('l_1'):t('l_n',{n:l})}
var ICON={ok:'✓',docs:'◆',sign:'✎',over:'▲',draft:'○',signing:'✎',signed:'◆',submitted:'✓',filed:'✓',err:'!'};
function chip(kind,txt){return '<span class="chip c-'+kind+'"><span aria-hidden="true">'+ICON[kind]+'</span>'+esc(txt)+'</span>'}
function rchip(r){return chip(r.status,t('rs_'+r.status))}
function fchip(s){return chip(s,t('fs_'+s))}
function dlCell(r){if(!r)return '<span class="muted">'+t('none')+'</span>';var l=Z.left(r),c=r.status==='submitted'?'':l<0?' over':l<=1?' soon':l<=7?' week':'';return '<span class="dl'+c+'">'+Z.fmt(r.deadline)+'</span> <small class="muted">'+(r.status==='submitted'?'':leftTxt(l))+'</small>'}
function histTxt(e){var r=Z.rep(e.rid);return t(e.k,{r:rlabel(r),n:e.p?t('gt_'+e.n)+', '+period(e.p):e.n,d:Z.fmt(e.dd)})}
function ntTxt(n){var r=Z.rep(n.rid),p={r:rlabel(r),f:fname(n.fop,1),d:r?Z.fmt(r.deadline):'',n:n.kind,}; if(n.kind==='over')return t('nt_over',p);if(n.kind==='gen')return t('nt_gen',p);if(n.kind==='sub'){p.n=n.ref;return t('nt_sub',p)}if(n.kind==='man')return t('nt_man',p);return t('nt_rem',p)}
/* toast */
var toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.appendChild(toast);var tt;
function say(m){toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},3200)}
/* dialogs */
var opener=null;function openDlg(d){if(!d.open){opener=document.activeElement;d.showModal()}var f=d.querySelector('[autofocus],button,input,select,textarea,a');if(f)f.focus()}
function closeDlg(d){if(d.open)d.close()}
document.addEventListener('close',function(e){if(e.target.tagName==='DIALOG'&&opener&&document.contains(opener)){opener.focus();opener=null}},true);
document.addEventListener('click',function(e){var c=e.target.closest('[data-close]');if(c)closeDlg(c.closest('dialog'));if(e.target.tagName==='DIALOG')closeDlg(e.target)});
function dlg(id,cls){var d=document.getElementById(id);if(!d){d=document.createElement('dialog');d.id=id;d.className='dlg '+(cls||'');d.setAttribute('aria-labelledby',id+'-h');document.body.appendChild(d)}return d}
/* header */
var links=[['index.html','nav_home','home'],['dashboard.html','nav_dash','dash'],['accountant.html','nav_acc','acc'],['cabinet.html','nav_fop','fop']];
var nav=links.map(function(l){return '<a href="'+l[0]+'" data-i18n="'+l[1]+'"'+(l[2]===PAGE?' aria-current="page"':'')+'></a>'}).join('');
var hd=document.createElement('header');hd.id='top';
hd.innerHTML='<div class="wrap hbar"><a class="logo" href="index.html" aria-label="Звиток"><img src="assets/zvitok_B_horizontal_light.svg" alt="Звиток" width="105" height="40"></a><nav class="main cnav" aria-label="Звиток">'+nav+'</nav>'+
'<div class="bellw"><button class="bell" id="bell" aria-expanded="false" aria-controls="npanel"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg><span class="badge" id="nbadge" hidden></span><span class="sr" id="bell-l"></span></button>'+
'<div class="npanel" id="npanel" hidden><div class="nhead"><b data-i18n="bell"></b><button class="lnk" id="nall" data-i18n="n_all"></button></div><ul id="nlist"></ul></div></div>'+
'<div class="langs" role="group" aria-label="Language"><button data-lang="uk">UA</button><button data-lang="en">EN</button><button data-lang="ru">RU</button></div>'+
'<button class="burger" aria-expanded="false" aria-controls="mnav" data-i18n-aria="menu">☰</button></div><nav class="mnav" id="mnav" aria-label="Звиток">'+nav+'</nav>';
document.body.insertBefore(hd,document.body.firstChild);
var sk=document.createElement('a');sk.className='skip';sk.href='#main';sk.dataset.i18n='skip';document.body.insertBefore(sk,document.body.firstChild);
var rb=document.createElement('div');rb.className='ribbon';rb.dataset.i18n='ribbon';document.body.appendChild(rb);
/* demo bar + banner */
var bar=document.createElement('div');bar.className='demobar';
bar.innerHTML='<div class="wrap dbar"><label for="ddate"><span class="dtag">ДЕМО</span> <span data-i18n="demo_date"></span></label><input type="date" id="ddate" min="2026-01-01" max="2027-12-31">'+
'<div class="qbtns"><button class="sbtn" data-jump="1">+1</button><button class="sbtn" data-jump="3">+3</button><button class="sbtn" data-jump="7">+7</button><button class="sbtn" data-set="2026-11-01">01.11.2026</button><button class="sbtn" data-set="'+Z.BASE+'" data-i18n="dd_reset"></button></div>'+
'<div class="qbtns end"><button class="sbtn" id="setb" data-i18n="set_btn"></button><button class="sbtn" id="rst" data-i18n="reset_data"></button></div><p class="dhint" data-i18n="dd_hint"></p></div>'+
'<div class="banner" id="banner" role="alert" hidden></div>';
hd.after(bar);
var ft=document.createElement('footer');ft.className='cfoot';ft.innerHTML='<div class="wrap"><div class="fg"><div><img src="assets/zvitok_B_horizontal_dark.svg" alt="Звиток" width="105" height="40" style="height:40px;width:auto;margin-bottom:12px"><p data-i18n="ft_about"></p></div><div><h4 data-i18n="nav_home"></h4><p>'+links.map(function(l){return '<a href="'+l[0]+'" data-i18n="'+l[1]+'"></a>'}).join('<br>')+'</p></div><div><h4 data-i18n="ft_l"></h4><div class="flangs"><button data-lang="uk">Українська</button><button data-lang="en">English</button><button data-lang="ru">Русский</button></div></div></div><p class="disc" data-i18n="foot"></p></div>';
document.body.appendChild(ft);
function jump(d){var r=Z.setToday(d);if(r)say(t('tt_date',{d:Z.fmt(d),r:r.rem,g:r.gen}))}
bar.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.dataset.jump)jump(Z.add(Z.S.today,+b.dataset.jump));if(b.dataset.set)jump(b.dataset.set)});
document.getElementById('ddate').addEventListener('change',function(){if(this.value)jump(this.value)});
document.getElementById('rst').addEventListener('click',function(){if(confirm(t('reset_q'))){Z.reset();say(t('tt_reset'))}});
/* settings */
var sd=dlg('setdlg');
document.getElementById('setb').addEventListener('click',function(){var s=Z.S.settings;
 sd.innerHTML='<h2 id="setdlg-h">'+t('s_title')+'</h2><fieldset><legend>'+t('s_when')+'</legend>'+['o7','o3','o1'].map(function(k){return '<label class="tg"><input type="checkbox" data-s="'+k+'"'+(s[k]?' checked':'')+'> '+t('s_'+k)+'</label>'}).join('')+'</fieldset><fieldset><legend>'+t('s_ch')+'</legend>'+['app','email','tg'].map(function(k){return '<label class="tg"><input type="checkbox" data-s="'+k+'"'+(s[k]?' checked':'')+'> '+t('s_'+k)+'</label>'}).join('')+'</fieldset><p class="note">'+t('s_note')+'</p><div class="dact"><button class="btn btn-b" data-close>'+t('close')+'</button></div>';
 openDlg(sd)});
sd.addEventListener('change',function(e){var k=e.target.dataset.s;if(k){Z.S.settings[k]=e.target.checked;Z.remind();Z.emit()}});
/* notifications */
var bell=document.getElementById('bell'),np=document.getElementById('npanel');
function mine(){return Z.S.notifs.filter(function(n){return n.aud===AUD&&(AUD==='acc'||n.fop===Z.CAB_FOP)})}
function repLink(n){return (AUD==='fop'?'cabinet.html#reports':'accountant.html#r-'+n.rid)}
function renderN(){var L=mine(),u=L.filter(function(n){return !n.read}).length,b=document.getElementById('nbadge');b.hidden=!u;b.textContent=u>99?'99+':u;
 document.getElementById('bell-l').textContent=t('bell')+'. '+t('n_unread',{n:u});
 document.getElementById('nlist').innerHTML=L.length?L.slice(0,40).map(function(n){var k=n.kind==='over'?'over':n.kind===1?'soon':n.kind==='gen'?'gen':n.kind==='sub'?'sub':'rem';
  return '<li class="ni'+(n.read?'':' unread')+'"><span class="nk k-'+k+'" aria-hidden="true">'+(k==='over'?'▲':k==='gen'?'＋':k==='sub'?'✓':'●')+'</span><div><p>'+esc(ntTxt(n))+'</p><small>'+Z.fmt(n.d)+(n.kind>0?' · '+n.kind+' / 7·3·1':'')+'</small><div class="nacts"><a href="'+repLink(n)+'" data-nid="'+n.id+'">'+t('n_open')+'</a>'+(n.read?'':'<button class="lnk" data-read="'+n.id+'">'+t('n_read')+'</button>')+'</div></div></li>'}).join(''):'<li class="nempty">'+t('n_empty')+'</li>'}
function setN(o){np.hidden=!o;bell.setAttribute('aria-expanded',o);if(o){var f=np.querySelector('button,a');if(f)f.focus()}}
bell.addEventListener('click',function(e){e.stopPropagation();setN(np.hidden)});
np.addEventListener('click',function(e){e.stopPropagation();var r=e.target.dataset.read||e.target.dataset.nid;if(r){Z.S.notifs.forEach(function(n){if(n.id===r)n.read=true});Z.emit();if(e.target.dataset.read){var f=np.querySelector('[data-read],a');if(f)f.focus()}else setN(false)}});
document.getElementById('nall').addEventListener('click',function(){mine().forEach(function(n){n.read=true});Z.emit()});
document.addEventListener('click',function(){if(!np.hidden)setN(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!np.hidden){setN(false);bell.focus()}});
function renderBanner(){var U=Z.S.reports.filter(function(r){return r.status!=='submitted'&&Z.left(r)<=1&&(AUD==='acc'||r.fop===Z.CAB_FOP)}).sort(function(a,b){return a.deadline<b.deadline?-1:1});var b=document.getElementById('banner');b.hidden=!U.length;
 b.innerHTML=U.length?'<div class="wrap"><b><span aria-hidden="true">▲</span> '+t('ban')+': '+U.length+'</b><ul>'+U.slice(0,6).map(function(r){return '<li>'+(AUD==='acc'?esc(fname(r.fop,1))+': ':'')+esc(rlabel(r))+', '+Z.fmt(r.deadline)+' ('+leftTxt(Z.left(r))+')</li>'}).join('')+'</ul></div>':''}
/* auto submission */
var sbd=dlg('subdlg','wide');
function openSubmit(rid){var r=Z.rep(rid);if(!r||r.status==='submitted')return;var ch=r.type==='esv'?'ch_pfu':'ch_dps';
 sbd.innerHTML='<h2 id="subdlg-h">'+t('sb_title')+'</h2><p class="warn"><span class="dtag">ДЕМО</span> '+t('sb_warn')+'</p><dl class="kv"><dt>'+t('lg_fop')+'</dt><dd>'+esc(fname(r.fop))+'</dd><dt>'+t('sb_doc')+'</dt><dd>'+esc(rlabel(r))+'</dd><dt>'+t('sb_ch')+'</dt><dd>'+t(ch)+'</dd></dl>'+
 '<label class="tg"><input type="checkbox" id="simerr"'+(Z.S.simErr?' checked':'')+'> '+t('sim_err')+'</label><ol class="steps2" id="steps">'+[1,2,3,4].map(function(i){return '<li data-st="'+i+'"><span class="si" aria-hidden="true"></span>'+t('st'+i)+'</li>'}).join('')+'</ol><div id="subout" aria-live="polite"></div><div class="dact" id="subact"><button class="btn btn-o" data-close>'+t('cancel')+'</button><button class="btn btn-y" id="subgo">'+t('sb_go')+'</button></div>';
 openDlg(sbd);sbd.querySelector('#simerr').addEventListener('change',function(){Z.S.simErr=this.checked;Z.save()});
 sbd.querySelector('#subgo').addEventListener('click',function(){run(r)})}
function run(r){var act=sbd.querySelector('#subact'),out=sbd.querySelector('#subout'),S=sbd.querySelectorAll('[data-st]');act.innerHTML='';out.innerHTML='';S.forEach(function(s){s.className=''});var fail=Z.S.simErr&&!r.failed,i=0;
 (function step(){if(i>0)S[i-1].className='done';if(i===4){var x=Z.submit(r.id,'auto');out.innerHTML='<div class="receipt"><h3>'+t('rc_title')+'</h3><dl class="kv"><dt>'+t('rc_no')+'</dt><dd><b>'+esc(x.ref)+'</b></dd><dt>'+t('rc_time')+'</dt><dd>'+Z.fmt(x.subAt.slice(0,10))+' '+x.subAt.slice(11)+'</dd><dt>'+t('rc_st')+'</dt><dd>'+chip('submitted',t('rc_ok'))+'</dd></dl></div>';
   act.innerHTML='<button class="btn btn-o" id="rcdl">'+t('rc_dl')+'</button><button class="btn btn-b" data-close>'+t('close')+'</button>';act.querySelector('#rcdl').addEventListener('click',function(){receiptFile(x)});act.querySelector('[data-close]').focus();return}
  S[i].className='act';if(i===2&&fail){setTimeout(function(){S[2].className='fail';Z.failLog(r.id);out.innerHTML='<p class="warn">'+chip('err',t('lg_fail'))+' '+t('sb_err')+'</p>';act.innerHTML='<button class="btn btn-o" data-close>'+t('close')+'</button><button class="btn btn-y" id="retry">'+t('retry')+'</button>';var rb=act.querySelector('#retry');rb.focus();rb.addEventListener('click',function(){run(Z.rep(r.id))})},500);return}
  i++;setTimeout(step,/shot/.test(location.search)?60:550)})()}
function dlFile(name,text,mime){var b=new Blob([text],{type:(mime||'text/plain')+';charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
function receiptFile(x){var f=Z.fop(x.fop);dlFile('zvitok_demo_receipt_'+x.id+'.txt',t('pv_txt',{t:t('rc_title')+' · '+rlabel(x),f:f.name[cur],c:f.code,d:x.subAt,s:t('rc_ok')})+'\n'+t('rc_no')+': '+x.ref+'\n')}
/* language */
function apply(){var tr=D[cur];document.documentElement.lang=cur;
 document.querySelectorAll('[data-i18n]').forEach(function(e){e.textContent=t(e.dataset.i18n)});
 document.querySelectorAll('[data-i18n-ph]').forEach(function(e){e.placeholder=t(e.dataset.i18nPh)});
 document.querySelectorAll('[data-i18n-aria]').forEach(function(e){e.setAttribute('aria-label',t(e.dataset.i18nAria))});
 document.querySelectorAll('[data-lang]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.lang===cur)});
 document.title=t(document.body.dataset.title)}
function setLang(l){cur=D[l]?l:'uk';try{localStorage.setItem(KEY,cur)}catch(e){}apply();render()}
document.addEventListener('click',function(e){var b=e.target.closest('[data-lang]');if(b)setLang(b.dataset.lang)});
var bg=hd.querySelector('.burger'),mn=document.getElementById('mnav');bg.addEventListener('click',function(){var o=mn.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
addEventListener('scroll',function(){hd.classList.toggle('scrolled',scrollY>8)},{passive:true});
var api=window.ZU={t:t,esc:esc,period:period,rlabel:rlabel,fname:fname,leftTxt:leftTxt,chip:chip,rchip:rchip,fchip:fchip,dlCell:dlCell,histTxt:histTxt,say:say,openDlg:openDlg,closeDlg:closeDlg,dlg:dlg,openSubmit:openSubmit,dlFile:dlFile,lang:function(){return cur},render:null};
function render(){document.getElementById('ddate').value=Z.S.today;renderN();renderBanner();if(api.render)api.render()}
Z.on(render);
var saved;try{saved=localStorage.getItem(KEY)}catch(e){}cur=new URLSearchParams(location.search).get('lang')||saved||'uk';if(!D[cur])cur='uk';
if(/shot/.test(location.search))document.documentElement.classList.add('shot');
api.start=function(){apply();render()};
})();
