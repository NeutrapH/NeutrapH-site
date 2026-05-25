const phone = '27798134597';

function toggleMenu(){
  document.querySelector('nav').classList.toggle('open');
}

function toggleInfo(btn){
  const info = btn.nextElementSibling;
  const hidden = info.style.display === 'none' || !info.style.display;
  info.style.display = hidden ? 'block' : 'none';
  btn.textContent = hidden ? 'Hide Product Information' : 'View Product Information';
}

function toggleIngredients(btn){
  const info = btn.nextElementSibling;
  const hidden = info.style.display === 'none' || !info.style.display;
  info.style.display = hidden ? 'block' : 'none';
  btn.textContent = hidden ? 'Hide Ingredients' : 'View Ingredients';
}

function toggleProductInfo(id){
  const info = document.getElementById(id);
  if(!info) return;
  const hidden = info.style.display === 'none' || !info.style.display;
  info.style.display = hidden ? 'block' : 'none';
}

function orderProduct(product){
  const qtyField = document.getElementById('qty-' + product.replace(/[^a-z0-9]/gi, ''));
  const qty = qtyField ? qtyField.value : '1';
  const msg = `Hi NeutrapH, I would like to order ${qty} x ${product}. Please confirm delivery and payment details.`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

function submitLead(e){
  e.preventDefault();
  const f = new FormData(e.target);
  let msg = 'Hi NeutrapH, I would like to sign up / enquire.\n\n';

  for(const [k, v] of f.entries()){
    if(v) msg += `${k}: ${v}\n`;
  }

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

function submitLeadEmail(){
  const form = document.querySelector('.form');
  if(!form) return;

  if(!form.checkValidity()){
    form.reportValidity();
    return;
  }

  const f = new FormData(form);
  let msg = 'New NeutrapH Order / Subscription Enquiry\n\n';

  for(const [k, v] of f.entries()){
    if(v) msg += `${k}: ${v}\n`;
  }

  window.location.href =
    'mailto:info@neutraph.co.za' +
    '?subject=' + encodeURIComponent('New NeutrapH Enquiry') +
    '&body=' + encodeURIComponent(msg);
}

(function(){
  if(document.getElementById('neutraph-layout-polish')) return;

  const style = document.createElement('style');
  style.id = 'neutraph-layout-polish';
  style.textContent = `
    /* Header logo and CTA polish */
    @media(min-width:1051px){
      header .container.nav-wrap{
        max-width:1340px !important;
        min-height:118px !important;
        height:118px !important;
        gap:22px !important;
        padding-left:24px !important;
        padding-right:24px !important;
      }

      header .logo-area{
        flex:0 0 310px !important;
        min-width:310px !important;
      }

      header .site-logo,
      header .site-logo-img{
        height:124px !important;
        max-height:124px !important;
        width:auto !important;
        transform:none !important;
      }

      header nav{
        flex:1 1 auto !important;
        min-width:0 !important;
        justify-content:flex-end !important;
        gap:18px !important;
      }

      header nav a{
        flex:0 0 auto !important;
        font-size:15px !important;
        padding-left:2px !important;
        padding-right:2px !important;
      }

      header .header-cta{
        flex:0 0 auto !important;
        width:auto !important;
        min-width:146px !important;
        max-width:none !important;
        height:52px !important;
        min-height:52px !important;
        padding:0 20px !important;
        gap:9px !important;
        border-radius:999px !important;
        background:linear-gradient(135deg,#00b4d8 0%,#0077b6 52%,#0a3d6b 100%) !important;
        border:1px solid rgba(0,180,216,.36) !important;
        color:#fff !important;
        box-shadow:0 12px 28px rgba(0,119,182,.24) !important;
        font-size:14px !important;
        font-weight:900 !important;
        line-height:1 !important;
        white-space:nowrap !important;
        overflow:visible !important;
        text-shadow:none !important;
      }

      header .header-cta:hover{
        background:linear-gradient(135deg,#0a9fca 0%,#006da8 52%,#062f68 100%) !important;
        box-shadow:0 16px 34px rgba(0,77,126,.30) !important;
        transform:translateY(-1px) !important;
      }

      header .header-cta .wa-icon-sm,
      header .header-cta img.wa-icon-sm{
        width:21px !important;
        height:21px !important;
        flex:0 0 21px !important;
        padding:3px !important;
        border-radius:50% !important;
        background:#fff !important;
        box-shadow:0 3px 8px rgba(0,45,70,.14) !important;
      }
    }

    @media(min-width:1051px) and (max-width:1260px){
      header .container.nav-wrap{
        max-width:1200px !important;
        min-height:106px !important;
        height:106px !important;
        gap:14px !important;
        padding-left:18px !important;
        padding-right:18px !important;
      }

      header .logo-area{
        flex-basis:250px !important;
        min-width:250px !important;
      }

      header .site-logo,
      header .site-logo-img{
        height:106px !important;
        max-height:106px !important;
      }

      header nav{ gap:10px !important; }
      header nav a{ font-size:13px !important; }

      header .header-cta{
        min-width:132px !important;
        height:48px !important;
        min-height:48px !important;
        padding:0 16px !important;
        font-size:13px !important;
      }
    }

    @media(max-width:1050px){
      header .site-logo,
      header .site-logo-img{
        height:78px !important;
        max-height:78px !important;
        transform:none !important;
      }
    }

    @media(max-width:760px){
      header .site-logo,
      header .site-logo-img{
        height:72px !important;
        max-height:72px !important;
      }
    }

    /* One actual hero height across the site. */
    @media(min-width:901px){
      .hero.hero-home-modern,
      .page-hero,
      .subscriptions-hero,
      .refill-hero,
      .dispenser-hero-modern,
      .shop-hero-modern{
        height:720px !important;
        min-height:720px !important;
        max-height:720px !important;
        padding-top:0 !important;
        padding-bottom:0 !important;
        display:flex !important;
        align-items:center !important;
        overflow:hidden !important;
      }

      .hero.hero-home-modern .hero-home-content,
      .page-hero > .container,
      .subscriptions-hero > .container,
      .refill-hero > .container,
      .dispenser-hero-modern > .container,
      .shop-hero-modern > .container{
        height:720px !important;
        min-height:0 !important;
        max-height:720px !important;
        padding-top:0 !important;
        padding-bottom:0 !important;
        display:flex !important;
        align-items:center !important;
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
        padding-top:0 !important;
        padding-bottom:0 !important;
        overflow:hidden !important;
      }

      .hero.hero-home-modern .hero-home-content,
      .page-hero > .container,
      .subscriptions-hero > .container,
      .refill-hero > .container,
      .dispenser-hero-modern > .container,
      .shop-hero-modern > .container{
        min-height:660px !important;
        padding-top:0 !important;
        padding-bottom:0 !important;
      }
    }

    /* Match the home page text lane on secondary heroes. */
    @media(min-width:761px){
      .page-hero > .container,
      .subscriptions-hero > .container,
      .refill-hero > .container,
      .dispenser-hero-modern > .container,
      .shop-hero-modern > .container{
        max-width:var(--page-max,1200px) !important;
        width:100% !important;
        margin-left:auto !important;
        margin-right:auto !important;
        padding-left:40px !important;
        padding-right:40px !important;
        justify-content:flex-start !important;
        justify-items:start !important;
        text-align:left !important;
      }

      .page-hero > .container{
        flex-direction:column !important;
        align-items:flex-start !important;
        justify-content:center !important;
      }

      .page-hero h1,
      .page-hero p,
      .subscriptions-hero .hero-text,
      .refill-hero .refill-text,
      .dispenser-hero-modern .hero-content,
      .shop-hero-modern .hero-content{
        max-width:620px !important;
        margin-left:0 !important;
        margin-right:auto !important;
        text-align:left !important;
      }

      .hero-buttons,
      .hero-btns,
      .hero-actions{
        justify-content:flex-start !important;
        margin-left:0 !important;
        margin-right:auto !important;
      }
    }

    /* Homepage lower-section upgrade */
    .page-index .home-proof-strip{
      background:linear-gradient(180deg,#ffffff 0%,#f6fbff 100%) !important;
      border-bottom:1px solid #dceefa !important;
      position:relative !important;
      z-index:4 !important;
    }

    .page-index .home-proof-grid{
      display:grid !important;
      grid-template-columns:repeat(4,minmax(0,1fr)) !important;
      background:#fff !important;
      border:1px solid #d9edf9 !important;
      border-radius:8px !important;
      box-shadow:0 18px 48px rgba(5,77,126,.12) !important;
      overflow:hidden !important;
      transform:translateY(-34px) !important;
      margin-bottom:-34px !important;
      padding:0 !important;
    }

    .page-index .home-proof-grid > div{
      padding:22px 20px !important;
      border-right:1px solid #e3f2fb !important;
      min-height:118px !important;
      display:flex !important;
      flex-direction:column !important;
      justify-content:center !important;
      gap:6px !important;
    }

    .page-index .home-proof-grid > div:last-child{ border-right:0 !important; }

    .page-index .home-proof-grid strong{
      font-family:'Montserrat',sans-serif !important;
      color:#0a3d6b !important;
      font-size:17px !important;
      line-height:1.2 !important;
    }

    .page-index .home-proof-grid span{
      color:#52627a !important;
      font-size:13px !important;
      line-height:1.55 !important;
    }

    .page-index .home-services,
    .page-index .home-plans{
      background:linear-gradient(180deg,#f6fbff 0%,#ffffff 100%) !important;
    }

    .page-index .home-services .section-title,
    .page-index .home-process .section-title,
    .page-index .home-plans .section-title,
    .page-index .home-contact .section-title{
      max-width:760px !important;
      letter-spacing:0 !important;
    }

    .page-index .home-services .grid-3{
      grid-template-columns:repeat(3,minmax(0,1fr)) !important;
      gap:20px !important;
    }

    .page-index .home-services .card{
      border-radius:8px !important;
      border:1px solid #dceefa !important;
      box-shadow:0 14px 34px rgba(6,65,110,.09) !important;
      overflow:hidden !important;
      background:#fff !important;
      display:grid !important;
      grid-template-rows:230px 1fr !important;
    }

    .page-index .home-services .card:hover{
      transform:translateY(-4px) !important;
      box-shadow:0 20px 44px rgba(6,65,110,.14) !important;
    }

    .page-index .home-services .card-img{
      height:230px !important;
      background:linear-gradient(145deg,#eef8ff,#ffffff) !important;
      border-bottom:1px solid #e2f1fb !important;
    }

    .page-index .home-services .card-img img{
      object-fit:contain !important;
      object-position:center !important;
      padding:18px !important;
      transform:none !important;
    }

    .page-index .home-services .card-body{
      padding:24px !important;
      display:flex !important;
      flex-direction:column !important;
      align-items:flex-start !important;
    }

    .page-index .home-services .card-body h3{
      font-size:18px !important;
      color:#082b57 !important;
    }

    .page-index .home-services .card-body p{
      flex:1 1 auto !important;
      margin-bottom:18px !important;
      color:#52627a !important;
    }

    .page-index .home-services .text-link{
      min-height:40px !important;
      padding:0 14px !important;
      border-radius:999px !important;
      display:inline-flex !important;
      align-items:center !important;
      background:#eef8ff !important;
      color:#0077b6 !important;
    }

    .page-index .home-process{
      background:#fff !important;
      position:relative !important;
    }

    .page-index .home-process .how-grid{
      gap:18px !important;
      text-align:left !important;
    }

    .page-index .home-process .step{
      border-radius:8px !important;
      border:1px solid #dceefa !important;
      box-shadow:0 14px 34px rgba(6,65,110,.08) !important;
      padding:28px !important;
      background:linear-gradient(180deg,#ffffff 0%,#f8fcff 100%) !important;
    }

    .page-index .home-process .step-num{
      width:48px !important;
      height:48px !important;
      border-radius:8px !important;
      background:linear-gradient(135deg,#00b4d8,#0077b6) !important;
      box-shadow:0 10px 22px rgba(0,119,182,.20) !important;
    }

    .page-index .home-plans .sub-plans-grid{
      align-items:stretch !important;
      gap:20px !important;
    }

    .page-index .home-plans .sub-card{
      border-radius:8px !important;
      border:1px solid #dceefa !important;
      box-shadow:0 16px 38px rgba(6,65,110,.10) !important;
      display:flex !important;
      flex-direction:column !important;
      overflow:hidden !important;
    }

    .page-index .home-plans .sub-card--featured{
      border:2px solid #00b4d8 !important;
      transform:translateY(-10px) !important;
      box-shadow:0 24px 54px rgba(0,119,182,.18) !important;
    }

    .page-index .home-plans .sub-card-header{
      background:linear-gradient(135deg,#062f68 0%,#0077b6 72%,#00b4d8 100%) !important;
      padding:28px !important;
    }

    .page-index .home-plans .sub-card-img{
      height:210px !important;
      background:#f4fbff !important;
    }

    .page-index .home-plans .sub-card-img img{
      object-fit:contain !important;
      padding:18px !important;
    }

    .page-index .home-plans .sub-features{
      flex:1 1 auto !important;
    }

    .page-index .home-plans .sub-btn{
      border-radius:8px !important;
      margin-top:auto !important;
    }

    .page-index .home-trust{
      background:linear-gradient(135deg,#06243d 0%,#063b77 54%,#0077b6 100%) !important;
      overflow:hidden !important;
    }

    .page-index .home-trust .trust-grid{
      grid-template-columns:repeat(4,minmax(0,1fr)) !important;
      gap:16px !important;
    }

    .page-index .home-trust .trust-box{
      text-align:left !important;
      border-radius:8px !important;
      padding:26px !important;
      min-height:170px !important;
      background:rgba(255,255,255,.10) !important;
      border:1px solid rgba(255,255,255,.20) !important;
      box-shadow:0 18px 36px rgba(0,22,48,.16) !important;
    }

    .page-index .home-trust .trust-box h3{
      font-size:17px !important;
      margin-top:0 !important;
    }

    .page-index .home-contact{
      background:linear-gradient(180deg,#ffffff 0%,#eef8ff 100%) !important;
    }

    .page-index .home-contact .form-wrap{
      grid-template-columns:.9fr 1.1fr !important;
      gap:36px !important;
      align-items:center !important;
    }

    .page-index .home-contact .form-card{
      border-radius:8px !important;
      border:1px solid #d6ebf8 !important;
      box-shadow:0 20px 48px rgba(6,65,110,.12) !important;
    }

    .page-index .home-contact .payment-box{
      border-radius:8px !important;
      background:linear-gradient(135deg,#eef8ff,#ffffff) !important;
    }

    .page-index .home-contact .btn-blue,
    .page-index .home-contact .btn-email{
      border-radius:8px !important;
    }

    @media(max-width:1050px){
      .page-index .home-proof-grid,
      .page-index .home-trust .trust-grid{
        grid-template-columns:repeat(2,minmax(0,1fr)) !important;
      }

      .page-index .home-proof-grid > div:nth-child(2){ border-right:0 !important; }
      .page-index .home-proof-grid > div:nth-child(-n+2){ border-bottom:1px solid #e3f2fb !important; }

      .page-index .home-services .grid-3,
      .page-index .home-plans .sub-plans-grid{
        grid-template-columns:repeat(2,minmax(0,1fr)) !important;
      }

      .page-index .home-contact .form-wrap{
        grid-template-columns:1fr !important;
      }

      .page-index .home-plans .sub-card--featured{
        transform:none !important;
      }
    }

    @media(max-width:700px){
      .page-index .home-proof-strip{
        padding-top:18px !important;
      }

      .page-index .home-proof-grid{
        grid-template-columns:1fr !important;
        transform:none !important;
        margin-bottom:0 !important;
      }

      .page-index .home-proof-grid > div{
        border-right:0 !important;
        border-bottom:1px solid #e3f2fb !important;
        min-height:auto !important;
      }

      .page-index .home-proof-grid > div:last-child{ border-bottom:0 !important; }

      .page-index .home-services .grid-3,
      .page-index .home-process .how-grid,
      .page-index .home-plans .sub-plans-grid,
      .page-index .home-trust .trust-grid{
        grid-template-columns:1fr !important;
      }

      .page-index .home-services .card{
        grid-template-rows:210px 1fr !important;
      }

      .page-index .home-services .card-img,
      .page-index .home-plans .sub-card-img{
        height:210px !important;
      }

      .page-index .home-trust .trust-box{
        min-height:auto !important;
      }
    }

    /* Footer and mobile WhatsApp polish */
    .footer-logo-img{
      width:240px !important;
      max-width:240px !important;
      height:auto !important;
      margin-bottom:18px !important;
      filter:drop-shadow(0 12px 22px rgba(0,0,0,.20));
    }

    .social-row{
      align-items:center !important;
      gap:12px !important;
    }

    .social-btn{
      background:rgba(255,255,255,.08) !important;
      border-color:rgba(255,255,255,.22) !important;
      transition:transform .2s ease, background .2s ease, border-color .2s ease, box-shadow .2s ease !important;
    }

    .social-btn:hover{
      background:rgba(255,255,255,.14) !important;
      border-color:rgba(255,255,255,.36) !important;
      transform:translateY(-2px) !important;
    }

    .social-btn[href*="wa.me"]{
      width:48px !important;
      height:48px !important;
      border-radius:50% !important;
      background:linear-gradient(135deg,#00b4d8 0%,#0077b6 58%,#0a3d6b 100%) !important;
      border-color:rgba(255,255,255,.18) !important;
      box-shadow:0 12px 26px rgba(0,119,182,.26) !important;
    }

    .social-btn[href*="wa.me"]:hover{
      background:linear-gradient(135deg,#0a9fca 0%,#006da8 58%,#062f68 100%) !important;
      box-shadow:0 16px 34px rgba(0,77,126,.32) !important;
    }

    .social-btn[href*="wa.me"] img{
      width:24px !important;
      height:24px !important;
      padding:2px !important;
      border-radius:50% !important;
      background:#fff !important;
    }

    .sticky-mobile-cta{
      border-radius:999px !important;
      background:linear-gradient(135deg,#00b4d8 0%,#0077b6 58%,#0a3d6b 100%) !important;
      box-shadow:0 14px 34px rgba(0,77,126,.30) !important;
    }

    @media(max-width:760px){
      .footer-logo-img{
        width:200px !important;
        max-width:200px !important;
      }
    }
  `;
  document.head.appendChild(style);
})();

function normalizeHeroHeights(){
  const desktop = window.matchMedia('(min-width: 901px)').matches;
  const heroHeight = desktop ? '720px' : '660px';
  const heroSelectors = [
    '.hero.hero-home-modern',
    '.page-hero',
    '.subscriptions-hero',
    '.refill-hero',
    '.dispenser-hero-modern',
    '.shop-hero-modern'
  ];
  const contentSelectors = [
    '.hero.hero-home-modern .hero-home-content',
    '.page-hero > .container',
    '.subscriptions-hero > .container',
    '.refill-hero > .container',
    '.dispenser-hero-modern > .container',
    '.shop-hero-modern > .container'
  ];

  document.querySelectorAll(heroSelectors.join(',')).forEach(hero => {
    hero.style.setProperty('min-height', heroHeight, 'important');
    hero.style.setProperty('padding-top', '0', 'important');
    hero.style.setProperty('padding-bottom', '0', 'important');
    hero.style.setProperty('display', 'flex', 'important');
    hero.style.setProperty('align-items', 'center', 'important');
    hero.style.setProperty('overflow', 'hidden', 'important');

    if(desktop){
      hero.style.setProperty('height', heroHeight, 'important');
      hero.style.setProperty('max-height', heroHeight, 'important');
    }else{
      hero.style.removeProperty('height');
      hero.style.removeProperty('max-height');
    }
  });

  document.querySelectorAll(contentSelectors.join(',')).forEach(content => {
    content.style.setProperty('padding-top', '0', 'important');
    content.style.setProperty('padding-bottom', '0', 'important');
    content.style.setProperty('display', 'flex', 'important');
    content.style.setProperty('align-items', 'center', 'important');

    if(desktop){
      content.style.setProperty('height', heroHeight, 'important');
      content.style.setProperty('min-height', '0', 'important');
      content.style.setProperty('max-height', heroHeight, 'important');
    }else{
      content.style.removeProperty('height');
      content.style.setProperty('min-height', heroHeight, 'important');
      content.style.removeProperty('max-height');
    }
  });
}

(function(){
  const current = decodeURIComponent((location.pathname.split('/').pop() || 'index.html'));
  document.querySelectorAll('nav a').forEach(a => {
    const href = decodeURIComponent(a.getAttribute('href') || '');
    if(href === current || (current === '' && href === 'index.html')) a.classList.add('active');
  });

  normalizeHeroHeights();
  window.addEventListener('load', normalizeHeroHeights);
  window.addEventListener('resize', normalizeHeroHeights);

  document.addEventListener('click', function(e){
    const nav = document.querySelector('nav');
    const btn = document.querySelector('.menu-toggle');
    if(!nav || !btn) return;
    if(nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)){
      nav.classList.remove('open');
    }
  });
})();
