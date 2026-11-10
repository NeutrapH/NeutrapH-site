const phone = '27798134597';
function toggleMenu(){const nav=document.querySelector('nav');const button=document.querySelector('.menu-toggle');const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close menu':'Open menu');}
function orderProduct(product){const input=document.getElementById('qty-'+product.replace(/[^a-z0-9]/gi,''));const qty=input?input.value:'1';const msg='Hi NeutrapH, I am interested in the planned '+product+' (quantity: '+qty+'). Please share information about launch availability. This is an enquiry, not an order.';window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(msg),'_blank','noopener');}
(function setupEnquiryForm() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  const interest = form.elements.namedItem('Interest');
  const params = new URLSearchParams(location.search);
  const chosen = params.get('plan') || params.get('service');
  if (Array.from(interest.options).some(option => option.value === chosen)) {
    interest.value = chosen;
  }

  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-confirmation');
  const endpoint = form.getAttribute('action');
  const configured = /^https:\/\/formspree\.io\/f\/[a-z0-9]+$/i.test(endpoint || '');

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled) return;
    if (!configured) {
      status.dataset.state = 'error';
      status.textContent = 'The form is temporarily unavailable. Please email us directly or chat on WhatsApp below.';
      return;
    }

    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = '';

    try {
      const enquiry = new FormData(form);
      enquiry.set('Interest', interest.selectedOptions[0].textContent);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: enquiry,
        redirect: 'error'
      });
      const result = await response.json();
      if (!response.ok || typeof result?.next !== 'string') {
        throw new Error('Form submission was not accepted');
      }

      form.reset();
      status.dataset.state = 'success';
      status.textContent = 'Thank you for your enquiry. A NeutrapH representative will get back to you within 24 hours.';
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'We couldn’t confirm your enquiry was sent. Please try again, email us directly or chat on WhatsApp below.';
    } finally {
      button.textContent = 'Send';
      button.disabled = false;
    }
  });

  button.disabled = false;
})();




(function(){
  const current = decodeURIComponent((location.pathname.split('/').pop() || 'index.html'));
  document.querySelectorAll('nav a').forEach(a => {
    const page = a.dataset.page;
    if(page === current) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });


  document.addEventListener('click', function(e){
    const nav = document.querySelector('nav');
    const btn = document.querySelector('.menu-toggle');
    if(!nav || !btn) return;
    if(nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)){
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
    }
  });
})();



document.addEventListener('keydown', function(event){if(event.key!=='Escape')return;const nav=document.querySelector('nav');const button=document.querySelector('.menu-toggle');if(nav&&button&&nav.classList.contains('open')){nav.classList.remove('open');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open menu');button.focus();}});
