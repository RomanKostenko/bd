console.log("INIT");

// Init Sentiments for every Trade button on the eTrading
$("body").bind("DOMNodeInserted", function () {
    $("button.trade-it:not(.updated)").each(function () {

        // If we have already set - return
        if ($(this).hasClass("updated")) {
            return;
        }

        console.log("Init");

        $(this).addClass("updated");
        // $(this).css("background-color", "blue");

        var percentage = Math.floor(Math.random() * (100 - 1 + 1) + 1);
        var color = (percentage < 50) ? "red" : "dodgerblue";

        percentage = percentage < 50 ? percentage + 50 : percentage;

        // TODO do it better with small chart or image ?
        $(this).before("<span style='color: " + color + "'>" + percentage + "% </span>");
    });
});


// Init new widget on the screen
$('.rightColumn:not(.updated)').prepend("<div id='social-trend-container'></div>");
$('.rightColumn').addClass("updated");


$('#social-trend-container').load(chrome.extension.getURL('socialTrend.html'));