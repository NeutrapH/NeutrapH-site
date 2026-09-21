const phone = '27798134597';
function toggleMenu(){const nav=document.querySelector('nav');const button=document.querySelector('.menu-toggle');const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close menu':'Open menu');}
function orderProduct(product){const input=document.getElementById('qty-'+product.replace(/[^a-z0-9]/gi,''));const qty=input?input.value:'1';const msg='Hi NeutrapH, I am interested in the planned '+product+' (quantity: '+qty+'). Please share information about launch availability. This is an enquiry, not an order.';window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(msg),'_blank','noopener');}
function enquiryText(form){const rows=['NeutrapH pre-launch enquiry (not an order)',''];for(const [key,value] of new FormData(form)){if(value){const field=form.elements.namedItem(key);const text=field&&field.tagName==='SELECT'?field.selectedOptions[0].textContent:value;rows.push(key+': '+text);}}return rows.join('\n');}
function validateEnquiry(form,channel){form.elements.namedItem('Phone').required=channel==='whatsapp';form.elements.namedItem('Email').required=channel==='email';return form.reportValidity();}
function showFormConfirmation(form){form.querySelector('.form-confirmation').textContent='Your draft is ready. Review and send it in your chosen app. This page has not submitted an enquiry or placed an order.';form.querySelector('#enquiry-copy').value=enquiryText(form);}
function submitLead(e){e.preventDefault();const form=e.target;if(!validateEnquiry(form,'whatsapp'))return;showFormConfirmation(form);window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(enquiryText(form)),'_blank','noopener');}
function submitLeadEmail(){const form=document.querySelector('.form');if(!form||!validateEnquiry(form,'email'))return;showFormConfirmation(form);window.location.href='mailto:info@neutraph.co.za?subject='+encodeURIComponent('NeutrapH pre-launch enquiry')+'&body='+encodeURIComponent(enquiryText(form));}
function prepareEnquiryCopy(button){const form=button.closest('form');const output=form.querySelector('#enquiry-copy');output.value=enquiryText(form);output.focus();output.select();}
(function(){const form=document.querySelector('.form');if(!form)return;const params=new URLSearchParams(location.search);const allowed=['starter','standard','business','general','packaged','dispenser','refill','purification'];const chosen=params.get('plan')||params.get('service');if(allowed.includes(chosen))form.elements.namedItem('Interest').value=chosen;form.querySelector('button[type="submit"]').addEventListener('click',()=>{form.elements.namedItem('Phone').required=true;form.elements.namedItem('Email').required=false;});})();




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
