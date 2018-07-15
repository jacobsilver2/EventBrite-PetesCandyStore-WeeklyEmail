// pineBoxTest.json Pine Box:
// https://www.eventbrite.com/venue/api/feeds/venue/426.json Pete's
// https://www.eventbrite.com/venue/api/feeds/venue/424.json
$
  .getJSON("https://www.eventbrite.com/venue/api/feeds/venue/424.json", function (data) {
    // these variable are for making sure "today" is the first date to be listed, as
    // the JSON feed often incorrectly lists yesterday as the first date.
    var today = new Date();
    today = moment
      .utc(today)
      .format("YYYY-MM-DD");
    var yesterday = moment
      .utc(today)
      .subtract(1, 'day')
      .format("YYYY-MM-DD");

    //get the first item of the array
    var firstItem = data.slice(0, 1);
    //get only the date value of the first item
    firstDate = firstItem[0].starts_at;
    //format firstDate the way we need it.
    firstDate = moment
      .utc(firstDate)
      .format("YYYY-MM-DD");
    // get the date of the first date PLUS 7 days.  This will be our breakpoint.
    // Check first to see if firstDate is yesterday, if so, compensate.
    if (firstDate == yesterday) {
      var breakpoint = moment
        .utc(firstDate)
        .add(8, 'day')
        .format("YYYY-MM-DD");
    } else {
      var breakpoint = moment
        .utc(firstDate)
        .add(7, 'day')
        .format("YYYY-MM-DD");
    }

    var output = '<div class="container"><div class="row"><div class="col-md-8"><div id="carousel-' +
        'example-generic" class="carousel slide" data-ride="carousel" data-interval="4000' +
        '"><div class="carousel-inner" role="listbox" style=" width:100%; height: 500px !' +
        'important;">';
    //loop through the first 7 days in the JSON feed
    var counter = 0;
    $.each(data, function (key, val) {
      // if the first date is yesterday, go straight to the item item in the feed
      // without rendering anything.
      if (val.starts_at == yesterday) {
        return true;
      }
      //break out of the loop if we've hit the breakpoint.
      if (val.starts_at == breakpoint) {
        return false;
      }
      //format the starts_at value to display a better output (using moment.js)
      var myDate = moment
        .utc(val.starts_at)
        .format("dddd, MMMM Do");
      if (counter == 0) {
        output += '<div class="item active">';
      } else {
        output += '<div class="item">';
      }
      if (val.poster !== null) {
        output += '<img src="';
        output += val.poster;
        output += '" alt="petes.jpg">';
      } else {
        output += '<img src="img/petes.jpg">';
      }
      output += '<div class="carousel-caption">';
      output += '<h2><span>';
      output += myDate;
      output += '</span></h2><h2><span>';
      output += val.title;
      output += '</span></h2><br>';

      // output += '<h1>'; output += val.title; output += '</h1>'; output += '<p>';
      // output += myDate; output += '</p>';
      output += '</div></div>';
      counter++;
    });

    output += '</div>';
    output += '<a class="left carousel-control" href="#carousel-example-generic" role="button" ' +
        'data-slide="prev">';
    output += '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>';
    output += '<span class="sr-only">Previous</span>';
    output += '</a>';
    output += '<a class="right carousel-control" href="#carousel-example-generic" role="button"' +
        ' data-slide="next">';
    output += '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>';
    output += '<span class="sr-only">Next</span>';
    output += '</a></div></div></div></div>';

    //render to the DOM
    $('#update').html(output);

  });
