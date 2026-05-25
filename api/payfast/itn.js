const {
  HttpError,
  handleOptions,
  readRawBody,
  sendText,
  verifyItn
} = require('./_shared');

async function payFastItn(req, res){
  if(handleOptions(req, res)) return;

  if(req.method !== 'POST'){
    sendText(res, 405, 'Method not allowed');
    return;
  }

  try{
    const rawBody = await readRawBody(req);
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

    sendText(res, 200, 'OK');
  }catch(error){
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    console.error('Invalid PayFast ITN', error.message);
    sendText(res, statusCode, error.message || 'Invalid PayFast notification');
  }
}

module.exports = payFastItn;

// Keep the raw x-www-form-urlencoded body available for PayFast signature checks.
module.exports.config = {
  api: {
    bodyParser: false
  }
};
