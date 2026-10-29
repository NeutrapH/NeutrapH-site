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
 ['Water softener','Ion-exchange resin reduces calcium and magnesium hardness before RO, helping limit scale on the membrane. Resin needs regeneration and maintenance; softening does not disinfect water.'],
 ['Pressure pump','Pressure drives the separation at the RO membrane. Pressure itself does not remove contaminants.'],
 ['RO membrane','Water crosses the membrane as permeate. A separate concentrate stream carries rejected substances away. Removal is not absolute.'],
 ['Protected storage','RO-treated water enters protected storage. Hygienic storage and maintenance help prevent recontamination.'],
 ['UV treatment','Validated UV treatment inactivates microorganisms. It does not remove dissolved salts or provide lasting protection after treatment.'],
 ['Treated water','The intended output still needs appropriate water-quality verification before supply. A clear appearance alone does not prove safety.']
 ];
 const bounds=[[28,118,96,192],[180,119,80,185],[295,119,80,185],[410,119,80,185],[511,199,78,82],[659,123,258,166],[790,383,120,171],[258,470,184,92],[101,478,85,97]];
 const phone=matchMedia('(max-width:700px)');
 const mobileY=[90,260,430,600,770,940,1150,1360,1540];
 const mobileBounds=mobileY.map((y,i)=>[14,y-28,332,i===6?190:i===5?185:158]);
 let width=1120,height=650;
 function configure(){
  width=phone.matches?360:1120;height=phone.matches?1720:650;
  const ratio=Math.min(window.devicePixelRatio||1,2);
  canvas.width=width*ratio;canvas.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);draw();
 }
 phone.addEventListener('change',configure);
 function select(i){selected=i;root.querySelectorAll('.flow-stage').forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));description.innerHTML=`<strong>${String(i+1).padStart(2,'0')} / ${stages[i][0]}</strong><p>${stages[i][1]}</p>`;draw();}
 root.querySelectorAll('.flow-stage').forEach((b,i)=>b.addEventListener('click',()=>select(i)));
 canvas.addEventListener('click',event=>{
  const r=canvas.getBoundingClientRect(),x=(event.clientX-r.left)*width/r.width,y=(event.clientY-r.top)*height/r.height;
  const areas=phone.matches?mobileBounds:bounds;
  const i=areas.findIndex(([ax,ay,w,h])=>x>=ax-10&&x<=ax+w+10&&y>=ay-10&&y<=ay+h+10);
  if(i>=0)select(i);
 });
 function label(text,x,y,size=13,color='#bad8de'){ctx.fillStyle=color;ctx.font=`${size}px system-ui`;ctx.textAlign='center';ctx.fillText(text,x,y);}
 function line(points,color,width=3){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
 function box(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
 function draw(){
 ctx.clearRect(0,0,width,height);ctx.fillStyle='#f4f7f3';ctx.fillRect(0,0,width,height);
 ctx.strokeStyle='#d9e2dc';ctx.lineWidth=1;ctx.strokeRect(16,16,width-32,height-32);
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
 if(media==='resin'){for(let i=0;i<48;i++){ctx.fillStyle=i%2?'#c59a57':'#e7c88a';ctx.beginPath();ctx.arc(x+14+(i*13%(w-27)),y+33+(i*19%(h-53)),2.5,0,7);ctx.fill();}}
 if(media==='water'){for(let i=0;i<9;i++){ctx.fillStyle='#cfffff99';ctx.beginPath();ctx.arc(x+16+(i*11%(w-30)),y+30+((i*17-time*12)%(h-55)+(h-55))%(h-55),2,0,7);ctx.fill();}}
 line([[x+12,y+h],[x+12,y+h+13],[x+3,y+h+13]],'#49696a',3);line([[x+w-12,y+h],[x+w-12,y+h+13],[x+w-3,y+h+13]],'#49696a',3);
 if(tag)text(tag,x+w/2,y-18,11);if(name)text(name,x+w/2,y+h+35,12);
 }
 function pump(x,y,tag,stage){ctx.fillStyle=selected===stage?'#7bc9c0':'#bdd0ca';ctx.beginPath();ctx.arc(x,y,24,0,7);ctx.fill();ctx.strokeStyle='#365d65';ctx.lineWidth=2;ctx.stroke();ctx.save();ctx.translate(x,y);ctx.rotate(time*2);for(let j=0;j<3;j++){ctx.rotate(2*Math.PI/3);line([[0,0],[15,0],[9,9]],'#38636c',3);}ctx.restore();box(x-32,y+27,64,8,2,'#58777b');if(tag)text(tag,x,y+55,10);}
 // The phone schematic uses the same equipment, colours and flow clock as desktop.
 if(phone.matches){
  const y=mobileY, ends=[198,370,540,710,830,1022,1260,1420];
  text('SOURCE & PRE-TREATMENT',180,45,12,'#267f80');
  for(let i=0;i<8;i++){
   if(i===0){pipe([[80,90],[25,90],[25,225],[80,225],[80,260]],'#669f94');}
   else if(i===6){pipe([[80,1260],[80,1288],[135,1288],[135,1320],[23,1320],[23,1390]],'#21a9ad');}
   else if(i===7){pipe([[137,1390],[147,1390],[147,1470],[80,1470],[80,1540]],'#21a9ad');}
   else pipe([[80,ends[i]],[80,y[i+1]]],i<4?'#669f94':'#21a9ad');
  }
  // Borehole, with a submerged pump and riser.
  line([[30,166],[130,166]],'#8c997e',2);
  for(let i=0;i<6;i++)line([[34+i*18,168],[27+i*18,179]],'#a8ae96',1);
  box(63,90,34,108,3,'#c4d2cb');box(70,100,20,91,2,'#9c9470');box(68,163,24,28,4,'#38626b');line([[80,163],[80,90]],'#38626b',4);
  vessel(45,y[1],70,110,'#9eac8977','','',1,'sediment');
  vessel(45,y[2],70,110,'#556e5c88','','',2,'carbon');
  vessel(45,y[3],70,110,'#c49c6388','','',3,'resin');
  // Regeneration/brine tank belongs to the softener, not the product-water pipe.
  box(123,659,22,48,4,'#d5dfd9');line([[115,628],[134,628],[134,659]],'#597b7b',2);
  pump(80,798,'',4);
  line([[106,789],[125,789],[125,767]],'#4c7478',2);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(125,757,10,0,7);ctx.fill();ctx.stroke();line([[125,757],[130,752]],'#244b52',2);
  text('MEMBRANE SEPARATION',180,905,12,'#267f80');
  box(23,940,114,82,4,selected===5?'#d5eee6':'#e3eae4');ctx.strokeStyle='#577a7a';ctx.strokeRect(23,940,114,82);
  for(let i=0;i<2;i++){
   const yy=952+i*32,g=ctx.createLinearGradient(0,yy,0,yy+21);g.addColorStop(0,'#637e83');g.addColorStop(.45,'#f6fffb');g.addColorStop(1,'#79979a');box(29,yy,102,21,10,g);
   for(const x of [34,126])line([[x,yy-2],[x,yy+23]],'#2e626c',3);
  }
  line([[33,1022],[33,1032],[127,1032],[127,1022]],'#486b70',3);
  pipe([[137,994],[154,994],[154,1034],[309,1034],[309,1040]],'#b98848');
  box(170,1041,158,42,5,'#efe4cc');text('Separate concentrate',249,1058,11,'#805e30');text('outlet · management pending',249,1074,10,'#805e30');
  text('STORAGE, UV & OUTPUT',180,1118,12,'#267f80');
  vessel(40,y[6],80,110,'#58c4ca77','','',6,'water');
  pump(135,1288,'',6);text('Transfer pump',241,1292,11);
  const uv=ctx.createLinearGradient(0,1360,0,1420);uv.addColorStop(0,'#607f85');uv.addColorStop(.5,'#f4fcfb');uv.addColorStop(1,'#8fa9ad');box(23,1368,114,44,20,uv);
  line([[39,1390],[123,1390]],'#c0a0ed',7);box(67,1347,26,20,3,'#4d727a');line([[80,1367],[80,1368]],'#4d727a',3);
  ctx.fillStyle='#d0efeb';ctx.beginPath();ctx.moveTo(47,1540);ctx.lineTo(58,1630);ctx.lineTo(102,1630);ctx.lineTo(113,1540);ctx.closePath();ctx.fill();ctx.strokeStyle='#3f858c';ctx.lineWidth=2;ctx.stroke();line([[51,1570],[109,1570]],'#36a3ae',2);
  const tags=['BH-01','F-01','F-02','F-03','P-01','RO-01','TK-01','UV-01','OUTPUT'];
  const names=[['Borehole water','Source testing'],['Sediment filter','Suspended particles'],['Activated carbon','Carbon media'],['Water softener','Resin + brine tank'],['Pressure pump','High-pressure feed'],['RO membrane','Permeate flows down'],['Protected storage','Hygienic storage'],['UV treatment','Disinfection chamber'],['Treated water','Verification before supply']];
  names.forEach(([name,sub],i)=>{
   const yy=y[i];text(String(i+1).padStart(2,'0')+' / '+tags[i],245,yy+17,11,'#267f80');
   text(name,245,yy+43,14);text(sub,245,yy+66,11);
  });
  const [sx,sy,sw,sh]=mobileBounds[selected];
  ctx.strokeStyle='#00a58f';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(sx,sy,sw,sh,12);ctx.stroke();
  text('Feed / pretreatment',100,1670,10,'#4c7f75');text('RO permeate',255,1670,10,'#198b92');
  text('Tap equipment to highlight · explanations below',180,1694,10);
  return;
 }

 text('01 / SOURCE & PRE-TREATMENT',220,91,11,'#2a8987');text('02 / MEMBRANE SEPARATION',830,91,11,'#2a8987');
 // Orthogonal process pipework, connected to the equipment nozzles.
 pipe([[75,228],[75,148],[170,148],[170,195],[190,195]],'#9d8d5d');
 pipe([[250,195],[305,195]],'#669f94');pipe([[365,195],[420,195]],'#669f94');pipe([[480,195],[500,195],[500,240],[526,240]],'#3a9291');
 pipe([[574,240],[610,240],[610,180],[680,180]],'#25888e');
 pipe([[895,180],[1005,180],[1005,407],[900,407]],'#21a9ad');
 pipe([[680,227],[650,227],[650,330],[520,330],[520,417]],'#b98848');
 pipe([[800,465],[725,465],[725,482],[654,482]],'#21a9ad');
 pipe([[606,482],[550,482],[550,530],[430,530]],'#21a9ad');
 pipe([[270,530],[185,530]],'#21a9ad');
 // Borehole and submerged pump.
 line([[36,250],[118,250]],'#8c997e',2);for(let i=0;i<5;i++)line([[38+i*17,253],[30+i*17,267]],'#a8ae96',1);
 box(59,158,32,131,3,'#c4d2cb');box(67,171,16,107,2,'#9c9470');box(64,246,22,31,4,'#38626b');line([[75,246],[75,150]],'#38626b',4);text('BH-01',75,130,11);text('Borehole water',75,318);text('Source testing',75,337,10);
 vessel(190,139,60,142,'#9eac8977','F-01','Sediment filter',1,'sediment');
 vessel(305,139,60,142,'#556e5c88','F-02','Activated carbon',2,'carbon');
 vessel(420,139,60,142,'#c49c6388','F-03','Water softener',3,'resin');
 pump(550,240,'P-01 / HIGH PRESSURE',4);
 // Membrane skid: horizontal pressure vessels, flanges and support frame.
 box(667,130,242,135,7,selected===5?'#d5eee6':'#e3eae4');ctx.strokeStyle='#577a7a';ctx.strokeRect(667,130,242,135);
 for(let i=0;i<2;i++){let yy=157+i*46;const g=ctx.createLinearGradient(0,yy,0,yy+30);g.addColorStop(0,'#637e83');g.addColorStop(.45,'#f6fffb');g.addColorStop(1,'#79979a');box(682,yy,210,30,14,g);for(let x of [690,883])line([[x,yy-3],[x,yy+33]],'#2e626c',4);for(let j=0;j<10;j++)line([[718+j*13,yy+4],[718+j*13,yy+26]],'#65a9ac55',1);}
 line([[680,265],[680,281],[895,281],[895,265]],'#486b70',4);text('RO-01',788,115,11);text('Reverse osmosis membrane skid',788,303);text('PERMEATE →',966,159,10,'#19868b');text('CONCENTRATE',584,350,10,'#996c36');
 // Pressure gauge on feed.
 line([[610,180],[610,141]],'#4c7478',2);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(610,128,13,0,7);ctx.fill();ctx.stroke();line([[610,128],[617,121]],'#244b52',2);text('Pressure',610,107,9);
 text('03 / STORAGE, DISINFECTION & OUTPUT',804,366,11,'#2a8987');
 vessel(800,395,100,137,'#58c4ca77','TK-01','Protected storage',6,'water');
 pump(630,482,'P-02 / TRANSFER',6);
 // Separate concentrate outlet; it never joins treated water.
 box(478,417,84,30,5,'#efe4cc');text('Separate outlet',520,437,10,'#805e30');text('Management to be confirmed',520,462,9,'#805e30');
 // Horizontal UV chamber and control head.
 const uv=ctx.createLinearGradient(0,508,0,552);uv.addColorStop(0,'#607f85');uv.addColorStop(.5,'#f4fcfb');uv.addColorStop(1,'#8fa9ad');box(270,508,160,44,20,uv);ctx.shadowColor='#a575ee';ctx.shadowBlur=18;line([[286,530],[414,530]],'#c0a0ed',7);ctx.shadowBlur=0;box(337,478,27,25,3,'#4d727a');line([[350,503],[350,508]],'#4d727a',3);text('UV-01',350,464,11);text('UV disinfection chamber',350,581);
 // Final vessel as a glass, not a process block.
 ctx.fillStyle='#d0efeb';ctx.beginPath();ctx.moveTo(110,489);ctx.lineTo(120,566);ctx.lineTo(167,566);ctx.lineTo(178,489);ctx.closePath();ctx.fill();ctx.strokeStyle='#3f858c';ctx.lineWidth=2;ctx.stroke();line([[115,515],[173,515]],'#36a3ae',2);text('Treated water',145,591);text('Verification before supply',145,608,10);
 text('FLOW LEGEND',999,486,10);text('Feed / pre-treatment',999,508,10,'#8b8155');text('RO permeate',999,528,10,'#198b92');text('Concentrate',999,548,10,'#996c36');
 // Spotlight each selected item, including the borehole, UV chamber and output.
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
 function state(){root.classList.toggle('flow-paused',!playing);toggle.textContent=playing?'Pause flow':'Play flow';toggle.setAttribute('aria-pressed',String(playing));}
 toggle.addEventListener('click',()=>{playing=!playing;state();});
 root.querySelector('#flow-reset').addEventListener('click',()=>{time=0;select(0);});
 reduced.addEventListener('change',e=>{if(e.matches){playing=false;state();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(frame);else{last=performance.now();frame=requestAnimationFrame(tick);}});
 configure();select(0);state();frame=requestAnimationFrame(tick);
})();
