/* Звиток demo: FOP profile editor, document templates, A4 print view (demo templates, not official forms) */
(function(){var Z=ZV,U=ZU,t=U.t,e=U.esc,$=function(i){return document.getElementById(i)};
var pd=U.dlg('profdlg'),gd=U.dlg('gendlg'),dv=U.dlg('docdlg','docv');
var F=['name','code','group','addr','phone','email','bankName','iban','mfo','kved'],LB={bankName:'pf_bank'};
var RX={code:/^(\d{8}|\d{10})$/,phone:/^\+380\d{9}$/,email:/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,iban:/^UA\d{27}$/,mfo:/^\d{6}$/,kved:/^\d{2}\.\d{2}(\s*,\s*\d{2}\.\d{2})*$/};
function norm(k,v){v=String(v==null?'':v).trim();if(k==='phone')return v.replace(/[\s()-]/g,'');if(k==='iban')return v.replace(/\s/g,'').toUpperCase();return v}
function check(p){var E={};F.forEach(function(k){var v=norm(k,p[k]);
 if(k==='name'&&v.length<5)E[k]='e_name';else if(k==='group'&&['1','2','3'].indexOf(String(v))<0)E[k]='e_code';else if((k==='addr'||k==='bankName')&&v.length<3)E[k]=k==='addr'?'e_addr':'e_bank';else if(RX[k]&&!RX[k].test(v))E[k]='e_'+k});return E}
U.profValid=function(fid){return !Object.keys(check(Z.S.prof[fid])).length};
function money(x){var L=U.lang(),s=Number(x).toLocaleString(L==='en'?'en-US':'uk-UA',{minimumFractionDigits:2,maximumFractionDigits:2});return L==='en'?'UAH '+s:s.replace(/\u202f|\u00a0/g,' ')+' грн'}
U.money=money;
/* profile editor */
U.openProfile=function(fid){var p=Z.S.prof[fid];
 pd.innerHTML='<div class="dh"><h2 id="profdlg-h">'+t('pf_title')+'</h2><button class="x" data-close aria-label="'+t('close')+'">✕</button></div><p class="muted">'+t('pf_lead')+'</p><form id="pform" class="pform" novalidate>'+F.map(function(k){var id='pf-'+k,lb=t(LB[k]||'pf_'+k);
  var inp=k==='group'?'<select id="'+id+'" name="'+k+'">'+[1,2,3].map(function(g){return '<option value="'+g+'"'+(+p.group===g?' selected':'')+'>'+t('g_n',{n:g})+'</option>'}).join('')+'</select>':'<input id="'+id+'" name="'+k+'" value="'+e(p[k])+'"'+(k==='email'?' type="email" autocomplete="email"':k==='phone'?' type="tel" autocomplete="tel"':'')+' aria-describedby="'+id+'-e">';
  return '<div class="fld'+(k==='name'||k==='addr'?' wide':'')+'"><label for="'+id+'">'+lb+'</label>'+inp+'<p class="err" id="'+id+'-e"></p></div>'}).join('')+
 '<p class="err wide" id="pf-all" role="alert"></p><div class="dact wide"><button type="button" class="btn btn-o" data-close>'+t('cancel')+'</button><button class="btn btn-b">'+t('pf_save')+'</button></div></form>';
 U.openDlg(pd);
 $('pform').onsubmit=function(ev){ev.preventDefault();var n={};F.forEach(function(k){n[k]=norm(k,$('pf-'+k).value)});n.group=+n.group;var E=check(n),first=null;
  F.forEach(function(k){var i=$('pf-'+k),m=$('pf-'+k+'-e');m.textContent=E[k]?t(E[k]):'';i.setAttribute('aria-invalid',!!E[k]);if(E[k]&&!first)first=i});
  if(first){$('pf-all').textContent=t('e_fix');first.focus();return}
  Z.saveProf(fid,n);U.closeDlg(pd);U.say(t('tt_prof'))}};
/* generation dialog */
function types(fid){var g=Z.fop(fid).group;return ['ep'+g,'df4','esv','pay']}
function periods(type){var o=[];if(type==='ep1'||type==='ep2')o=['2025','2026'];else if(type==='ep3'||type==='df4')o=['2025-Q4','2026-Q1','2026-Q2','2026-Q3'];else for(var m=1;m<=10;m++)o.push('2026-'+(m<10?'0':'')+m);return o}
function defPer(type){if(type==='ep1'||type==='ep2')return '2025';if(type==='ep3'||type==='df4')return '2026-Q3';return Z.S.today<'2026-11-01'?Z.S.today.slice(0,7):'2026-10'}
function inpHtml(fid,type){var d=Z.defInp(Z.fop(fid),type);
 if(/^ep/.test(type))return '<label for="g-inc">'+t('g_income')+'</label><input id="g-inc" inputmode="decimal" value="'+d.income+'" aria-describedby="g-err">';
 if(type==='df4')return '<label for="g-pay">'+t('g_pay')+'</label><input id="g-pay" value="'+d.pay.join(', ')+'" aria-describedby="g-err">';
 if(type==='esv')return '<label for="g-base">'+t('g_base')+'</label><input id="g-base" inputmode="decimal" value="'+d.base+'" aria-describedby="g-err">';
 return '<label for="g-what">'+t('g_what')+'</label><select id="g-what"><option value="ep"'+(d.what==='ep'?' selected':'')+'>'+t('pw_ep')+'</option><option value="esv"'+(d.what==='esv'?' selected':'')+'>'+t('pw_esv')+'</option></select>'}
U.openGen=function(fid,type){var T=types(fid);type=T.indexOf(type)>=0?type:T[0];var ok=U.profValid(fid);
 gd.innerHTML='<div class="dh"><h2 id="gendlg-h">'+t('g_title')+'</h2><button class="x" data-close aria-label="'+t('close')+'">✕</button></div><p class="warn"><span class="dtag">ДЕМО</span> '+t('dv_warn')+'</p><p><b>'+e(U.fname(fid))+'</b> · '+t('g_n',{n:Z.fop(fid).group})+'</p>'+
 (ok?'':'<p class="warn" role="alert">'+t('g_bad')+' <button type="button" class="lnk" id="g-fix">'+t('edit_prof')+'</button></p>')+
 '<form id="gform" novalidate><label for="g-type">'+t('g_type')+'</label><select id="g-type">'+T.map(function(x){return '<option value="'+x+'"'+(x===type?' selected':'')+'>'+t('gt_'+x)+'</option>'}).join('')+'</select>'+
 '<label for="g-per" style="margin-top:12px">'+t('g_period')+'</label><select id="g-per">'+periods(type).map(function(p){return '<option value="'+p+'"'+(p===defPer(type)?' selected':'')+'>'+e(U.period(p))+'</option>'}).join('')+'</select>'+
 '<div id="g-inp" style="margin-top:12px">'+inpHtml(fid,type)+'</div><p class="err" id="g-err" role="alert"></p><p class="note">'+t('g_note')+'</p><div class="dact"><button type="button" class="btn btn-o" data-close>'+t('cancel')+'</button><button class="btn btn-y" id="g-go"'+(ok?'':' disabled')+'>'+t('g_go')+'</button></div></form>';
 U.openDlg(gd);
 if(!ok)$('g-fix').onclick=function(){U.closeDlg(gd);U.openProfile(fid)};
 $('g-type').onchange=function(){U.openGen(fid,this.value);$('g-type').focus()};
 $('gform').onsubmit=function(ev){ev.preventDefault();if(!U.profValid(fid))return;var ty=$('g-type').value,inp={},err='';
  if(/^ep/.test(ty)){var v=parseFloat($('g-inc').value.replace(/\s/g,'').replace(',','.'));if(!(v>=0))err='e_inc';inp.income=v}
  else if(ty==='df4'){var a=$('g-pay').value.split(/[,;]/).map(function(x){return parseFloat(x.replace(/\s/g,''))});if(!a.length||a.some(function(x){return !(x>=0)}))err='e_pay';inp.pay=a}
  else if(ty==='esv'){var b=parseFloat($('g-base').value.replace(/\s/g,'').replace(',','.'));if(!(b>=0))err='e_inc';inp.base=b}
  else inp.what=$('g-what').value;
  if(err){$('g-err').textContent=t(err);gd.querySelector('#g-inp input').setAttribute('aria-invalid','true');gd.querySelector('#g-inp input').focus();return}
  var d=Z.genDoc(fid,ty,$('g-per').value,inp);U.closeDlg(gd);U.say(t('tt_gen'));U.openDoc(d.id)}};
/* A4 view */
function val(k,v){if(typeof v==='number')return k==='c_emp'?v:money(v);if(/^pw_/.test(v))return t(v);return e(v)}
function sheet(d){var g=d.gen,p=g.snap,c=Z.calc(d),r=d.rid?Z.rep(d.rid):null,L=U.lang();
 var rows=[['pf_name',p.name],['pf_code',p.code],['pf_group',t('g_n',{n:p.group})],['pf_addr',p.addr],['pf_kved',p.kved],['pf_phone',p.phone],['pf_email',p.email],['pf_bank',p.bankName],['pf_iban',p.iban.replace(/(.{4})/g,'$1 ').trim()],['pf_mfo',p.mfo]];
 return '<article class="a4" lang="'+L+'"><div class="wm" aria-hidden="true">ДЕМО</div><header class="a4h"><img src="assets/zvitok_B_horizontal_light.svg" alt="Звиток" width="105" height="40"><div class="a4w"><b>'+t('dv_warn')+'</b>'+(t('dv_warn2')?'<br><span>'+t('dv_warn2')+'</span>':'')+'</div></header>'+
 '<h1>'+e(t('gt_'+g.type))+'</h1><table class="a4m"><tr><th>'+t('dv_no')+'</th><td>'+e(g.no)+' ('+t('dv_ver',{n:g.ver})+')</td><th>'+t('dv_date')+'</th><td>'+Z.fmt(g.at)+'</td></tr><tr><th>'+t('dv_period')+'</th><td>'+e(U.period(g.period))+'</td><th>'+t('dv_status')+'</th><td>'+U.chip(d.status,t('ds_'+d.status))+'</td></tr>'+(r?'<tr><th>'+t('dv_rep')+'</th><td colspan="3">'+e(U.rlabel(r))+', '+t('dv_due')+': '+Z.fmt(r.deadline)+(r.ref?' · '+e(r.ref):'')+'</td></tr>':'')+'</table>'+
 '<h2>'+t('dv_payer')+'</h2><table class="a4t">'+rows.map(function(x){return '<tr><th>'+t(x[0])+'</th><td>'+e(x[1])+'</td></tr>'}).join('')+'</table>'+
 (g.type==='df4'?'<h2>'+t('dv_staff')+'</h2><table class="a4t">'+g.inp.pay.map(function(s,i){return '<tr><th>'+t('dv_emp',{n:i+1})+'</th><td>'+money(s)+' '+t('dv_mon')+'</td></tr>'}).join('')+'</table>':'')+
 (g.type==='pay'?'<h2>'+t('dv_recv')+'</h2><p>'+t('dv_recv_v')+'</p>':'')+
 '<h2>'+t('dv_calc')+'</h2><table class="a4t calc">'+c.rows.map(function(x){return '<tr><th>'+t(x[0])+'</th><td>'+val(x[0],x[1])+'</td></tr>'}).join('')+'<tr class="tot"><th>'+t('dv_total')+'</th><td>'+money(c.total)+'</td></tr></table>'+
 (g.over?'<p class="a4warn"><span aria-hidden="true">▲</span> '+t('dv_over')+'</p>':'')+
 '<div class="a4s"><div>'+t('dv_sign')+'<span class="ln"></span>'+e(p.name)+'</div><div>'+t('dv_date')+'<span class="ln"></span>'+Z.fmt(g.at)+'</div></div><p class="a4p">'+t('dv_params')+'</p></article>'}
var cur=null;
function build(id){var d=Z.S.docs.filter(function(x){return x.id===id})[0];if(!d||!d.gen)return false;cur=id;var r=d.rid?Z.rep(d.rid):null;
 dv.innerHTML='<div class="dvbar"><h2 id="docdlg-h">'+e(t(d.tk))+', '+e(U.period(d.gen.period))+'</h2><div class="acts">'+(r&&r.status!=='submitted'?'<button class="btn btn-y" id="dv-sub">'+t('sb_btn')+'</button>':'')+'<button class="btn btn-o" id="dv-dl">'+t('dv_dl')+'</button><button class="btn btn-b" id="dv-pr">'+t('dv_print')+'</button><button class="btn btn-o" data-close>'+t('close')+'</button></div></div><div class="dvwrap">'+sheet(d)+'</div>';
 $('dv-pr').onclick=function(){window.print()};
 $('dv-dl').onclick=function(){U.docFile(d.id)};
 if($('dv-sub'))$('dv-sub').onclick=function(){U.closeDlg(dv);U.openSubmit(d.rid)};return true}
U.docFile=function(id){var d=Z.S.docs.filter(function(x){return x.id===id})[0];var css=[].map.call(document.styleSheets,function(s){try{return [].map.call(s.cssRules,function(r){return r.cssText}).join('\n')}catch(x){return ''}}).join('\n');
  U.dlFile('zvitok_demo_'+d.gen.type+'_'+d.gen.period+'.html','<!doctype html><html lang="'+U.lang()+'"><head><meta charset="utf-8"><title>'+e(t(d.tk))+'</title><style>'+css+'</style></head><body class="dvfile"><div class="dvwrap">'+sheet(d)+'</div></body></html>','text/html')};
U.openDoc=function(id){if(build(id))U.openDlg(dv)};
dv.addEventListener('close',function(){cur=null});
addEventListener('beforeprint',function(){document.body.classList.toggle('printing',!!(dv.open))});
addEventListener('afterprint',function(){document.body.classList.remove('printing')});
Z.on(function(){if(cur&&dv.open){var s=dv.scrollTop;build(cur);dv.scrollTop=s}});
document.addEventListener('click',function(ev){var b=ev.target.closest('[data-gen],[data-prof],[data-doc]');if(!b)return;if(b.dataset.gen)U.openGen(b.dataset.gen);else if(b.dataset.prof)U.openProfile(b.dataset.prof);else U.openDoc(b.dataset.doc)});
})();
