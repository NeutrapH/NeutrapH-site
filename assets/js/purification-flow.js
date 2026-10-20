(() => {
 const canvas=document.querySelector('#treatment-canvas'); if(!canvas)return;
 const ctx=canvas.getContext('2d'), root=document.querySelector('.flow-lab');
 const toggle=root.querySelector('#flow-toggle'), description=root.querySelector('#flow-description');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let playing=!reduced.matches, time=0,last=0,selected=0,frame;
 const stages=[
 ['Borehole water','Source water may contain suspended particles and dissolved substances, even when it looks clear. Testing determines the treatment needed.'],
 ['Sediment filter','Suspended particles are retained by the filter. Dissolved salts can remain in the water.'],
 ['Activated carbon','Suitable carbon media reduces chlorine and selected taste- and odour-causing substances, helping prepare water for RO.'],
 ['Pressure pump','Pressure drives the separation at the RO membrane. Pressure itself does not remove contaminants.'],
 ['RO membrane','Water crosses the membrane as permeate. A separate concentrate stream carries rejected substances away. Removal is not absolute.'],
 ['Protected storage','RO-treated water enters protected storage. Hygienic storage and maintenance help prevent recontamination.'],
 ['UV treatment','Validated UV treatment inactivates microorganisms. It does not remove dissolved salts or provide lasting protection after treatment.'],
 ['Treated water','The intended output still needs appropriate water-quality verification before supply. A clear appearance alone does not prove safety.']
 ];
 const xs=[65,205,345,485,625,765,905,1045], y=230;
 function select(i){selected=i;root.querySelectorAll('.flow-stage').forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));description.innerHTML=`<strong>${String(i+1).padStart(2,'0')} / ${stages[i][0]}</strong><p>${stages[i][1]}</p>`;draw();}
 root.querySelectorAll('.flow-stage').forEach((b,i)=>b.addEventListener('click',()=>select(i)));
 canvas.addEventListener('click',event=>{
  const r=canvas.getBoundingClientRect(),x=(event.clientX-r.left)*1120/r.width,y=(event.clientY-r.top)*650/r.height;
  const areas=[[28,118,96,192],[207,119,96,185],[342,119,96,185],[511,199,78,82],[659,123,258,166],[790,383,120,171],[258,470,184,92],[101,478,85,97]];
  const i=areas.findIndex(([ax,ay,w,h])=>x>=ax-10&&x<=ax+w+10&&y>=ay-10&&y<=ay+h+10);
  if(i>=0)select(i);
 });
 function label(text,x,y,size=13,color='#bad8de'){ctx.fillStyle=color;ctx.font=`${size}px system-ui`;ctx.textAlign='center';ctx.fillText(text,x,y);}
 function line(points,color,width=3){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
 function box(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
 function draw(){
 ctx.clearRect(0,0,1120,650);ctx.fillStyle='#f4f7f3';ctx.fillRect(0,0,1120,650);
 ctx.strokeStyle='#d9e2dc';ctx.lineWidth=1;ctx.strokeRect(16,16,1088,618);
 function text(t,x,y,size=12,c='#244b52'){label(t,x,y,size,c);}
 function pipe(points,c='#25888e'){
 line(points,'#b9cdc7',9);line(points,c,3);
 let lengths=[],total=0;for(let i=1;i<points.length;i++){let d=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]);lengths.push(d);total+=d;}
 for(let k=0;k<total/28;k++){let d=(time*47+k*28)%total;for(let i=0;i<lengths.length;i++){if(d<=lengths[i]){let r=d/lengths[i],x=points[i][0]+r*(points[i+1][0]-points[i][0]),y=points[i][1]+r*(points[i+1][1]-points[i][1]);ctx.fillStyle='#e4ffff';ctx.beginPath();ctx.arc(x,y,2,0,7);ctx.fill();break;}d-=lengths[i];}}
 let z=points.length-1,dx=points[z][0]-points[z-1][0],dy=points[z][1]-points[z-1][1],ang=Math.atan2(dy,dx);ctx.save();ctx.translate(points[z][0],points[z][1]);ctx.rotate(ang);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-11,-5);ctx.lineTo(-11,5);ctx.fill();ctx.restore();
 }
 function vessel(x,y,w,h,colour,tag,name,stage,media){
 const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#779395');g.addColorStop(.28,'#f6fbf9');g.addColorStop(.65,'#c2d2cf');g.addColorStop(1,'#69868a');
 if(selected===stage){ctx.shadowColor='#39b6ad';ctx.shadowBlur=20;}box(x,y,w,h,10,g);ctx.shadowBlur=0;
 ctx.strokeStyle='#416268';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(x,y,w,h,10);ctx.stroke();
 ctx.fillStyle='#e7eeeb';ctx.beginPath();ctx.ellipse(x+w/2,y+7,w/2,9,0,0,7);ctx.fill();ctx.stroke();
 box(x+9,y+25,w-18,h-40,5,colour);
 if(media==='sediment'){for(let i=0;i<7;i++)line([[x+15+i*6,y+30],[x+15+i*6,y+h-20]],'#e3d8a9',2);}
 if(media==='carbon'){for(let i=0;i<35;i++){ctx.fillStyle='#293d3b';ctx.beginPath();ctx.arc(x+14+(i*17%(w-27)),y+33+(i*23%(h-53)),3,0,7);ctx.fill();}}
 if(media==='water'){for(let i=0;i<9;i++){ctx.fillStyle='#cfffff99';ctx.beginPath();ctx.arc(x+16+(i*11%(w-30)),y+30+((i*17-time*12)%(h-55)+(h-55))%(h-55),2,0,7);ctx.fill();}}
 line([[x+12,y+h],[x+12,y+h+13],[x+3,y+h+13]],'#49696a',3);line([[x+w-12,y+h],[x+w-12,y+h+13],[x+w-3,y+h+13]],'#49696a',3);
 text(tag,x+w/2,y-18,11);text(name,x+w/2,y+h+35,12);
 }
 function pump(x,y,tag,stage){ctx.fillStyle=selected===stage?'#7bc9c0':'#bdd0ca';ctx.beginPath();ctx.arc(x,y,24,0,7);ctx.fill();ctx.strokeStyle='#365d65';ctx.lineWidth=2;ctx.stroke();ctx.save();ctx.translate(x,y);ctx.rotate(time*2);for(let j=0;j<3;j++){ctx.rotate(2*Math.PI/3);line([[0,0],[15,0],[9,9]],'#38636c',3);}ctx.restore();box(x-32,y+27,64,8,2,'#58777b');text(tag,x,y+55,10);}
 text('01 / SOURCE & PRE-TREATMENT',220,91,11,'#2a8987');text('02 / MEMBRANE SEPARATION',830,91,11,'#2a8987');
 // Orthogonal process pipework, connected to the equipment nozzles.
 pipe([[75,228],[75,148],[170,148],[170,195],[220,195]],'#9d8d5d');
 pipe([[290,195],[355,195]],'#669f94');pipe([[425,195],[490,195],[490,240],[526,240]],'#3a9291');
 pipe([[574,240],[610,240],[610,180],[680,180]],'#25888e');
 pipe([[895,180],[1005,180],[1005,407],[900,407]],'#21a9ad');
 pipe([[680,227],[650,227],[650,330],[520,330],[520,417]],'#b98848');
 pipe([[800,465],[725,465],[725,482],[654,482]],'#21a9ad');
 pipe([[606,482],[550,482],[550,530],[430,530]],'#21a9ad');
 pipe([[270,530],[185,530]],'#21a9ad');
 // Borehole and submerged pump.
 line([[36,250],[118,250]],'#8c997e',2);for(let i=0;i<5;i++)line([[38+i*17,253],[30+i*17,267]],'#a8ae96',1);
 box(59,158,32,131,3,'#c4d2cb');box(67,171,16,107,2,'#9c9470');box(64,246,22,31,4,'#38626b');line([[75,246],[75,150]],'#38626b',4);text('BH-01',75,130,11);text('Borehole water',75,318);text('Source testing',75,337,10);
 vessel(220,139,70,142,'#9eac8977','F-01','Sediment filter',1,'sediment');
 vessel(355,139,70,142,'#556e5c88','F-02','Activated carbon',2,'carbon');
 pump(550,240,'P-01 / HIGH PRESSURE',3);
 // Membrane skid: horizontal pressure vessels, flanges and support frame.
 box(667,130,242,135,7,selected===4?'#d5eee6':'#e3eae4');ctx.strokeStyle='#577a7a';ctx.strokeRect(667,130,242,135);
 for(let i=0;i<2;i++){let yy=157+i*46;const g=ctx.createLinearGradient(0,yy,0,yy+30);g.addColorStop(0,'#637e83');g.addColorStop(.45,'#f6fffb');g.addColorStop(1,'#79979a');box(682,yy,210,30,14,g);for(let x of [690,883])line([[x,yy-3],[x,yy+33]],'#2e626c',4);for(let j=0;j<10;j++)line([[718+j*13,yy+4],[718+j*13,yy+26]],'#65a9ac55',1);}
 line([[680,265],[680,281],[895,281],[895,265]],'#486b70',4);text('RO-01',788,115,11);text('Reverse osmosis membrane skid',788,303);text('PERMEATE →',966,159,10,'#19868b');text('CONCENTRATE',584,350,10,'#996c36');
 // Pressure gauge on feed.
 line([[610,180],[610,141]],'#4c7478',2);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(610,128,13,0,7);ctx.fill();ctx.stroke();line([[610,128],[617,121]],'#244b52',2);text('Pressure',610,107,9);
 text('03 / STORAGE, DISINFECTION & OUTPUT',804,366,11,'#2a8987');
 vessel(800,395,100,137,'#58c4ca77','TK-01','Protected storage',5,'water');
 pump(630,482,'P-02 / TRANSFER',5);
 // Separate concentrate outlet; it never joins treated water.
 box(478,417,84,30,5,'#efe4cc');text('Separate outlet',520,437,10,'#805e30');text('Management to be confirmed',520,462,9,'#805e30');
 // Horizontal UV chamber and control head.
 const uv=ctx.createLinearGradient(0,508,0,552);uv.addColorStop(0,'#607f85');uv.addColorStop(.5,'#f4fcfb');uv.addColorStop(1,'#8fa9ad');box(270,508,160,44,20,uv);ctx.shadowColor='#a575ee';ctx.shadowBlur=18;line([[286,530],[414,530]],'#c0a0ed',7);ctx.shadowBlur=0;box(337,478,27,25,3,'#4d727a');line([[350,503],[350,508]],'#4d727a',3);text('UV-01',350,464,11);text('UV disinfection chamber',350,581);
 // Final vessel as a glass, not a process block.
 ctx.fillStyle='#d0efeb';ctx.beginPath();ctx.moveTo(110,489);ctx.lineTo(120,566);ctx.lineTo(167,566);ctx.lineTo(178,489);ctx.closePath();ctx.fill();ctx.strokeStyle='#3f858c';ctx.lineWidth=2;ctx.stroke();line([[115,515],[173,515]],'#36a3ae',2);text('Treated water',145,591);text('Verification before supply',145,608,10);
 text('FLOW LEGEND',999,486,10);text('Feed / pre-treatment',999,508,10,'#8b8155');text('RO permeate',999,528,10,'#198b92');text('Concentrate',999,548,10,'#996c36');
 // Spotlight each selected item, including the borehole, UV chamber and output.
 const bounds=[
  [28,118,96,192],[207,119,96,185],[342,119,96,185],[511,199,78,82],
  [659,123,258,166],[790,383,120,171],[258,470,184,92],[101,478,85,97]
 ];
 const [sx,sy,sw,sh]=bounds[selected];
 ctx.save();
 ctx.beginPath();ctx.rect(0,0,1120,650);ctx.roundRect(sx-7,sy-7,sw+14,sh+14,14);
 ctx.clip('evenodd');ctx.fillStyle='#082d3e00';ctx.fillRect(0,0,1120,650);ctx.restore();
 const pulse=reduced.matches||!playing?0.7:(Math.sin(time*3)+1)/2;
 ctx.save();ctx.shadowColor='#00f5d4';ctx.shadowBlur=6+pulse*3;
 ctx.strokeStyle='#00a58f';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(sx-7,sy-7,sw+14,sh+14,14);ctx.stroke();ctx.restore();
 ctx.strokeStyle='#68bdb855';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(sx-11,sy-11,sw+22,sh+22,17);ctx.stroke();
 const tag=String(selected+1).padStart(2,'0')+'  '+stages[selected][0].toUpperCase();
 ctx.font='bold 12px system-ui';const tw=ctx.measureText(tag).width+28;
 const tx=Math.max(20,Math.min(1100-tw,sx+sw/2-tw/2)),ty=sy-42;
 box(tx,ty,tw,26,6,'#07594f');label(tag,tx+tw/2,ty+18,12,'#effff9');
 }
 function tick(now){if(playing)time+=Math.min((now-last)/1000,.06);last=now;draw();frame=requestAnimationFrame(tick);}
 function state(){toggle.textContent=playing?'Pause flow':'Play flow';toggle.setAttribute('aria-pressed',String(playing));}
 toggle.addEventListener('click',()=>{playing=!playing;state();});
 root.querySelector('#flow-reset').addEventListener('click',()=>{time=0;select(0);});
 reduced.addEventListener('change',e=>{if(e.matches){playing=false;state();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(frame);else{last=performance.now();frame=requestAnimationFrame(tick);}});
 select(0);state();frame=requestAnimationFrame(tick);
})();
