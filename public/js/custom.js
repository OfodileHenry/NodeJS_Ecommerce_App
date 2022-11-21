$(function () {
  Stripe.setPublishableKey(
    "pk_test_51GXVTqJjXtfq5B90D23BreFZ0HI2YvBIeApOjW1A6Ev9sWP8nz0nDGeD6txalfxvlasbAyXMaq9eHfACO1TrkMZi00Et2OZg51"
  );

  var opts = {
    lines: 14, // The number of lines to draw
    length: 32, // The length of each line
    width: 21, // The line thickness
    radius: 30, // The radius of the inner circle
    scale: 1.35, // Scales overall size of the spinner
    corners: 0.4, // Corner roundness (0..1)
    speed: 1.2, // Rounds per second
    rotate: 80, // The rotation offset
    animation: "spinner-line-fade-quick", // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: "#ffffff", // CSS color or array of colors
    fadeColor: "transparent", // CSS color or array of colors
    top: "49%", // Top position relative to parent
    left: "50%", // Left position relative to parent
    shadow: "0 0 1px transparent", // Box-shadow for the lines
    zIndex: 2000000000, // The z-index (defaults to 2e9)
    className: "spinner", // The CSS class to assign to the spinner
    position: "absolute", // Element positioning
  };

  $("#search").keyup(function () {
    var search_term = $(this).val();

    $.ajax({
      method: "POST",
      url: "/api/search",
      data: {
        search_term,
      },
      dataType: "json",
      success: function (json) {
        var data = json.hits.hits.map(function (hit) {
          return hit;
        });

        $("#searchResults").empty();
        for (var i = 0; i < data.length; i++) {
          var html = "";
          html += '<div class="col-md-4">';
          html += '<a href="/product/' + data[i]._source._id + '">';
          html += '<div class="thumbnail">';
          html += '<img src="' + data[i]._source.image + '">';
          html += '<div class="caption">';
          html += "<h3>" + data[i]._source.name + "</h3>";
          html += "<p>" + data[i]._source.category.name + "</h3>";
          html += "<p>$" + data[i]._source.price + "</p>";
          html += "</div></div></a></div>";

          $("#searchResults").append(html);
        }
      },

      error: function (error) {
        console.log(err);
      },
    });
  });

  $(document).on("click", "#plus", function (e) {
    e.preventDefault();
    var priceValue = parseFloat($("#priceValue").val());
    var quantity = parseInt($("#quantity").val());

    priceValue += parseFloat($("#priceHidden").val());
    quantity += 1;

    $("#quantity").val(quantity);
    $("#priceValue").val(priceValue.toFixed(2));
    $("#total").html(quantity);
  });

  $(document).on("click", "#minus", function (e) {
    e.preventDefault();
    var priceValue = parseFloat($("#priceValue").val());
    var quantity = parseInt($("#quantity").val());

    if (quantity == 1) {
      priceValue = $("#priceHidden").val();
      quantity = 1;
    } else {
      priceValue -= parseFloat($("#priceHidden").val());
      quantity -= 1;
    }

    $("#quantity").val(quantity);
    $("#priceValue").val(priceValue.toFixed(2));
    $("#total").html(quantity);
  });

  function stripeResponseHandler(status, response) {
    var $form = $("#payment-form");

    if (response.error) {
      // Show the errors on the form
      $form.find(".payment-errors").text(response.error.message);
      $form.find("button").prop("disabled", false);
    } else {
      // response contains id and card, which contains additional card details
      var token = response.id;
      // Insert the token into the form so it gets submitted to the server
      $form.append($('<input type="hidden" name="stripeToken" />').val(token));

      var spinner = new Spinner(opts).spin();
      $("#loading").append(spinner.el);
      // and submit
      $form.get(0).submit();
    }
  }

  $("#payment-form").submit(function (event) {
    var $form = $(this);

    // Disable the submit button to prevent repeated clicks
    $form.find("button").prop("disabled", true);

    Stripe.card.createToken($form, stripeResponseHandler);

    // Prevent the form from submitting with the default action
    return false;
  });
});
