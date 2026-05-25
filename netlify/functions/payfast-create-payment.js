const { HttpError, createPayment, netlifyResponse } = require('../../api/payfast/_shared');

exports.handler = async function payfastCreatePayment(event){
  if(event.httpMethod === 'OPTIONS') return netlifyResponse(204, '');

  if(event.httpMethod !== 'POST'){
    return netlifyResponse(405, { error: 'Method not allowed' }, { 'Content-Type': 'application/json' });
  }

  try{
    const requestBody = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf8')
      : event.body;
    const body = requestBody ? JSON.parse(requestBody) : {};
    const checkout = createPayment(body);
    return netlifyResponse(200, checkout, { 'Content-Type': 'application/json' });
  }catch(error){
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    return netlifyResponse(statusCode, { error: error.message || 'Could not create PayFast checkout' }, { 'Content-Type': 'application/json' });
  }
};
