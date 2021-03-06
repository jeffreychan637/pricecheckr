var casper = require('casper').create();

var size = 'S';
var color = 'Cream';

casper.start('http://www.fanatics.com/MLB_San_Francisco_Giants_Mens_Jerseys/Buster_Posey_San_Francisco_Giants_Majestic_Alternate_2017_Cool_Base_Player_Jersey_-_Black');

// casper.start('http://www.fanatics.com/MLB_San_Francisco_Giants_Mens_Jerseys/Madison_Bumgarner_San_Francisco_Giants_Majestic_Alternate_2017_Cool_Base_Player_Jersey_-_Black');
// casper.start('http://www.fanatics.com/MLB_San_Francisco_Giants_Mens_Jerseys/on_sale/yes/Madison_Bumgarner_San_Francisco_Giants_Majestic_2016_MLB_All-Star_Game_Signature_Flex_Base_Jersey_-_Gray');

function waitForPageReady() {
    casper.waitFor(function check() {
        return this.evaluate(function(color) {
            return document.querySelector('div[title="Select ' + color + '"]');
        }, color);
    }, function then() {
        this.echo('Site Page Reached');
        changeColor();
    });
};

function changeColor() {
    casper.then(function() {
        this.click('a[title="Select ' + color + '"]');
    });

    casper.waitFor(function check() {
        return this.evaluate(function(color) {
            return document.querySelector('span.selected-color-readable').innerHTML === color;
        }, color);
    }, function then() {
        changeSize();
    });
};

function changeSize() {
    casper.then(function() {
        if (this.exists('div[title="' + size + ' - Out of stock"]')) {
            this.echo('Stock: Out');
        } else {
            this.click('a[title="Choose Size ' + size + '"]');
            verifySizeAvailability();
        }
    });
};

function verifySizeAvailability() {
    casper.waitFor(function check() {
        return this.evaluate(function(size) {
            return (document.querySelector('span.dynamic-size-display').innerHTML === size &&
                   document.querySelector('div[data-talos="labelOutOfStockAlert"]'));
        }, size);
    }, function then() {
        var value = this.evaluate(function() {
            return document.querySelector('div[data-talos="labelOutOfStockAlert"]').innerHTML;
        });
        if (value) {
            this.echo('Stock: Limited');
            this.echo(value);
        }
        checkPrice();
    });
};

function checkPrice() {
    casper.then(function() {
        if (this.exists('section.priceContainer.Regular.large')) {
            this.echo('Sale: No');
            checkRegularPrice();
        } else if (this.exists('section.priceContainer.Sale.large')) {
            this.echo('Sale: Yes');
            checkSalePrice();
        }
    });
};

function checkRegularPrice() {
    casper.then(function() {
        var price = this.evaluate(function() {
            return document.querySelector('section.priceContainer.Regular.large')
                           .querySelector('span.price-value').innerHTML;
        });
        this.echo('Price: ' + price);
        checkFreeShipping();
    });
};

function checkSalePrice() {
    casper.then(function() {
        var prices = this.evaluate(function() {
            var prices = {};
            prices.salePrice = document.querySelector('section.priceContainer.Sale.large')
                                       .querySelector('p.price.sale')
                                       .querySelector('span.price-value')
                                       .innerHTML;
            prices.regularPrice = document.querySelector('section.priceContainer.Sale.large')
                                          .querySelector('p.price.original')
                                          .querySelector('span.price-value')
                                          .innerHTML;
            prices.difference = document.querySelector('section.priceContainer.Sale.large')
                                        .querySelector('p.price.saved')
                                        .querySelector('span.price-value')
                                        .innerHTML;
            return prices;
        });
        this.echo('Sale Price: ' + prices.salePrice);
        this.echo('Regular Price: ' + prices.regularPrice);
        this.echo('Price Difference: ' + prices.difference);
        checkFreeShipping();
    });
};

function checkFreeShipping() {
    casper.then(function() {
        if (this.exists('div.free-shipping-coupon-message')) {
            this.echo('Free Shipping: Yes');
        }
    });
    echoCompletion();
};

function echoCompletion() {
    casper.then(function() {
        this.echo('Reached End of Script');
    });
};

waitForPageReady();

casper.run();
