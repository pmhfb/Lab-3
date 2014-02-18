$("#Finance").on("pageshow", function (e) {


    $("#rss-default").rss("http://finance.yahoo.com/rss/topfinstories", {
        limit: 5,
        layoutTemplate: '<dl class="dl-horizontal">{entries}</dl>',
        entryTemplate: '<dt><a href="{url}">{title}</a></dt><dd>{shortBodyPlain}[{author}@{date}]</dd>'
    }).show();

});

$("#TodoList").on("pageshow", function (e) {
    $(function () {
        // store content
        var todo = document.getElementById('todo');
        $("#todo").blur(function () {
            localStorage.setItem('todoData', this.innerHTML);
        });
        // restore content when page loads
        if (localStorage.getItem('todoData')) {
            todo.innerHTML = localStorage.getItem('todoData');
        }
        // add maxi and mini classes upon content (optional)
        $("li:contains('++')").addClass('maxi');
        $("li:not(:contains('++'))").removeClass('maxi');
        $("li:contains('--')").addClass('mini');
        $("li:not(:contains('--'))").removeClass('mini');
    });
    $(function () {
        // Réinitialisation
        $('#reset').click(function () {
            localStorage.clear();
            location.reload();
        });
    });
});
$("#CurrencyTable").on("pageshow", function (e) {
    function drawTable(e) {
        // use jQuery to make an AJAX request for data
        $.ajax({
            url: 'http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json',
            dataType: 'jsonp',
            success: function (json) {
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Name');
                data.addColumn('string', 'Symbol');
                data.addColumn('number', 'Price');
                data.addColumn('date', 'UTC Time');

                // parse the JSON into the DataTable
                for (var i = 0; i < json.list.resources.length; i++) {
                    var name = json.list.resources[i].resource.fields.name;
                    var symbol = json.list.resources[i].resource.fields.symbol;
                    var price = parseFloat(json.list.resources[i].resource.fields.price);
                    var dateTimeArr = json.list.resources[i].resource.fields.utctime.split('T');
                    var dateArr = dateTimeArr[0].split('-');
                    var year = dateArr[0];
                    var month = dateArr[1] - 1; // subtract 1 to make compatible with javascript dates
                    var day = dateArr[2];
                    var timeArr = dateTimeArr[1].split(/[:\+]/);
                    var hour = timeArr[0];
                    var minute = timeArr[1];
                    var second = timeArr[2];

                    data.addRow([name, symbol, price, new Date(year, month, day, hour, minute, second)]);
                }

                var table = new google.visualization.Table(document.querySelector('#table_div'));
                table.draw(data);
            }
        });
    }
    google.load('visualization', '1', {
        packages: ['table'],
        callback: drawTable
    });
});

$("#RESTWebService").on("pageshow", function (e) {
    var echo = function (dataPass) {
        $.ajax({
            type: "POST",
            url: "/echo/json/",
            data: dataPass,
            cache: false,
            success: function (json) {
                alert(json);
            }
        });
    };
    $("#list").on("click", function (e) {

        $.get("http://localhost/aspnet_client/WcfService1/WcfService1/Service1.svc/newFun", function (data) {
            var json = {
                json: JSON.stringify(data),
                delay: 1
            };
            echo(json);
        });
    });

});