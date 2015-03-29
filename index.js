var express = require('express');
var bodyParser = require("body-parser");
var http = require('http');
var https = require('https');
var app = express();
var cool = require('cool-ascii-faces');
var paypal = require('paypal-rest-sdk');
var fs = require('fs');
var ipn = require('paypal-ipn');

var qs = require('querystring');


var options = {
    key: fs.readFileSync('key.pem', 'utf8'),
    cert: fs.readFileSync('server.crt', 'utf8')
};

app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser());

paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AVRYqRXGDSA9nAEkzkvc1_4cWyNOG4vCSgslGbhWRXkS_wd2gwTjStgd9Y2MojT0Q-b9mEV-1fdGwOXw',
    'client_secret': 'EABB95ecu663Z8n-PHQXWu-_C8ckbBCG9Q6ya6E0fqPwG0NMVSAStgxmY_5Ms3l-y3SNBdY7tr8PF0qj'
});

var card_data = {
    "type": "visa",
    "number": "4417119669820331",
    "expire_month": "11",
    "expire_year": "2018",
    "cvv2": "123",
    "first_name": "Joe",
    "last_name": "Shopper"
};

CreditCard_data = {};

paypal.creditCard.create(card_data, function(error, credit_card) {
    if (error) {
        console.log(error);
        throw error;
    } else {
        // console.log("create credit-card response");
        // console.log(credit_card);
        CreditCard_data = credit_card;
    }
})

app.set('port', (process.env.PORT || 3000));
// app.set('port', 5000);
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    var result = ''
    var times = process.env.TIMES || 5
    for (i = 0; i < times; i++)
        result += cool();
    response.send(result);
});

app.get('/form', function(request, response) {
    response.render('orderForm.html');
});

app.get('/payments', function(request, response)
{    
    var cmd = "_xclick";
    /*
    var business = "last.scythe-facilitator@gmail.com";
    var undefined_quantity = 1;
    var item_name = "FoodLion " + req.body.item_name;
    var amount = req.body.amount;
    var shipping = 0.00;
    var shipping2 = 0.00;
    var currency_code = "USD";
    var state = "SG";
    */
    console.log(request.query.item)
    response.render('index', {'item': request.query.item, 'amount': request.query.amount });
});

app.get('/success', function(req, rep) {
    // rep.send("order success submit");
});

app.post('/success', function(req, rep) {
    // paypal post to me?!
    ipn.verify(req.body, {'allow_sandbox': true}, function callback(err, mes) {
      //The library will attempt to verify test payments instead of blocking them
      if (err) {
        rep.send("unhealthy");
      } else {
        rep.send("HEALTHY");  
      };
    });
    // rep.send(req.body);
});

Test_data = {};
app.post('/process', function(req, rp) {
    console.log('start')
    console.log(req.body)
    console.log('end')
    //rp.send(Test_data);
});

app.get('/seehow', function(res, rep) {
    rep.send(Test_data);
});

// obsolete
app.post('/submit', function(req, rp) {
    var credit_card_data = {
        type: req.body.type,
        number: req.body.number,
        expire_month: req.body.expire_month,
        expire_year: req.body.expire_year,
        cvv2: req.body.cvv2,
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };
    paypal.creditCard.create(credit_card_data, function(error, credit_card) {
        if (error) {
            console.log(error);
            throw error;
        } else {
            // console.log("create credit-card response");
            // console.log(credit_card);
            CreditCard_data = credit_card;
        }
    })
})

app.get('/card', function(r, rp) {
    rp.send(CreditCard_data);
})

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});



httpsServer = https.createServer(options, app);
httpsServer.listen(9000);

