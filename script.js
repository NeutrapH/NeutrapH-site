const phone='27798134597';
function toggleMenu(){document.querySelector('nav').classList.toggle('open')}
function toggleInfo(btn){const info=btn.nextElementSibling;const hidden=info.style.display==='none'||!info.style.display;info.style.display=hidden?'block':'none';btn.textContent=hidden?'▴ Product Information':'▾ Product Information'}
function toggleIngredients(btn){const info=btn.nextElementSibling;const hidden=info.style.display==='none'||!info.style.display;info.style.display=hidden?'block':'none';btn.textContent=hidden?'▴ Ingredients':'▾ Ingredients'}
function orderProduct(product){const qty=document.getElementById('qty-'+product.replace(/[^a-z0-9]/gi,'')).value;const msg=`Hi NeutrapH, I would like to order ${qty} x ${product}. Please confirm delivery and payment details.`;window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,'_blank')}
function submitLead(e){e.preventDefault();const f=new FormData(e.target);let msg='Hi NeutrapH, I would like to sign up / enquire.\n\n';for(const [k,v] of f.entries()){if(v) msg+=`${k}: ${v}\n`}window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,'_blank')}
