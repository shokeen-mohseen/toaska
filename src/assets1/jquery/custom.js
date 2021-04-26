function show() {
  $("#hidepanel").hide();
  $("#divtabs").show();
}

function GFG_Fun() {
  show();
  $('#GFG_DOWN').text("");
};

function getToggle(item) {
  $('#collapseOne').toggle();
  $('#status').toggleClass('tt');
}

/*========================*/

$(document).ready(function () {
  $("#txtEditor").Editor();
  var i, items = $('.cust-nav-link'), pane = $('.cust-tab-pane');
  // next
  $('.nexttab').on('click', function () {
    for (i = 0; i < items.length; i++) {
      if ($(items[i]).hasClass('active') == true) {
        break;
      }
    }
    if (i < items.length - 1) {
      // for tab
      $(items[i]).removeClass('active');
      $(items[i + 1]).addClass('active');
      // for pane
      $(pane[i]).removeClass('show active');
      $(pane[i + 1]).addClass('show active');
    }

  });
  // Prev
  $('.prevtab').on('click', function () {
    for (i = 0; i < items.length; i++) {
      if ($(items[i]).hasClass('active') == true) {
        break;
      }
    }
    if (i != 0) {
      // for tab
      $(items[i]).removeClass('active');
      $(items[i - 1]).addClass('active');
      // for pane
      $(pane[i]).removeClass('show active');
      $(pane[i - 1]).addClass('show active');
    }
  });

});

/*========================*/

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

/*========================*/

$(document).ready(function () {
  $('.myTable').DataTable();
});

/*========================*/

$(document).ready(function () {
  $("#formButton").click(function () {
    $("#form1").toggle();
  });
});

/*========================*/
$(document).ready(function () {
  $('#action_menu_btn').click(function () {
    $('.action_menu').toggle();
  });
});

/*========================*/

/*========================*/
