const {
  HttpError,
  createPayment,
  handleOptions,
  readJsonBody,
  sendJson
} = require('./_shared');

module.exports = async function createPayFastPayment(req, res){
  if(handleOptions(req, res)) return;

  if(req.method !== 'POST'){
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try{
    const body = await readJsonBody(req);
    const checkout = createPayment(body);
    sendJson(res, 200, checkout);
  }catch(error){
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    sendJson(res, statusCode, { error: error.message || 'Could not create PayFast checkout' });
  }
};
