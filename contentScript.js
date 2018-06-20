console.log("INIT everything");

if (!$("#sentimentsForTrade").length) {
    console.log("Add sentimentsForTrade template")
    $("body").prepend("<div id='sentimentsForTrade'></div>");
    $('#sentimentsForTrade').load(chrome.extension.getURL('sentimentsForTradeButton/sentimentsForTrade.html'));
}

if (!$("#sentimentsDetails").length) {
    console.log("Add sentimentsDetails template")
    $("body").prepend("<div id='sentimentsDetails'></div>");
    $('#sentimentsDetails').load(chrome.extension.getURL('sentimentsDetails/sentimentsDetails.html'));
}

// Automatically adds Long/Short sentiments for every Trade button which appears in the DOM
$("body").bind("DOMNodeInserted", function () {
    // Init Sentiments for every Trade button on the eTrading
    // We use .updated class as synchronization to add sentiments once
    $("button.trade-it:not(.updated)").each(function () {

        // If we've already set
        if ($(this).hasClass("updated")) {
            return;
        }

        // If not mark this button
        $(this).addClass("updated");

        console.log("Init Sentiment Preview");

        var percentage = Math.floor(Math.random() * (99 - 1 + 1) + 1);

        var style = "longX";
        var title = "Bying";
        if (percentage < 50) {
            style = "shortX";
            percentage += 50;
            title = "Selling";
        }

        var source = document.getElementById("sentimentsForTradeTemplate").innerHTML;
        var template = Handlebars.compile(source);
        var context = {style: style, value: percentage, title: title};
        var html = template(context);

        $(this).before(html);
    });
});

// Automatically adds sentiments for every security description next to full quote
$("body").bind("DOMNodeInserted", function () {
    // Init Sentiment details
    // We use .updated class as synchronization to add sentiments once
    $("span:contains('FullQuote'):not(.updated)").each(function () {

        // If we have already set - return
        if ($(this).hasClass("updated")) {
            return;
        }

        $(this).addClass("updated");

        console.log("Init Sentiment details");

        if ($(this).parent().hasClass("navMenu")) {
            $(this).after("<span title='Sentiments'>Sentiments</span>");
        }

        if ($(this).parent().parent().parent().hasClass("tabsPanelContainer")) {
            var percentage = Math.floor(Math.random() * (99 - 1 + 1) + 1);
            var short = 100 - percentage

            var source = document.getElementById("sentimentsDetailsTemplate").innerHTML;
            var template = Handlebars.compile(source);
            var context = {longValue: percentage, shortValue: short};
            var html = template(context);

            $(this).parent().parent().after(html);
        }
    });
});

function waitTradingWidget(selector, time) {
    console.log("Wait for loading Trading Widget");
    if ($(selector).length) {
        console.log("INIT Trend Trading Widget");

        // Init new widget on the screen
        $('.rightColumn:not(.updated)').prepend("<div id='social-trend-container'></div>");
        $('.rightColumn').addClass("updated");

        $('#social-trend-container').load(chrome.extension.getURL('trendTradingWidget/trendTradingWidget.html'));

        return;
    }
    else {
        setTimeout(function () {
            waitTradingWidget(selector, time);
        }, time);
    }
}

if (!$(".rightColumn").length) {
    waitTradingWidget(".rightColumn:not(.updated)", 1000);
} else {
    $('#social-trend-container').load(chrome.extension.getURL('trendTradingWidget/trendTradingWidget.html'));
}


// Init new widget on the screen
// console.log("INIT Trend Trading Widget");
//
// $('.rightColumn:not(.updated)').prepend("<div id='social-trend-container'></div>");
// $('.rightColumn').addClass("updated");
//
//
// $('#social-trend-container').load(chrome.extension.getURL('trendTradingWidget/trendTradingWidget.html'));