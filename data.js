/* Звиток demo: shared demo data, state and automation engine (all fictional, no network) */
(function(){
var KEY='zvitok_demo_v2',BASE='2026-10-27';
function dn(s){var p=s.split('-');return Date.UTC(+p[0],p[1]-1,+p[2])/864e5}
function ds(n){return new Date(n*864e5).toISOString().slice(0,10)}
function add(s,k){return ds(dn(s)+k)}
function fmt(s){if(!s)return '';var p=s.split('-');return p[2]+'.'+p[1]+'.'+p[0]}
var FOPS=[
{id:'f1',name:{uk:'ФОП Іваненко Олена Петрівна',en:'FOP Olena Ivanenko',ru:'ФОП Иваненко Елена Петровна'},short:{uk:'Іваненко О. П.',en:'Ivanenko O.',ru:'Иваненко Е. П.'},code:'90000101',group:3,emp:true,kved:['62.01','62.02','73.11'],bank:'ДемоБанк · UA00 0000 0000 0000 0000 0000 101',phone:'+380 00 000 01 01',email:'olena.ivanenko@example.com',reg:'2021-03-15',needDocs:false},
{id:'f2',name:{uk:'ФОП Коваль Максим Ігорович',en:'FOP Maksym Koval',ru:'ФОП Коваль Максим Игоревич'},short:{uk:'Коваль М. І.',en:'Koval M.',ru:'Коваль М. И.'},code:'90000102',group:2,emp:true,kved:['56.10','47.24'],bank:'ТестБанк · UA00 0000 0000 0000 0000 0000 102',phone:'+380 00 000 01 02',email:'m.koval@example.com',reg:'2019-07-01',needDocs:false},
{id:'f3',name:{uk:'ФОП Шевчук Дарина Олегівна',en:'FOP Daryna Shevchuk',ru:'ФОП Шевчук Дарина Олеговна'},short:{uk:'Шевчук Д. О.',en:'Shevchuk D.',ru:'Шевчук Д. О.'},code:'90000103',group:3,emp:false,kved:['74.10','58.19'],bank:'ДемоБанк · UA00 0000 0000 0000 0000 0000 103',phone:'+380 00 000 01 03',email:'daryna.sh@example.com',reg:'2022-11-02',needDocs:true},
{id:'f4',name:{uk:'ФОП Бондаренко Андрій Васильович',en:'FOP Andrii Bondarenko',ru:'ФОП Бондаренко Андрей Васильевич'},short:{uk:'Бондаренко А. В.',en:'Bondarenko A.',ru:'Бондаренко А. В.'},code:'90000104',group:1,emp:false,kved:['95.23'],bank:'ТестБанк · UA00 0000 0000 0000 0000 0000 104',phone:'+380 00 000 01 04',email:'a.bondarenko@example.com',reg:'2023-02-20',needDocs:false},
{id:'f5',name:{uk:'ФОП Мельник Ірина Сергіївна',en:'FOP Iryna Melnyk',ru:'ФОП Мельник Ирина Сергеевна'},short:{uk:'Мельник І. С.',en:'Melnyk I.',ru:'Мельник И. С.'},code:'90000105',group:3,emp:true,kved:['85.59','85.52'],bank:'ДемоБанк · UA00 0000 0000 0000 0000 0000 105',phone:'+380 00 000 01 05',email:'iryna.melnyk@example.com',reg:'2020-09-10',needDocs:false},
{id:'f6',name:{uk:'ФОП Ткаченко Богдан Миколайович',en:'FOP Bohdan Tkachenko',ru:'ФОП Ткаченко Богдан Николаевич'},short:{uk:'Ткаченко Б. М.',en:'Tkachenko B.',ru:'Ткаченко Б. Н.'},code:'90000106',group:2,emp:false,kved:['96.02'],bank:'ТестБанк · UA00 0000 0000 0000 0000 0000 106',phone:'+380 00 000 01 06',email:'b.tkachenko@example.com',reg:'2024-04-05',needDocs:true}];
var ACC={name:{uk:'Петренко Марія Олександрівна',en:'Mariia Petrenko',ru:'Петренко Мария Александровна'},phone:'+380 00 000 00 77',email:'m.petrenko@example.com',hours:{uk:'Пн–Пт, 09:00–18:00',en:'Mon–Fri, 09:00–18:00',ru:'Пн–Пт, 09:00–18:00'}};
function types(f){var t=['esv'];if(f.group===3)t.unshift('ep');if(f.emp)t.push('df4');return t}
function seed(){
 var R=[],H={},D=[],i=0;
 function r(f,type,period,dl,st,o){var x={id:'r'+(++i),fop:f,type:type,period:period,deadline:dl,status:st,auto:!!(o&&o.auto),ref:o&&o.ref||'',subAt:o&&o.subAt||''};R.push(x);return x}
 r('f1','ep','2026-Q3','2026-11-09','signing');r('f1','df4','2026-Q3','2026-11-09','draft',{auto:1});r('f1','esv','2026-09','2026-10-20','submitted',{ref:'ДЕМО-ПФУ-00419201',subAt:'2026-10-14 11:20'});
 r('f2','df4','2026-Q3','2026-10-29','draft');r('f2','esv','2026-09','2026-10-20','submitted',{ref:'ДЕМО-ПФУ-00419277',subAt:'2026-10-16 15:02'});
 r('f3','ep','2026-Q3','2026-11-09','draft',{auto:1});r('f3','esv','2026-09','2026-10-20','submitted',{ref:'ДЕМО-ПФУ-00419312',subAt:'2026-10-17 10:45'});
 r('f4','esv','2026-09','2026-10-20','draft');
 r('f5','ep','2026-Q3','2026-11-09','submitted',{ref:'ДЕМО-ДПС-00733105',subAt:'2026-10-22 12:10'});r('f5','df4','2026-Q3','2026-11-09','signing');r('f5','esv','2026-09','2026-10-20','submitted',{ref:'ДЕМО-ПФУ-00419350',subAt:'2026-10-18 09:30'});
 r('f6','esv','2026-09','2026-10-28','draft');
 FOPS.forEach(function(f,k){H[f.id]=[{d:f.reg,k:'h_reg'}];
  D.push({id:'d'+f.id+'a',fop:f.id,cat:'reg',tk:'d_edr',date:f.reg,status:'signed'},{id:'d'+f.id+'b',fop:f.id,cat:'reg',tk:'d_ep',date:add(f.reg,10),status:'signed'},
   {id:'d'+f.id+'c',fop:f.id,cat:'contr',tk:'d_c1',date:'2026-01-12',status:'signed'},{id:'d'+f.id+'e',fop:f.id,cat:'contr',tk:'d_c2',date:'2026-10-20',status:'draft'});
  if(f.needDocs)H[f.id].push({d:'2026-10-21',k:'h_docs'})});
 var log=[];R.forEach(function(x){if(x.status==='submitted'){D.push({id:'q'+x.id,fop:x.fop,cat:'rcpt',tk:'d_rcpt',rid:x.id,ref:x.ref,date:x.subAt.slice(0,10),status:'filed'});H[x.fop].push({d:x.subAt.slice(0,10),k:'h_submit',rid:x.id,n:x.ref});log.push({ts:x.subAt,fop:x.fop,rid:x.id,ch:x.type==='esv'?'pfu':'dps',ok:true,ref:x.ref})}
  if(x.auto)H[x.fop].push({d:'2026-10-01',k:'h_gen',rid:x.id});if(x.fop==='f2'&&x.type==='df4')H.f2.push({d:'2026-10-15',k:'h_assign',rid:x.id,dd:'2026-10-29'});if(x.fop==='f6')H.f6.push({d:'2026-10-19',k:'h_resched',rid:x.id,dd:'2026-10-28'})});
 log.sort(function(a,b){return a.ts<b.ts?1:-1});
 var g={};R.forEach(function(x){g[x.fop+'|'+x.type+'|'+x.period]=1});
 var af={};FOPS.forEach(function(f){af[f.id]=true});
 var s={v:2,today:BASE,lastRun:BASE,reports:R,docs:D,hist:H,notifs:[],nkeys:{},gkeys:g,log:log,seq:i,
  settings:{o7:true,o3:true,o1:true,email:true,tg:false,app:true},auto:{esv:true,ep:true,df4:true},autoFop:af,simErr:false,genLog:[{d:'2026-10-01',n:2}]};
 return s}
var S;try{S=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
var fresh=!S||S.v!==2;if(fresh)S=seed();
var subs=[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function emit(){save();subs.forEach(function(f){f()})}
function fop(id){for(var i=0;i<FOPS.length;i++)if(FOPS[i].id===id)return FOPS[i]}
function rep(id){for(var i=0;i<S.reports.length;i++)if(S.reports[i].id===id)return S.reports[i]}
function left(r){return dn(r.deadline)-dn(S.today)}
function hist(f,e){e.d=e.d||S.today;(S.hist[f]=S.hist[f]||[]).push(e)}
function notify(aud,f,rid,kind,extra){S.notifs.unshift(Object.assign({id:'n'+(S.notifs.length+1)+'_'+Date.now()%100000,aud:aud,fop:f,rid:rid,kind:kind,d:S.today,read:false},extra||{}))}
/* reminders: 7/3/1 days before, plus overdue; deterministic by simulated date, one key per report+threshold */
function remind(){var n=0,st=S.settings,offs=[7,3,1].filter(function(o){return st['o'+o]});
 S.reports.forEach(function(r){if(r.status==='submitted')return;var l=left(r),kind=null;
  if(l<0)kind='over';else{for(var i=offs.length-1;i>=0;i--)if(l<=offs[i]){kind=offs[i];break}}
  if(kind===null)return;var key=r.id+'|'+r.deadline+'|'+kind;if(S.nkeys[key])return;
  [7,3,1,'over'].forEach(function(k){if(kind==='over'||(k!=='over'&&k>=kind))S.nkeys[r.id+'|'+r.deadline+'|'+k]=1});
  S.nkeys[key]=1;notify('acc',r.fop,r.id,kind,{l:l});notify('fop',r.fop,r.id,kind,{l:l});hist(r.fop,{k:kind==='over'?'h_over':'h_remind',rid:r.id,n:kind});n++});
 return n}
/* scheduler: ЄСВ monthly on the 1st (for previous month, deadline 20th), ЄП (group 3) and 4-ДФ quarterly on the 1st day after quarter (deadline +39 days = 40th day), ЄП groups 1-2 yearly on 01.01 */
function genFor(day){var p=day.split('-'),y=+p[0],m=+p[1],dd=+p[2],out=0;if(dd!==1)return 0;
 FOPS.forEach(function(f){if(!S.autoFop[f.id])return;var T=types(f);
  function mk(type,period,dl){var k=f.id+'|'+type+'|'+period;if(S.gkeys[k]||!S.auto[type])return;S.gkeys[k]=1;
   var r={id:'r'+(++S.seq),fop:f.id,type:type,period:period,deadline:dl,status:'draft',auto:true,ref:'',subAt:''};S.reports.push(r);hist(f.id,{d:day,k:'h_gen',rid:r.id});notify('acc',f.id,r.id,'gen');out++}
  var pm=m===1?12:m-1,py=m===1?y-1:y;
  if(T.indexOf('esv')>=0)mk('esv',py+'-'+(pm<10?'0':'')+pm,y+'-'+p[1]+'-20');
  if(m%3===1){var q=m===1?4:(m-1)/3,qy=m===1?y-1:y;if(T.indexOf('ep')>=0)mk('ep',qy+'-Q'+q,add(day,39));if(T.indexOf('df4')>=0)mk('df4',qy+'-Q'+q,add(day,39))}
  if(m===1&&f.group<3)mk('ep',String(y-1),y+'-03-01')});
 if(out)S.genLog.unshift({d:day,n:out});return out}
function schedule(){var n=0;if(S.today>S.lastRun){for(var d=add(S.lastRun,1);d<=S.today;d=add(d,1))n+=genFor(d);S.lastRun=S.today}return n}
function runNow(){var p=S.today.split('-');var n=genFor(p[0]+'-'+p[1]+'-01');if(!n)S.genLog.unshift({d:S.today,n:0});return n}
function setToday(d){if(!/^\d{4}-\d\d-\d\d$/.test(d))return;S.today=d;var g=schedule();var r=remind();emit();return {gen:g,rem:r}}
function nextRuns(){var p=S.today.split('-'),y=+p[0],m=+p[1];var nm=m===12?(y+1)+'-01-01':y+'-'+(m<9?'0':'')+(m+1)+'-01';var qm=Math.ceil(m/3)*3+1,qy=y;if(qm>12){qm=1;qy++}
 return {esv:nm,ep:qy+'-'+(qm<10?'0':'')+qm+'-01',df4:qy+'-'+(qm<10?'0':'')+qm+'-01',ep12:(y+1)+'-01-01'}}
function fopStatus(id){var rs=S.reports.filter(function(r){return r.fop===id&&r.status!=='submitted'});
 if(rs.some(function(r){return left(r)<0}))return 'over';if(rs.some(function(r){return r.status==='signing'}))return 'sign';if(fop(id).needDocs)return 'docs';return 'ok'}
function nearest(id){var b=null;S.reports.forEach(function(r){if(r.fop===id&&r.status!=='submitted'&&(!b||r.deadline<b.deadline))b=r});return b}
function hash(s){var h=7;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%99999989;return h}
function makeRef(r){var n=String(hash(r.id+r.period+S.today+S.seq)).padStart(8,'0');return 'ДЕМО-'+(r.type==='esv'?'ПФУ':'ДПС')+'-'+n}
function stamp(){var t=new Date();return S.today+' '+String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0')}
function submit(rid,via){var r=rep(rid);if(!r||r.status==='submitted')return;r.status='submitted';r.subAt=stamp();
 if(via==='auto'){S.seq++;r.ref=makeRef(r);S.log.unshift({ts:r.subAt,fop:r.fop,rid:r.id,ch:r.type==='esv'?'pfu':'dps',ok:true,ref:r.ref});
  S.docs.push({id:'q'+r.id+'_'+S.seq,fop:r.fop,cat:'rcpt',tk:'d_rcpt',rid:r.id,ref:r.ref,date:S.today,status:'filed'});hist(r.fop,{k:'h_submit',rid:r.id,n:r.ref});notify('fop',r.fop,r.id,'sub',{ref:r.ref})}
 else hist(r.fop,{k:'h_manual',rid:r.id});emit();return r}
function failLog(rid){var r=rep(rid);S.log.unshift({ts:stamp(),fop:r.fop,rid:r.id,ch:r.type==='esv'?'pfu':'dps',ok:false,ref:''});hist(r.fop,{k:'h_fail',rid:r.id});r.failed=true;emit()}
function setDeadline(rid,d,k){var r=rep(rid);if(!r||!d)return;r.deadline=d;hist(r.fop,{k:k||'h_resched',rid:rid,dd:d});remind();emit()}
function addReport(f,type,d){S.seq++;var p=S.today.split('-');var r={id:'r'+S.seq,fop:f,type:type,period:type==='esv'?p[0]+'-'+p[1]:p[0]+'-Q'+Math.ceil(p[1]/3),deadline:d,status:'draft',auto:false,ref:'',subAt:''};S.reports.push(r);hist(f,{k:'h_assign',rid:r.id,dd:d});remind();emit();return r}
function setStatus(rid,st,k){var r=rep(rid);r.status=st;hist(r.fop,{k:k,rid:rid});emit()}
function reset(){S=seed();remind();api.S=S;emit()}
var api=window.ZV={S:S,BASE:BASE,FOPS:FOPS,ACC:ACC,types:types,fop:fop,rep:rep,left:left,fmt:fmt,dn:dn,add:add,on:function(f){subs.push(f)},emit:emit,save:save,
 setToday:setToday,remind:remind,runNow:function(){var n=runNow();remind();emit();return n},nextRuns:nextRuns,fopStatus:fopStatus,nearest:nearest,submit:submit,failLog:failLog,
 setDeadline:setDeadline,addReport:addReport,setStatus:setStatus,reset:reset,hist:hist,notify:notify,CAB_FOP:'f1'};
if(fresh){remind();save()}
addEventListener('storage',function(e){if(e.key===KEY&&e.newValue){S=api.S=JSON.parse(e.newValue);subs.forEach(function(f){f()})}});
})();
