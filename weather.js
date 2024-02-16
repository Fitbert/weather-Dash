$(window).on('load', function () {
    whereAmI();
    lookInShed();
});
var APIKey = "7ee985d3f3fcb82608bed4de2f5719c6";
var ct = "";
var now = moment();
var today = now.format('MMMM Do YYYY || h:mm a');
$("#Now").text(today);

$("#btn5").on("click", function (event) {
    event.preventDefault();

    ct = $("#town-call").val();
    if (ct === '') {
        return alert('Try again ! ');
    }
    forcast(ct);

    saveToLocalStorage(ct);
});
function sBtn5(q) {
    var newLi = $("<li>")
    var newBtn = $('<button>');
    newBtn.attr('id', 'extraBtn');
    newBtn.addClass("button is-small recentSearch");
    newBtn.text(q);
    newLi.append(newBtn)
    $("#hUl").prepend(newLi);
    $("#extraBtn").on("click", function () {
        var newQ = $(this).text();
        forcast(newQ);
    });
}


function forcast(tx) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + tx + "&units=imperial&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
        error: (err => {  
            alert("try again.")
            return;
          })
    }).then(function (response) {
        console.log(response)
        $(".tUl").empty()
        $("#week").empty()
        var sectionA = $("<div col-12>").append($("<p><h2>" + response.name + ' (' + today + ')' + "</h2><p>"));
        var image = $('<img class="imgsize">').attr('src', './icons/' + response.weather[0].icon + '.png');        
        var hotHot = $('<p>').text('Temperature : ' + response.main.temp + ' °F ');
        var sweat = $('<p>').text('Humidity : ' + response.main.humidity + '%');
        var tornato = $('<p>').text('Wind Speed : ' + response.wind.speed + 'MPH');       
       // var uvIndexcoord = '&lat=' + response.coord.lat + '&lon=' + response.coord.lon;
        var block = response.id;

       // displayUVindex(uvIndexcoord);
        pluckers(block);

        sectionA.append(image).append(hotHot).append(sweat).append(tornato);
        $('#tUl').empty();
        $('#tUl').append(sectionA);
    });
}

function pluckers(wa) {
    $.ajax({ 
        url: "https://api.openweathermap.org/data/2.5/forecast?id=" + wa + "&units=imperial&APPID=" + APIKey,
        method: "GET",
    }).then(function (response) {
        var aul = response.list;
        for (var i = 0; i < aul.length; i++) {
            if (aul[i].dt_txt.split(' ')[1] === '12:00:00') {
                console.log(aul[i]);
                var section = $('<div>');
                section.addClass('col forecast bg-secondary rounded text-white ml-3 mb-3 >');
                var date5 = $("<h5>").text(response.list[i].dt_txt.split(" ")[0]);
                var image = $('<img>').attr('src', './icons/' + aul[i].weather[0].icon + '.png');
                var hotHot = $('<p>').text('Temp : ' + aul[i].main.temp + ' °F ');               
                var sweat = $('<p>').text('Humidity : ' + aul[i].main.humidity + '%');
                var tornato = $('<p>').text('Wind Speed : ' + aul[i].wind.speed + 'MPH');                
                section.append(date5).append(image).append(hotHot).append(sweat).append(tornato);
                $('#week').append(section);
            }
        }
    });
};
function whereAmI() {
    $.ajax({
        url: "https://freegeoip.app/json/",
        method: "GET",
    }).then(function (response) {
        rs = response.city || 'exton';
        console.log(rs);
        forcast(rs);
    });
};

function lookInShed() {
    var storedData = localStorage.getItem('queries');
    var dataArray = [];
    if (!storedData) {
        console.log("no data stored");
    } else {
        storedData.trim();
        dataArray = storedData.split(',');
        for (var i = 0; i < dataArray.length; i++) {
            sBtn5(dataArray[i]);
        }
    }
};
function saveToLocalStorage(q) {
    var data = localStorage.getItem('queries');
    if (data) {
        console.log(data, q)

    } else {
        data = q;
        localStorage.setItem('queries', data);
    }
    if (data.indexOf(q) === -1) {
        data = data + ',' + q;
        localStorage.setItem('queries', data);
        sBtn5(q);
    }
}
$("#h-btn").on("click", function (event) {
    $("#hUl").empty();
});
forcast('austin')