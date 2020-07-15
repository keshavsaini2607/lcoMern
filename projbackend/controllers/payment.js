var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "7t2bkv3bsmw77t4w",
  publicKey: "fv97jgsbdcvrskh2",
  privateKey: "6e3b06a41a0ba6d67aae3f0eba6fc0b0"
});

exports.getToken = (req,res) => {
    gateway.clientToken.generate({}, function (err, response) {
        if(err){
            res.status(500).send(err)
        }else{
            res.send(response)
        }
      });
}

exports.processPayment = (req,res) => {

    let nonceFromTheClient = req.body.paymentMethodNonce

    let amountFromTheClient = req.body.amount

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
          if(err){
              res.status(500).send(err)
          }else{
              res.send(result)
          }
       });
}