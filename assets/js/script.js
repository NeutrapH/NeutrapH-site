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

  const email = 'info@neutraph.co.za';
  const subject = 'New NeutrapH Enquiry';

  window.location.href =
    'mailto:' + email +
    '?subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(msg);
}

(function(){
  if(document.getElementById('neutraph-layout-polish')) return;

  const style = document.createElement('style');
  style.id = 'neutraph-layout-polish';
  style.textContent = `
    /* Header polish */
    @media(min-width:1051px){
      header .container.nav-wrap{
        max-width:1320px !important;
        min-height:104px !important;
        height:104px !important;
        gap:24px !important;
        padding-left:24px !important;
        padding-right:24px !important;
      }

      header .logo-area{
        flex:0 0 260px !important;
        min-width:260px !important;
      }

      header .site-logo,
      header .site-logo-img{
        height:96px !important;
        max-height:96px !important;
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
        min-width:134px !important;
        max-width:none !important;
        height:48px !important;
        min-height:48px !important;
        padding:0 18px !important;
        gap:8px !important;
        border-radius:999px !important;
        background:#25d366 !important;
        border:1px solid rgba(18,140,126,.18) !important;
        color:#fff !important;
        box-shadow:0 10px 24px rgba(37,211,102,.24) !important;
        font-size:14px !important;
        font-weight:900 !important;
        line-height:1 !important;
        white-space:nowrap !important;
        overflow:visible !important;
        text-shadow:none !important;
      }

      header .header-cta:hover{
        background:#1ebe5d !important;
        box-shadow:0 14px 30px rgba(37,211,102,.32) !important;
        transform:translateY(-1px) !important;
      }

      header .header-cta .wa-icon-sm,
      header .header-cta img.wa-icon-sm{
        width:20px !important;
        height:20px !important;
        flex:0 0 20px !important;
        padding:2px !important;
        border-radius:50% !important;
        background:#fff !important;
        box-shadow:none !important;
      }
    }

    @media(min-width:1051px) and (max-width:1260px){
      header .container.nav-wrap{
        max-width:1180px !important;
        gap:16px !important;
        padding-left:18px !important;
        padding-right:18px !important;
      }

      header .logo-area{
        flex-basis:220px !important;
        min-width:220px !important;
      }

      header .site-logo,
      header .site-logo-img{
        height:84px !important;
        max-height:84px !important;
      }

      header nav{
        gap:11px !important;
      }

      header nav a{
        font-size:13px !important;
      }

      header .header-cta{
        min-width:124px !important;
        height:44px !important;
        min-height:44px !important;
        padding:0 14px !important;
        font-size:13px !important;
      }
    }

    @media(max-width:1050px){
      header .site-logo,
      header .site-logo-img{
        height:72px !important;
        max-height:72px !important;
        transform:none !important;
      }
    }

    @media(max-width:760px){
      header .site-logo,
      header .site-logo-img{
        height:68px !important;
        max-height:68px !important;
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

    /* Footer and WhatsApp polish */
    .footer-logo-img{
      width:180px !important;
      max-width:180px !important;
      height:auto !important;
      margin-bottom:16px !important;
      filter:drop-shadow(0 10px 18px rgba(0,0,0,.18));
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
      background:#25d366 !important;
      border-color:transparent !important;
      box-shadow:0 12px 26px rgba(37,211,102,.25) !important;
    }

    .social-btn[href*="wa.me"]:hover{
      background:#1ebe5d !important;
      box-shadow:0 16px 34px rgba(37,211,102,.34) !important;
    }

    .social-btn[href*="wa.me"] img{
      width:24px !important;
      height:24px !important;
    }

    .sticky-mobile-cta{
      border-radius:999px !important;
      background:linear-gradient(135deg,#25d366 0%,#128c7e 100%) !important;
      box-shadow:0 14px 34px rgba(0,0,0,.24) !important;
    }
  `;
  document.head.appendChild(style);
})();

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
