const { HttpError, netlifyResponse, verifyItn } = require('../../api/payfast/_shared');

exports.handler = async function payfastItn(event){
  if(event.httpMethod === 'OPTIONS') return netlifyResponse(204, '');

  if(event.httpMethod !== 'POST'){
    return netlifyResponse(405, 'Method not allowed', { 'Content-Type': 'text/plain' });
  }

  try{
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf8')
      : event.body || '';
    const order = verifyItn(rawBody);

    // Replace this console log with database/order-system storage when ready.
    console.log('Valid PayFast ITN received', {
      receivedAt: new Date().toISOString(),
      productId: order.productId,
      quantity: order.quantity,
      amount: order.amount,
      paymentStatus: order.paymentStatus,
      payfastPaymentId: order.payfastPaymentId,
      merchantPaymentId: order.merchantPaymentId
    });

    return netlifyResponse(200, 'OK', { 'Content-Type': 'text/plain' });
  }catch(error){
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    console.error('Invalid PayFast ITN', error.message);
    return netlifyResponse(statusCode, error.message || 'Invalid PayFast notification', { 'Content-Type': 'text/plain' });
  }
};
