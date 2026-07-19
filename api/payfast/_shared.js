const crypto = require('crypto');

const RETURN_URL = 'https://www.neutraph.co.za/payment-success.html';
const CANCEL_URL = 'https://www.neutraph.co.za/payment-cancelled.html';
const NOTIFY_URL = 'https://www.neutraph.co.za/payment-notify';

/*
  Add these in Vercel or Netlify environment variables.
  Never put PAYFAST_PASSPHRASE in frontend code.

  PAYFAST_MERCHANT_ID=your live merchant id
  PAYFAST_MERCHANT_KEY=your live merchant key
  PAYFAST_PASSPHRASE=your live passphrase
  PAYFAST_MODE=sandbox or live
*/

const PRODUCTS = Object.freeze({
  'water-dispenser-option-1': { name: 'Water Dispenser Option 1', description: 'Standard hot and cold water dispenser', amount: '1999.99' },
  'water-dispenser-option-2': { name: 'Water Dispenser Option 2', description: 'Water dispenser with 5 stage RO filters', amount: '2499.99' },
  'water-dispenser-option-3': { name: 'Water Dispenser Option 3', description: 'Premium water dispenser', amount: '2999.99' },
  'subscription-starter': { name: 'Subscription Package', description: 'Starter subscription package - R249/month', amount: '249.00' },
  'subscription-standard': { name: 'Standard Subscription Package', description: 'Standard subscription package - R399/month', amount: '399.00' },
  'subscription-business': { name: 'Business Subscription Package', description: 'Business subscription package - R549/month', amount: '549.00' },
  'pack-water-500ml-6pack': { name: '6x500ml Water Bottles', description: '6 pack of 500ml NeutrapH water bottles', amount: '49.99' },
  'pack-water-1-5l-6pack': { name: '6x1.5L Water Bottles', description: '6 pack of 1.5L NeutrapH water bottles', amount: '99.99' },
  'pack-water-5l': { name: '5L Water Bottle', description: '5L NeutrapH water bottle', amount: '39.99' },
  'pack-water-10l': { name: '10L Water Bottle', description: '10L NeutrapH water bottle', amount: '59.99' },
  'pack-water-18-9l': { name: '18.9L Water Dispenser Bottle', description: '18.9L reusable NeutrapH water dispenser bottle', amount: '119.99' }
});

const FIELD_ORDER = [
  'merchant_id', 'merchant_key', 'return_url', 'cancel_url', 'notify_url',
  'name_first', 'name_last', 'email_address', 'cell_number',
  'm_payment_id', 'amount', 'item_name', 'item_description',
  'custom_int1', 'custom_int2', 'custom_int3', 'custom_int4', 'custom_int5',
  'custom_str1', 'custom_str2', 'custom_str3', 'custom_str4', 'custom_str5'
];

class HttpError extends Error {
  constructor(statusCode, message){
    super(message);
    this.statusCode = statusCode;
  }
}

function money(value){
  const numeric = Number(value);
  if(!Number.isFinite(numeric)) throw new HttpError(400, 'Invalid amount');
  return numeric.toFixed(2);
}

function env(name){
  const value = process.env[name];
  if(!value) throw new HttpError(500, `${name} is missing from the payment server environment`);
  return String(value).trim();
}

function payfastAction(){
  return String(process.env.PAYFAST_MODE || 'sandbox').toLowerCase() === 'live'
    ? 'https://www.payfast.co.za/eng/process'
    : 'https://sandbox.payfast.co.za/eng/process';
}

function encodePayFast(value){
  return encodeURIComponent(String(value).trim()).replace(/%20/g, '+');
}

function signFields(fields, passphrase, order = FIELD_ORDER){
  const known = order.filter(key => Object.prototype.hasOwnProperty.call(fields, key));
  const extra = Object.keys(fields).filter(key => key !== 'signature' && !known.includes(key));
  const paramString = known.concat(extra)
    .filter(key => fields[key] !== undefined && fields[key] !== null && String(fields[key]) !== '')
    .map(key => `${key}=${encodePayFast(fields[key])}`)
    .join('&');
  const signed = passphrase ? `${paramString}&passphrase=${encodePayFast(passphrase)}` : paramString;
  return crypto.createHash('md5').update(signed).digest('hex');
}

function validateOrder(input = {}){
  const productId = String(input.productId || input.product_id || '').trim();
  const product = PRODUCTS[productId];
  if(!product) throw new HttpError(400, 'Unknown PayFast product');

  const quantity = Math.max(1, parseInt(input.quantity || 1, 10) || 1);
  const expectedUnit = money(product.amount);
  const expectedTotal = money(Number(product.amount) * quantity);

  const suppliedName = input.productName || input.item_name || input.name;
  if(suppliedName && String(suppliedName).trim().toLowerCase() !== product.name.toLowerCase()){
    throw new HttpError(400, 'Product name does not match server product list');
  }

  const suppliedAmount = input.amount || input.price || input.total || input.totalAmount;
  if(suppliedAmount){
    const amount = money(suppliedAmount);
    if(amount !== expectedUnit && amount !== expectedTotal){
      throw new HttpError(400, 'Product amount does not match server product list');
    }
  }

  return { productId, product, quantity, amount: expectedTotal };
}

function createPayment(input = {}){
  const order = validateOrder(input);
  const fields = {
    merchant_id: env('PAYFAST_MERCHANT_ID'),
    merchant_key: env('PAYFAST_MERCHANT_KEY'),
    return_url: RETURN_URL,
    cancel_url: CANCEL_URL,
    notify_url: NOTIFY_URL,
    m_payment_id: String(input.orderId || input.m_payment_id || `NP-${Date.now()}-${order.productId}`).slice(0, 100),
    amount: order.amount,
    item_name: order.product.name,
    item_description: order.quantity > 1 ? `${order.product.description} x ${order.quantity}` : order.product.description,
    custom_int1: String(order.quantity),
    custom_str1: order.productId
  };

  fields.signature = signFields(fields, env('PAYFAST_PASSPHRASE'));

  return {
    action: payfastAction(),
    fields,
    product: {
      id: order.productId,
      name: order.product.name,
      unitAmount: money(order.product.amount),
      quantity: order.quantity,
      amount: order.amount
    }
  };
}

function parseFormBody(rawBody){
  const pairs = String(rawBody || '')
    .split('&')
    .filter(Boolean)
    .map(part => {
      const splitAt = part.indexOf('=');
      const rawKey = splitAt >= 0 ? part.slice(0, splitAt) : part;
      const rawValue = splitAt >= 0 ? part.slice(splitAt + 1) : '';
      return [
        decodeURIComponent(rawKey.replace(/\+/g, ' ')),
        decodeURIComponent(rawValue.replace(/\+/g, ' '))
      ];
    });

  const fields = {};
  pairs.forEach(([key, value]) => { fields[key] = value; });
  return { pairs, fields };
}

function signPairs(pairs, passphrase){
  const paramString = pairs
    .filter(([key, value]) => key !== 'signature' && value !== '')
    .map(([key, value]) => `${key}=${encodePayFast(value)}`)
    .join('&');
  const signed = passphrase ? `${paramString}&passphrase=${encodePayFast(passphrase)}` : paramString;
  return crypto.createHash('md5').update(signed).digest('hex');
}

function verifyItn(rawBody){
  const { pairs, fields } = parseFormBody(rawBody);
  const supplied = String(fields.signature || '').toLowerCase();
  const expected = signPairs(pairs, env('PAYFAST_PASSPHRASE')).toLowerCase();
  if(!supplied || supplied !== expected) throw new HttpError(400, 'Invalid PayFast signature');

  const productId = String(fields.custom_str1 || '').trim();
  const product = PRODUCTS[productId];
  if(!product) throw new HttpError(400, 'Unknown product in PayFast notification');

  const quantity = Math.max(1, parseInt(fields.custom_int1 || 1, 10) || 1);
  const expectedAmount = money(Number(product.amount) * quantity);
  const receivedAmount = money(fields.amount_gross || fields.amount);
  if(receivedAmount !== expectedAmount) throw new HttpError(400, 'PayFast amount does not match order amount');

  const paymentStatus = String(fields.payment_status || '').toUpperCase();
  if(paymentStatus !== 'COMPLETE') throw new HttpError(400, `PayFast payment is not complete: ${paymentStatus || 'unknown'}`);

  return {
    productId,
    quantity,
    amount: receivedAmount,
    paymentStatus,
    payfastPaymentId: fields.pf_payment_id || null,
    merchantPaymentId: fields.m_payment_id || null,
    raw: fields
  };
}

function readRawBody(req){
  if(typeof req.body === 'string') return Promise.resolve(req.body);
  if(req.body && typeof req.body === 'object') return Promise.resolve(new URLSearchParams(req.body).toString());
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function readJsonBody(req){
  if(req.body && typeof req.body === 'object') return req.body;
  const raw = await readRawBody(req);
  if(!raw) return {};
  try{ return JSON.parse(raw); }
  catch(error){ throw new HttpError(400, 'Request body must be valid JSON'); }
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function setCors(res){ Object.entries(CORS_HEADERS).forEach(([key, value]) => res.setHeader(key, value)); }
function sendJson(res, statusCode, payload){ setCors(res); res.statusCode = statusCode; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(payload)); }
function sendText(res, statusCode, text){ setCors(res); res.statusCode = statusCode; res.setHeader('Content-Type', 'text/plain'); res.end(text); }
function handleOptions(req, res){ if(req.method !== 'OPTIONS') return false; setCors(res); res.statusCode = 204; res.end(); return true; }
function netlifyResponse(statusCode, body, headers = {}){ return { statusCode, headers: Object.assign({}, CORS_HEADERS, headers), body: typeof body === 'string' ? body : JSON.stringify(body) }; }

module.exports = { PRODUCTS, HttpError, createPayment, verifyItn, readJsonBody, readRawBody, sendJson, sendText, handleOptions, netlifyResponse };
