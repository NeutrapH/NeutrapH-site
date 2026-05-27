/*
  NeutrapH PayFast frontend integration for GitHub Pages.

  REQUIRED SETUP:
  1. Replace PAYFAST_MERCHANT_ID_HERE with your live PayFast Merchant ID.
  2. Replace PAYFAST_MERCHANT_KEY_HERE with your live PayFast Merchant Key.
  3. Do not add your PayFast passphrase in this frontend file.
     The passphrase belongs only in the Vercel/Netlify environment variable:
     PAYFAST_PASSPHRASE.
  4. To use signed serverless checkout, set apiBase to your deployed backend URL.
     Example: apiBase: "https://neutraph-payfast.vercel.app"
*/

(function(){
  const PAYFAST_CONFIG = {
    merchantId: 'PAYFAST_MERCHANT_ID_HERE',
    merchantKey: 'PAYFAST_MERCHANT_KEY_HERE',
    mode: 'sandbox',
    apiBase: 'https://timely-pavlova-d74b5e.netlify.app',
    returnUrl: 'https://www.neutraph.co.za/payment-success.html',
    cancelUrl: 'https://www.neutraph.co.za/payment-cancelled.html',
    notifyUrl: 'https://www.neutraph.co.za/payment-notify'
  };

  const PRODUCTS = {
    'water-dispenser-option-1': { name: 'Water Dispenser Option 1', description: 'Standard hot and cold water dispenser', amount: '1999.99' },
    'water-dispenser-option-2': { name: 'Water Dispenser Option 2', description: 'Water dispenser with 5 stage RO filters', amount: '2499.99' },
    'water-dispenser-option-3': { name: 'Water Dispenser Option 3', description: 'Premium water dispenser', amount: '2999.99' },
    'subscription-starter': { name: 'Subscription Package', description: 'Starter subscription package - R299/month', amount: '299.00' },
    'subscription-standard': { name: 'Standard Subscription Package', description: 'Standard subscription package - R499/month', amount: '499.00' },
    'subscription-business': { name: 'Business Subscription Package', description: 'Business subscription package - R899/month', amount: '899.00' },
    'pack-water-500ml-6pack': { name: '6x500ml Water Bottles', description: '6 pack of 500ml NeutrapH water bottles', amount: '49.99', quantitySelectId: 'qty-6x500mlWaterBottles' },
    'pack-water-1-5l-6pack': { name: '6x1.5L Water Bottles', description: '6 pack of 1.5L NeutrapH water bottles', amount: '99.99', quantitySelectId: 'qty-6x15LWaterBottles' },
    'pack-water-5l': { name: '5L Water Bottle', description: '5L NeutrapH water bottle', amount: '39.99', quantitySelectId: 'qty-5LWaterBottle' },
    'pack-water-10l': { name: '10L Water Bottle', description: '10L NeutrapH water bottle', amount: '59.99', quantitySelectId: 'qty-10LWaterBottle' },
    'pack-water-18-9l': { name: '18.9L Water Dispenser Bottle', description: '18.9L reusable NeutrapH water dispenser bottle', amount: '119.99', quantitySelectId: 'qty-189LWaterDispenserBottle' }
  };

  const PAYFAST_HOSTS = {
    sandbox: 'https://sandbox.payfast.co.za/eng/process',
    live: 'https://www.payfast.co.za/eng/process'
  };

  function money(value){ return Number(value).toFixed(2); }

  function getQuantity(product){
    const select = product.quantitySelectId ? document.getElementById(product.quantitySelectId) : null;
    const quantity = select ? parseInt(select.value, 10) : 1;
    return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
  }

  function isMissingStaticCredentials(){
    return !PAYFAST_CONFIG.merchantId ||
      !PAYFAST_CONFIG.merchantKey ||
      PAYFAST_CONFIG.merchantId === 'PAYFAST_MERCHANT_ID_HERE' ||
      PAYFAST_CONFIG.merchantKey === 'PAYFAST_MERCHANT_KEY_HERE';
  }

  function buildStaticFields(productId){
    const product = PRODUCTS[productId];
    const quantity = getQuantity(product);
    const total = money(Number(product.amount) * quantity);

    return {
      merchant_id: PAYFAST_CONFIG.merchantId,
      merchant_key: PAYFAST_CONFIG.merchantKey,
      return_url: PAYFAST_CONFIG.returnUrl,
      cancel_url: PAYFAST_CONFIG.cancelUrl,
      notify_url: PAYFAST_CONFIG.notifyUrl,
      m_payment_id: `NP-${Date.now()}-${productId}`,
      amount: total,
      item_name: product.name,
      item_description: quantity > 1 ? `${product.description} x ${quantity}` : product.description,
      custom_str1: productId,
      custom_int1: String(quantity)
    };
  }

  function submitPayFastForm(action, fields){
    const form = document.createElement('form');
    form.method = 'post';
    form.action = action;
    form.style.display = 'none';

    Object.entries(fields).forEach(([name, value]) => {
      if(value === undefined || value === null || value === '') return;
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }

  async function submitSignedCheckout(productId){
    const product = PRODUCTS[productId];
    const quantity = getQuantity(product);
    const response = await fetch(`${PAYFAST_CONFIG.apiBase.replace(/\/$/, '')}/api/payfast/create-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });

    if(!response.ok) throw new Error('Could not create PayFast checkout');
    const checkout = await response.json();
    submitPayFastForm(checkout.action, checkout.fields);
  }

  async function handlePayFastClick(productId, button){
    if(button.disabled) return;
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Opening PayFast...';

    try{
      if(PAYFAST_CONFIG.apiBase){
        await submitSignedCheckout(productId);
        return;
      }

      if(isMissingStaticCredentials()){
        alert('PayFast is almost ready. Add your PayFast Merchant ID and Merchant Key in assets/js/payfast.js first.');
        return;
      }

      submitPayFastForm(PAYFAST_HOSTS[PAYFAST_CONFIG.mode] || PAYFAST_HOSTS.sandbox, buildStaticFields(productId));
    }catch(error){
      console.error(error);
      alert('PayFast checkout could not be opened. Please try WhatsApp ordering or contact NeutrapH.');
    }finally{
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  function createPayFastBlock(productId){
    const product = PRODUCTS[productId];
    if(!product) return null;

    const wrap = document.createElement('div');
    wrap.className = 'payfast-card-actions';
    wrap.dataset.payfastProduct = productId;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'payfast-btn';
    button.textContent = 'Pay with PayFast';
    button.addEventListener('click', () => handlePayFastClick(productId, button));

    const note = document.createElement('small');
    note.textContent = `Secure PayFast checkout - R${product.amount}`;

    wrap.appendChild(button);
    wrap.appendChild(note);
    return wrap;
  }

  function appendPayment(card, productId){
    if(!card || card.querySelector('[data-payfast-product]')) return;
    const block = createPayFastBlock(productId);
    if(block) card.appendChild(block);
  }

  function addDispenserButtons(){
    if(!document.body.classList.contains('page-water-dispensers')) return;
    document.querySelectorAll('.shop-card').forEach(card => {
      const text = card.textContent || '';
      if(text.includes('Option 1')) appendPayment(card.querySelector('.shop-body') || card, 'water-dispenser-option-1');
      if(text.includes('Option 2')) appendPayment(card.querySelector('.shop-body') || card, 'water-dispenser-option-2');
      if(text.includes('Option 3')) appendPayment(card.querySelector('.shop-body') || card, 'water-dispenser-option-3');
    });
  }

  function addSubscriptionButtons(){
    if(!document.body.classList.contains('page-subscriptions')) return;
    const planMap = { starter: 'subscription-starter', standard: 'subscription-standard', business: 'subscription-business' };

    Object.entries(planMap).forEach(([plan, productId]) => {
      const link = document.querySelector(`.sub-btn[href*="plan=${plan}"]`);
      const card = link ? link.closest('.sub-card') : null;
      appendPayment(card, productId);
    });
  }

  function addShopButtons(){
    if(!document.body.classList.contains('page-our-shop')) return;
    Object.entries(PRODUCTS).forEach(([productId, product]) => {
      if(!product.quantitySelectId) return;
      const select = document.getElementById(product.quantitySelectId);
      const card = select ? select.closest('.shop-card') : null;
      appendPayment(card ? card.querySelector('.shop-body') || card : null, productId);
    });
  }

  function injectPayFastStyles(){
    if(document.getElementById('neutraph-payfast-styles')) return;
    const style = document.createElement('style');
    style.id = 'neutraph-payfast-styles';
    style.textContent = `
      .payfast-card-actions{margin:12px 0 0!important;display:flex!important;flex-direction:column!important;gap:7px!important}
      .payfast-btn{width:100%!important;min-height:46px!important;border:0!important;border-radius:8px!important;background:linear-gradient(135deg,#062f68 0%,#0077b6 62%,#00b4d8 100%)!important;color:#fff!important;font-family:'Montserrat',sans-serif!important;font-weight:900!important;font-size:13px!important;cursor:pointer!important;box-shadow:0 12px 26px rgba(0,119,182,.18)!important;transition:transform .2s ease,box-shadow .2s ease,opacity .2s ease!important}
      .payfast-btn:hover{transform:translateY(-1px)!important;box-shadow:0 16px 34px rgba(0,77,126,.24)!important}
      .payfast-btn:disabled{cursor:not-allowed!important;opacity:.72!important;transform:none!important}
      .payfast-card-actions small{color:#52627a!important;font-size:12px!important;line-height:1.4!important;text-align:center!important}
    `;
    document.head.appendChild(style);
  }

  function initPayFast(){
    injectPayFastStyles();
    addDispenserButtons();
    addSubscriptionButtons();
    addShopButtons();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initPayFast);
  }else{
    initPayFast();
  }
})();
