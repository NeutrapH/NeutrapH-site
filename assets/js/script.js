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

(function(){
  if(document.getElementById('neutraph-header-footer-polish')) return;

  const style=document.createElement('style');
  style.id='neutraph-header-footer-polish';
  style.textContent=`
    @media(min-width:1051px){
      .nav-wrap{min-height:118px;padding-left:12px;padding-right:12px;}
      .logo-area{min-width:320px;}
      .site-logo,.site-logo-img{height:112px;max-height:112px;transform:scale(1.12);transform-origin:left center;}
    }

    .header-cta{
      min-width:0;
      min-height:58px;
      padding:14px 28px;
      gap:11px;
      border-radius:999px;
      background:linear-gradient(135deg,#0795d2 0%,#006da8 100%);
      border:1px solid rgba(255,255,255,.45);
      color:#fff;
      box-shadow:0 16px 34px rgba(0,119,182,.24);
      line-height:1;
      white-space:nowrap;
      text-align:center;
    }

    .header-cta:hover{
      background:linear-gradient(135deg,#007fbb 0%,#064b7a 100%);
      box-shadow:0 20px 42px rgba(0,77,126,.28);
      transform:translateY(-2px);
    }

    .header-cta .wa-icon-sm,
    .header-cta img.wa-icon-sm{
      width:24px;
      height:24px;
      flex:0 0 24px;
      padding:3px;
      border-radius:50%;
      background:#fff;
      box-shadow:0 3px 8px rgba(0,45,70,.18);
    }

    .footer-logo-img{
      width:180px;
      max-width:180px;
      height:auto;
      margin-bottom:16px;
      filter:drop-shadow(0 10px 18px rgba(0,0,0,.18));
    }

    .social-row{align-items:center;gap:12px;}

    .social-btn{
      background:rgba(255,255,255,.08);
      border-color:rgba(255,255,255,.22);
      transition:transform .2s ease, background .2s ease, border-color .2s ease, box-shadow .2s ease;
    }

    .social-btn:hover{
      background:rgba(255,255,255,.14);
      border-color:rgba(255,255,255,.36);
      transform:translateY(-2px);
    }

    .social-btn[href*="wa.me"]{
      width:48px;
      height:48px;
      border-radius:50%;
      background:#25d366;
      border-color:transparent;
      box-shadow:0 12px 26px rgba(37,211,102,.25);
    }

    .social-btn[href*="wa.me"]:hover{
      background:#1ebe5d;
      box-shadow:0 16px 34px rgba(37,211,102,.34);
    }

    .social-btn[href*="wa.me"] img{width:24px;height:24px;}

    .sticky-mobile-cta{
      border-radius:999px;
      background:linear-gradient(135deg,#25d366 0%,#128c7e 100%);
      box-shadow:0 14px 34px rgba(0,0,0,.24);
    }

    @media(max-width:1120px){
      .nav-wrap{min-height:102px;}
      .logo-area{min-width:260px;}
      .site-logo,.site-logo-img{height:90px;max-height:90px;transform:none;}
      .header-cta{min-height:52px;padding:12px 20px;font-size:14px;}
    }

    @media(max-width:1050px){
      .nav-wrap{min-height:78px;}
      .logo-area{min-width:auto;}
      .site-logo,.site-logo-img{height:72px;max-height:72px;}
    }

    @media(max-width:760px){
      .site-logo,.site-logo-img{height:68px;max-height:68px;}
      .footer-logo-img{width:160px;max-width:160px;}
    }
  `;
  document.head.appendChild(style);
})();

(function(){
  if(document.getElementById('neutraph-hero-alignment')) return;

  const style=document.createElement('style');
  style.id='neutraph-hero-alignment';
  style.textContent=`
    @media(min-width:761px){
      .page-water-purification .page-hero .container,
      .page-water-dispensers .dispenser-hero-modern .container,
      .page-our-shop .shop-hero-modern .container{
        max-width:var(--page-max,1200px) !important;
        width:100% !important;
        margin-left:auto !important;
        margin-right:auto !important;
        padding-left:40px !important;
        padding-right:40px !important;
        justify-content:flex-start !important;
        justify-items:start !important;
        align-items:center !important;
      }

      .page-water-purification .page-hero .container{
        display:flex !important;
        flex-direction:column !important;
        text-align:left !important;
      }

      .page-water-purification .page-hero h1,
      .page-water-purification .page-hero p{
        width:100% !important;
        max-width:620px !important;
        margin-left:0 !important;
        margin-right:auto !important;
        text-align:left !important;
      }

      .page-water-dispensers .dispenser-hero-modern .hero-content,
      .page-our-shop .shop-hero-modern .hero-content{
        max-width:620px !important;
        margin-left:0 !important;
        margin-right:auto !important;
        text-align:left !important;
      }

      .page-water-dispensers .dispenser-hero-modern .hero-buttons,
      .page-our-shop .shop-hero-modern .hero-buttons{
        justify-content:flex-start !important;
        margin-left:0 !important;
        margin-right:auto !important;
      }
    }
  `;
  document.head.appendChild(style);
})();

(function(){
  if(document.getElementById('neutraph-hero-size-match')) return;

  const style=document.createElement('style');
  style.id='neutraph-hero-size-match';
  style.textContent=`
    @media(min-width:901px){
      .hero.hero-home-modern,
      .page-hero,
      .subscriptions-hero,
      .refill-hero,
      .dispenser-hero-modern,
      .shop-hero-modern{
        min-height:720px !important;
      }

      .hero.hero-home-modern .hero-home-content,
      .page-hero .container,
      .subscriptions-hero .container,
      .refill-hero .container,
      .dispenser-hero-modern .container,
      .shop-hero-modern .container{
        min-height:720px !important;
      }
    }

    @media(max-width:900px){
      .hero.hero-home-modern,
      .page-hero,
      .subscriptions-hero,
      .refill-hero,
      .dispenser-hero-modern,
      .shop-hero-modern{
        min-height:660px !important;
      }

      .hero.hero-home-modern .hero-home-content,
      .page-hero .container,
      .subscriptions-hero .container,
      .refill-hero .container,
      .dispenser-hero-modern .container,
      .shop-hero-modern .container{
        min-height:660px !important;
      }
    }
  `;
  document.head.appendChild(style);
})();

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
