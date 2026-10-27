(function(){var Z=ZV,U=ZU,t=U.t,e=U.esc,g=document.getElementById('dgrid');
function item(r,btns){return '<li><div><button class="lnk strong" data-card="'+r.fop+'">'+e(U.fname(r.fop,1))+'</button><br>'+e(U.rlabel(r))+(r.auto?' <span class="abadge">'+t('auto_b')+'</span>':'')+'<br>'+U.dlCell(r)+' '+U.rchip(r)+'</div><div class="acts">'+btns+'</div></li>'}
function box(k,cls,list,fn){return '<div class="panel dbox '+cls+'"><h2 class="h3">'+t(k)+' <span class="num">'+list.length+'</span></h2>'+(list.length?'<ul class="clist">'+list.map(fn).join('')+'</ul>':'<p class="muted">'+t('empty')+'</p>')+'</div>'}
function sub(r){return '<button class="sbtn y" data-sub="'+r.id+'">'+t('sb_btn')+'</button>'}
function rem(r){return '<button class="sbtn" data-remind="'+r.id+'">'+t('act_remind')+'</button>'}
U.render=function(){U.counters(document.getElementById('counters'),['over','week','sign','auto']);
 var R=Z.S.reports.filter(function(r){return r.status!=='submitted'}).sort(function(a,b){return a.deadline<b.deadline?-1:a.deadline>b.deadline?1:0});
 var over=R.filter(function(r){return Z.left(r)<0}),wk=R.filter(function(r){var l=Z.left(r);return l>=0&&l<=7}),sg=R.filter(function(r){return r.status==='signing'}),au=R.filter(function(r){return r.auto&&r.status==='draft'});
 g.innerHTML=box('d_over','o',over,function(r){return item(r,rem(r)+sub(r))})+box('d_week','y',wk,function(r){return item(r,rem(r)+sub(r))})+
  box('d_unsigned','g',sg,function(r){return item(r,'<button class="sbtn" data-sign="'+r.id+'">'+t('act_sign')+'</button>'+sub(r))})+box('d_auto','g',au,function(r){return item(r,'<button class="sbtn" data-review="'+r.id+'">'+t('act_review')+'</button>'+sub(r))})+
  '<div class="panel dbox wide"><h2 class="h3">'+t('d_log')+'</h2><ul class="clist">'+Z.S.log.slice(0,5).map(function(l){var r=Z.rep(l.rid);return '<li><div><b>'+e(U.fname(l.fop,1))+'</b>: '+e(U.rlabel(r))+'<br><small class="muted">'+Z.fmt(l.ts.slice(0,10))+' '+l.ts.slice(11)+' · '+t(l.ch==='pfu'?'ch_pfu':'ch_dps')+' · '+(l.ref||'')+'</small></div>'+(l.ok?U.chip('submitted',t('rc_ok')):U.chip('err',t('lg_fail')))+'</li>'}).join('')+'</ul><a class="btn btn-o" href="accountant.html#log">'+t('all_log')+'</a></div>'};
U.bindActions(g);U.start();
})();
