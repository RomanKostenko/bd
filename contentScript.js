console.log("INIT");

// For every DOM insert
$("body").bind("DOMNodeInserted", function () {
    // Init Sentiments for every Trade button on the eTrading (IF YOU DON'T want to display that, just remove)
    $("button.trade-it:not(.updated)").each(function () {

        // If we have already set - return
        if ($(this).hasClass("updated")) {
            return;
        }

        $(this).addClass("updated");

        console.log("Init Sentiment Preview");

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
            + "style='color: " + color + "'>"
            + percentage + "%</span> ");
    });

    // Init Sentiment details (IF YOU DON'T want to display that, just remove)
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

            $(this).parent().parent().after("<section class='quoteSection detail'>" +
                "    <header class='quoteHeader'><span'>Sentiments</span></header>" +
                "    <content class='quoteContent'>" +
                "        <table class='fullquoteTable' border='0' cellpadding='0' cellspacing='0'>" +
                "            <tbody>" +
                "            <tr>" +
                "                <td style='color: dodgerblue'>Buying</td>" +
                "                <td><spans style='color: dodgerblue'>" + percentage + "%</span></td>" +
                "            </tr>" +
                "            <tr>" +
                "                <td style='color: red'>Selling</td>" +
                "                <td><span style='color: red'>" + (100 - percentage) + "%</span></td>" +
                "            </tr>" +
                "            </tbody>" +
                "        </table>" +
                "    </content>" +
                "</section>");
        }
    });
});

// Init new widget on the screen
$('.rightColumn:not(.updated)').prepend("<div id='social-trend-container'></div>");
$('.rightColumn').addClass("updated");


$('#social-trend-container').load(chrome.extension.getURL('socialTrend.html'));