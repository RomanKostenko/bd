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

        var percentage = Math.floor(Math.random() * (99 - 1 + 1) + 1);

        var color = "dodgerblue";
        var title = "Bying";
        if (percentage < 50) {
            color = "red";
            percentage += 50;
            title = "Selling";
        }

        // TODO do it better with small chart or image ?
        $(this).before("<span "
            + "title='" + title + "' "
            +"style='color: " + color + "'>"
            + percentage + "%</span> ");
    });
});


// Init new widget on the screen
$('.rightColumn:not(.updated)').prepend("<div id='social-trend-container'></div>");
$('.rightColumn').addClass("updated");


$('#social-trend-container').load(chrome.extension.getURL('socialTrend.html'));