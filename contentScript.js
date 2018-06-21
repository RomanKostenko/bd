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

        // console.log("Init Sentiment Preview");

        var percentage = random(100);

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
            // Simulate LONG / SHORT ratio
            let long = random(100);
            let short = 100 - long;

            // Simulate PUT / CALL ratio
            let plusMinus15Noise = random(15);
            let call = ((long + plusMinus15Noise) > 100) ? long - plusMinus15Noise : long + plusMinus15Noise;
            let put = 100 - call;

            let uniqueId = uuidv4();

            let source = document.getElementById("sentimentsDetailsTemplate").innerHTML;
            let template = Handlebars.compile(source);

            // Simulate volume
            let volume = random(600);

            // Simulate watch list
            let followers = random(1000);

            // Simulate new opened orders
            let orders = random(300);

            let data = {
                id: uniqueId,
                volume: volume,
                followers: followers,
                orders: orders,

                longShortAction: (long < 50) ? "SHORT" : "LONG",
                longShortDescription: (long < 50) ? "people SELLING" : "people BUYING",
                longShortStyle: (long < 50) ? "shortX" : "longX",
                longShortColor: (long < 50) ? "red" : "dodgerblue",
                longShortValue: (long < 50) ? short : long,

                putCallAction: (call < 50) ? "PUT" : "CALL",
                putCallDescription: (long < 50) ? "people PUT" : "people CALL",
                putCallStyle: (call < 50) ? "putX" : "callX",
                putCallColor: (call < 50) ? "#8b0000" : "#006400",
                putCallValue: (call < 50) ? put : call
            };

            var html = template(data);
            $(this).parent().parent().after(html);

            placeChart(data);
        }
    });
});

//// Chart
if (!Highcharts.theme) {
    Highcharts.setOptions();
}

function placeChart(data) {
    Highcharts.chart(data.id, {
        chart: {
            type: 'solidgauge',
            events: {
                load: function () {
                    this.tooltip.refresh(this.series[0].data[0]);
                }
            }
        },

        credits: {
            enabled: false
        },

        title: {
            text: ''
        },

        tooltip: {
            borderWidth: 0,
            backgroundColor: 'none',
            shadow: false,
            style: {
                fontSize: '13px'
            },
            pointFormat: '<span style="color: {point.color};text-align: center;">{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
            positioner: function (labelWidth) {
                return {
                    x: (this.chart.chartWidth - labelWidth + 10) / 2,
                    y: (this.chart.plotHeight / 2) + -42
                };
            }
        },
        pane: {
            startAngle: -90,
            endAngle: 90,
            background: [{ // LONG/SHORT
                outerRadius: '112%',
                innerRadius: '88%',
                backgroundColor: Highcharts.Color(data.longShortColor)
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0,
                shape: 'arc'
            }, { // PUT CALL
                outerRadius: '87%',
                innerRadius: '63%',
                backgroundColor: Highcharts.Color(data.putCallColor)
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0,
                shape: 'arc'
            }
                // Uncomment to have one more circle
                // , {
                //     outerRadius: '62%',
                //     innerRadius: '38%',
                //     backgroundColor: Highcharts.Color("#8bbc21")
                //         .setOpacity(0.3)
                //         .get(),
                //     borderWidth: 0,
                //     shape: 'arc'
                // }
            ]
        },

        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    enabled: false
                },
                linecap: 'round',
                stickyTracking: false,
                rounded: false,
                pointStart: 0,
                startAngle: -90,
                endAngle: 90,
            }
        },

        series: [{
            name: data.longShortAction,
            data: [{
                color: data.longShortColor,
                radius: '112%',
                innerRadius: '88%',
                y: data.longShortValue
            }]
        }, {
            name: data.putCallAction,
            data: [{
                color: data.putCallColor,
                radius: '87%',
                innerRadius: '63%',
                y: data.putCallValue
            }]
        }
            // Uncomment to have one more circle
            // , {
            //     name: 'GREED',
            //     data: [{
            //         color: "#8bbc21",
            //         radius: '62%',
            //         innerRadius: '38%',
            //         y: 50
            //     }]
            // }
        ]
    });
}


//
//
// Trend widget
//
//


function waitTradingWidget(selector, time) {
    console.log("Wait for loading Trading Widget");
    if ($(selector).length) {
        console.log("INIT Trend Trading Widget");

        // Init new widget on the screen
        $('.rightColumn:not(.updated)').prepend("<div id='social-trend-container'></div>");
        $('.rightColumn').addClass("updated");

        $('#social-trend-container').load(chrome.extension.getURL('trendTradingWidget/trendTradingWidget.html'));


        $('head').append('<link rel="stylesheet" href="'
            + chrome.extension.getURL('libs/owl.carousel.min.css')
            + '">');

        $('head').append('<link rel="stylesheet" href="'
            + chrome.extension.getURL('libs/owl.theme.default.min.css')
            + '">');


        $(document).ready(function() {
            $('.owl-carousel').owlCarousel({
                loop: true,
                margin: 10,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 1,
                        nav: true
                    },
                    600: {
                        items: 3,
                        nav: false
                    },
                    1000: {
                        items: 5,
                        nav: true,
                        loop: false,
                        margin: 20
                    }
                }
            })
        });
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


// INIT carousel






//// UTILS

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

function random(max) {
    return Math.floor(Math.random() * (max - 1) + 1);
}