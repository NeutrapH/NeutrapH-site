const phone='27798134597';

function toggleMenu(){
  document.querySelector('nav').classList.toggle('open')
}

function toggleInfo(btn){
  const info=btn.nextElementSibling;
  const hidden=info.style.display==='none'||!info.style.display;
  info.style.display=hidden?'block':'none';
  btn.textContent=hidden?'▴ Product Information':'▾ Product Information'
}

function toggleIngredients(btn){
  const info=btn.nextElementSibling;
  const hidden=info.style.display==='none'||!info.style.display;
  info.style.display=hidden?'block':'none';
  btn.textContent=hidden?'▴ Ingredients':'▾ Ingredients'
}

function orderProduct(product){
  const qty=document.getElementById('qty-'+product.replace(/[^a-z0-9]/gi,'')).value;
  const msg=`Hi NeutrapH, I would like to order ${qty} x ${product}. Please confirm delivery and payment details.`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,'_blank')
}

function submitLead(e){
  e.preventDefault();
  const f=new FormData(e.target);
  let msg='Hi NeutrapH, I would like to sign up / enquire.\n\n';

  for(const [k,v] of f.entries()){
    if(v) msg+=`${k}: ${v}\n`
  }

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,'_blank')
}

/* ✅ NEW EMAIL FUNCTION */
function submitLeadEmail(){
  const form = document.querySelector(".form");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const f = new FormData(form);
  let msg = "New NeutrapH Order / Subscription Enquiry\n\n";

  for(const [k,v] of f.entries()){
    if(v) msg += `${k}: ${v}\n`;
  }

  const email = "info@neutraph.co.za";
  const subject = "New NeutrapH Enquiry";

  window.location.href =
    "mailto:" + email +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(msg);
}


// Global navigation alignment helper
(function(){
  const current = decodeURIComponent((location.pathname.split('/').pop() || 'index.html'));
  document.querySelectorAll('nav a').forEach(a => {
    const href = decodeURIComponent(a.getAttribute('href') || '');
    if(href === current || (current === '' && href === 'index.html')) a.classList.add('active');
  });
  document.addEventListener('click', function(e){
    const nav = document.querySelector('nav');
    const btn = document.querySelector('.menu-toggle');
    if(!nav || !btn) return;
    if(nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)){
      nav.classList.remove('open');
    }
  });
})();
