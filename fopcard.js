/* Звиток demo: FOP card dialog and counters shared by accountant pages */
(function(){var Z=ZV,U=ZU,t=U.t,e=U.esc,cd=U.dlg('fopdlg','side'),openId=null;
function stats(){var R=Z.S.reports.filter(function(r){return r.status!=='submitted'});
 return {total:Z.FOPS.length,over:R.filter(function(r){return Z.left(r)<0}).length,week:R.filter(function(r){var l=Z.left(r);return l>=0&&l<=7}).length,sign:R.filter(function(r){return r.status==='signing'}).length,auto:R.filter(function(r){return r.auto&&r.status==='draft'}).length}}
U.stats=stats;
U.counters=function(el,keys){var s=stats(),M={total:['c_total','b'],over:['c_over','o'],week:['c_week','y'],sign:['c_sign','g'],auto:['d_auto','g']};
 el.innerHTML=(keys||['total','over','week','sign']).map(function(k){return '<div class="cnt c'+M[k][1]+'"><small>'+t(M[k][0])+'</small><b>'+s[k]+'</b></div>'}).join('')};
U.repActions=function(r,compact){if(r.status==='submitted')return '<small class="muted">'+e(r.ref||'')+'</small>';
 return (compact?'':'<span class="mv"><label class="sr" for="mv-'+r.id+'">'+t('new_dl')+'</label><input type="date" id="mv-'+r.id+'" value="'+r.deadline+'"><button class="sbtn" data-move="'+r.id+'">'+t('move')+'</button></span>')+
 '<button class="sbtn" data-mark="'+r.id+'">'+t('mark')+'</button><button class="sbtn y" data-sub="'+r.id+'">'+t('sb_btn')+'</button>'};
U.bindActions=function(root){root.addEventListener('click',function(ev){var b=ev.target.closest('button');if(!b)return;var d=b.dataset;
 if(d.move){var v=document.getElementById('mv-'+d.move).value;if(v){Z.setDeadline(d.move,v);U.say(t('tt_saved'))}}
 else if(d.mark){Z.submit(d.mark,'manual');U.say(t('tt_marked'))}
 else if(d.sub)U.openSubmit(d.sub);
 else if(d.sign){Z.setStatus(d.sign,'signed','h_sign');U.say(t('tt_signed'))}
 else if(d.review){Z.setStatus(d.review,'signing','h_review');U.say(t('tt_review'))}
 else if(d.remind){var r=Z.rep(d.remind);Z.notify('fop',r.fop,r.id,'man');Z.hist(r.fop,{k:'h_man',rid:r.id});Z.emit();U.say(t('tt_remind'))}
 else if(d.card)U.openCard(d.card)})};
function body(id){var f=Z.fop(id),L=U.lang(),R=Z.S.reports.filter(function(r){return r.fop===id}).sort(function(a,b){return (a.status==='submitted')-(b.status==='submitted')||(a.deadline<b.deadline?-1:1)});
 var docs=Z.S.docs.filter(function(d){return d.fop===id}),H=(Z.S.hist[id]||[]).slice().sort(function(a,b){return a.d<b.d?1:a.d>b.d?-1:0});
 return '<div class="dh"><div><h2 id="fopdlg-h">'+e(f.name[L])+'</h2>'+U.fchip(Z.fopStatus(id))+'</div><button class="x" data-close aria-label="'+t('close')+'">✕</button></div>'+
 '<dl class="kv two"><dt>'+t('th_code')+'</dt><dd>'+f.code+'</dd><dt>'+t('cd_group')+'</dt><dd>'+t('g_n',{n:f.group})+'</dd><dt>'+t('cd_tax')+'</dt><dd>'+t('tax_ep',{n:f.group})+'</dd><dt>'+t('cd_kved')+'</dt><dd>'+f.kved.join(', ')+'</dd><dt>'+t('cd_bank')+'</dt><dd>'+e(f.bank)+'</dd><dt>'+t('cd_contacts')+'</dt><dd>'+f.phone+'<br><a href="mailto:'+f.email+'">'+f.email+'</a></dd><dt>'+t('cd_reg')+'</dt><dd>'+Z.fmt(f.reg)+'</dd></dl>'+
 '<h3>'+t('cd_up')+'</h3><ul class="clist">'+R.map(function(r){return '<li><div><b>'+e(U.rlabel(r))+'</b>'+(r.auto?' <span class="abadge">'+t('auto_b')+'</span>':'')+'<br>'+U.dlCell(r)+' '+U.rchip(r)+'</div><div class="acts">'+U.repActions(r,true)+'</div></li>'}).join('')+'</ul>'+
 '<h3>'+t('cd_docs')+'</h3><ul class="clist">'+docs.map(function(d){var r=Z.rep(d.rid);return '<li><div>'+e(t(d.tk,{r:U.rlabel(r)}))+'<br><small class="muted">'+Z.fmt(d.date)+'</small></div>'+U.chip(d.status,t('ds_'+d.status))+'</li>'}).join('')+'</ul>'+
 '<h3>'+t('cd_hist')+'</h3><ol class="tl">'+H.map(function(h){return '<li><time>'+Z.fmt(h.d)+'</time> '+e(U.histTxt(h))+'</li>'}).join('')+'</ol>'}
U.openCard=function(id){openId=id;cd.innerHTML=body(id);U.openDlg(cd)};
cd.addEventListener('close',function(){openId=null});U.bindActions(cd);
ZV.on(function(){if(openId&&cd.open){var s=cd.scrollTop;cd.innerHTML=body(openId);cd.scrollTop=s}});
})();
