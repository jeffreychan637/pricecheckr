var casper = require('casper').create();
var x = require('casper').selectXPath;


var size = 'S';
var color = 'Cream';

// casper.start('http://www.fanatics.com/MLB_San_Francisco_Giants_Mens_Jerseys/Buster_Posey_San_Francisco_Giants_Majestic_Alternate_2017_Cool_Base_Player_Jersey_-_Black');

casper.start('http://www.fanatics.com/MLB_San_Francisco_Giants_Mens_Jerseys/Madison_Bumgarner_San_Francisco_Giants_Majestic_Alternate_2017_Cool_Base_Player_Jersey_-_Black')

function waitForPageReady() {
    casper.waitFor(function check() {
        return this.evaluate(function() {
            // return document.querySelector('div[title="Select Cream"]');
            return document.querySelector('div[title="Select Gray"]');
        });
    }, function then() {
        changeToCream();
        this.echo("found it");
    });
};

function changeToCream() {
    casper.then(function() {
        // this.click('a[title="Select Cream"]');
        this.click('a[title="Select Gray"]');
    });

    casper.waitFor(function check() {
        return this.evaluate(function() {
            // return document.querySelector('span.selected-color-readable').innerHTML === 'Cream';
            return document.querySelector('span.selected-color-readable').innerHTML === 'Gray';
        });
    }, function then() {
        changeSize();
        return;
    });
};

function changeSize() {
    var sizeGone;
    casper.then(function() {
        if (this.exists('div[title="S - Out of stock"]')) {
        // if (this.exists('div[title="M - Out of stock"]')) {
            this.echo('Product is out of stock');
        } else {
            this.click('a[title="Choose Size L"]');
            verifySizeAvailability();
        }
    });
};

function verifySizeAvailability() {
    casper.waitFor(function check() {
        return this.evaluate(function() {
            return (document.querySelector('span.dynamic-size-display').innerHTML === 'L' &&
                   document.querySelector('div[data-talos="labelOutOfStockAlert"]'));
        });
    }, function then() {
        var value = this.evaluate(function() {
            return document.querySelector('div[data-talos="labelOutOfStockAlert"]').innerHTML;
        });
        if (value) {
            this.echo('Stock is limited');
            this.echo(value);
        }
        checkPrice();
    });
};

function checkPrice() {
    //should echo price during testing
    //echo sale or no sale (Sale: Yes, Sale: No)

};

function checkSalePrice() {
    //should echo price during testing
};

function checkFreeShipping() {
    //Check if free shipping exists
};

waitForPageReady();

casper.run();