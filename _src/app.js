$(document).ready(function () {
  timerui.loadSources()
  timerui.init()
  timerui.setActiveName()
  overall.init()
  auxies.controls.init()
});

const timerui = {
  timeInSeconds: 0,
  timer: {},
  start: function () {
    this.timer.start();
    this.runInterval();
    $("#start").addClass("running");
  },
  stop: function () {
    timerui.timer.stop();
    $("#start").removeClass("running");
  },
  restart: function () {
    timerui.timer.reset();
    $(".selected").attr("data-seconds", 0);
    timerui.setSelectedStoredTime();
    timerui.autoSetControl();
  },
  runInterval: function () {
    setInterval(() => {
      if (timerui.timer.isRunning) {
        timerui.timeInSeconds = Math.round(this.timer.getTime() / 1000);
        timerui.displayTime(timerui.timeInSeconds);
        timerui.watchAlerts(timerui.timeInSeconds);
      }
    }, 100);
  },
  watchAlerts: function (currentTimeInSeconds) {
    const limit = $(".selected").attr("data-limit");
    let warning = 0;

    if (limit <= 60) {
      warning = limit - 10;
    } else if (limit <= 180) {
      warning = limit - 30;
    } else if (limit > 190) {
      warning = limit - 60;
    }

    if (
      currentTimeInSeconds >= warning &&
      currentTimeInSeconds < limit &&
      warning != limit
    ) {
      timerui.raiseAlert("warning");
    } else if (currentTimeInSeconds >= limit) {
      timerui.raiseAlert("overtime");
    } else {
      timerui.removeAlerts();
    }
  },
  raiseAlert: function (timeralert) {
    switch (timeralert) {
      case "overtime":
        $(".timer-warning").removeClass("timer-warning");
        $(".display").addClass("blinking-overtime");
        break;
      case "warning":
        $(".display").addClass("timer-warning");
        break;
    }
  },
  removeAlerts: function () {
    $(".timer-warning").removeClass("timer-warning");
    $(".blinking-overtime").removeClass("blinking-overtime");
  },
  displayTime: function (seconds) {
    let s = seconds % 60;
    let m = Math.floor(seconds / 60) % 60;
    let h = Math.floor(seconds / 3600);
    $("#second1").text(s % 10);
    $("#second2").text(Number.parseInt((s % 100) / 10));
    $("#minute1").text(m % 10);
    $("#minute2").text(Number.parseInt((m % 100) / 10));
    $("#hour1").text(h % 10);
    $("#hour2").text(Number.parseInt((h % 100) / 10));
  },
  setModalBox: function (status) {
    status ? $("#alerts").show() : $("#alerts").hide();
  },
  hasActive: function () {
    return $(".selected").length > 0;
  },
  unsetSelection: function () {
    $(".selected").removeClass("selected");
    $(".disabled").removeClass("disabled");
  },
  setTime: function (timeVal) {
    x`x`;
    let t = timeVal.split(".");

    $("#hour").text(t[0]);
    $("#minute").text(t[1]);
    $("#second").text(t[2]);
  },
  setSelectedStoredTime: function () {
    let seconds = Number($(".selected").attr("data-seconds"));
    timerui.timer.overallTime = seconds * 1000;
    timerui.displayTime(seconds);
  },
  autoSetControl: function () {
    $("#start").prop("disabled", !timerui.hasActive());
    $("#restart").prop("disabled", !timerui.hasActive());

    let seconds = Number($(".selected").attr("data-seconds"));
    $("#restart").prop("disabled", seconds === 0);
  },
  disableRestrictedOptions: function () {
    $("#timers li").each(function () {
      if (!$(this).hasClass("selected")) {
        $(this).addClass("disabled");
      }
    });

    $("#meeting-selector").prop("disabled", true);
    $("#restart").prop("disabled", true);
  },
  enableOptions: function () {
    $(".disabled").removeClass("disabled");
    $("#meeting-selector").prop("disabled", false);
    $("#restart").prop("disabled", false);
  },
  storeRunningSeconds: function () {
    $(".selected").attr("data-seconds", timerui.timeInSeconds);
  },
  storeToLocalStorage: function () {
    const timers = [];
    $("#timers li").each(function () {
      const t = {
        id: Number($(this).attr("data-id")),
        order: Number($(this).attr("data-order")),
        limit: Number($(this).attr("data-limit")),
        seconds: Number($(this).attr("data-seconds")),
        name: $(this).children("div").children(".timer-name").text(),
        time: $(this).children("div").children("div:first").text(),
      };
      timers.push(t);
    });
    console.log(JSON.stringify(timers));
  },
  downloadSource: function () {
    let hiddenElement = document.createElement("a");
    hiddenElement.href =
      "data:attachment/text," + encodeURI(document.documentElement.outerHTML);
    hiddenElement.target = "_blank";
    hiddenElement.download = $(document).attr("title") + ".html";
    hiddenElement.click();
  },
  setActiveTimer: function (selected) {
    timerui.unsetSelection();
    $(selected).addClass("selected");
  },
  switchMeeting: function () {
    let meeting = $("#meeting-selector").val();

    if (meeting === "mwb") {
      $(".m-mwb").show();
      $(".m-public").hide();
    } else if (meeting === "public") {
      $(".m-mwb").hide();
      $(".m-public").show();
    }

    timerui.autoSelectFirstTimer();
  },
  autoSelectFirstTimer: function () {
    $("#timers li:visible:first").addClass("selected");
    timerui.autoSetControl();
    timerui.setSelectedStoredTime();
  },
  zoomShow(li) {
    const haszoom = $(li).data("haszoom");
    $("#zoom").toggle(haszoom)
  },
  setActiveName() {
    let template = ":title (:time)"
    let t = $('.selected').children('div').children('div').children('.part-minutes').text()
    let name = ($('.selected').children('div').children('.timer-name').text());
    template = template.replace(':title', name)
    template = template.replace(':time', t)
    $('#active-part').children('span').text(template)
  },  
  init: function () {
    timerui.eventHandlers();
    timerui.timer = new Timer();
    timerui.autoSetControl();
    timerui.switchMeeting();
    document.title = meetingSchedule
  },
  eventHandlers: function () {
    $("#timers li").on("click", function () {
      if (!timerui.timer.isRunning) {
        timerui.setActiveTimer($(this));
        timerui.autoSetControl();
        timerui.setSelectedStoredTime();
        timerui.zoomShow($(this))
        timerui.setActiveName()
      }
    });

    $("#start").on("click", function () {
      if (timerui.timer.isRunning) {
        // stops the timer
        $(this).html("START");
        timerui.stop();
        auxies.controls.setJumpers(false)
        timerui.storeRunningSeconds();
        timerui.enableOptions();
        timerui.removeAlerts();
        $(".display").width('auto')
        $(".sidebar").animate({ width: 'toggle' }, 0);
      } else {
        // starts the timer
        $(this).html("STOP");
        timerui.start();
        auxies.controls.setJumpers(true)
        timerui.disableRestrictedOptions();
        $(".sidebar").animate({ width: 'toggle' }, 0);
        $(".display").width(window.outerWidth + 'px')
      }
    });

    $("#restart").on("click", function () {
      timerui.restart();
    });

    $("#zoom").on("click", function () {
      $("#zoom-alert").toggle(true)
    });

    $("#zoom-alert").on("click", function () {
      $("#zoom-alert").hide()
    });

    $("#meeting-selector").on("click", function () {
      timerui.switchMeeting();
    });

    $("#store-download").on("click", function () {
      timerui.downloadSource();
    });

    $("#countdown").on("click", function () {
      if ($("#countdown").text() == 'Hide Count Down') {
        timerui.removeAlerts()
        $("#countdown").text('Show Count Down')
        $(".display").width('auto')
        $(".sidebar").animate({ width: 'toggle' }, 0);
        $(".controls").toggle(true)

        $("#countdown").toggle($('#progress-bar-runtime').width() < 0)

      } else {
        $("#countdown").text('Hide Count Down')
        $(".sidebar").animate({ width: 'toggle' }, 0);
        $(".display").width(window.outerWidth + 'px');
        $(".controls").toggle(false)
        $('#active-part').children('span').text('Meeting starts in...')
      }
    });
  },
  loadSources: function () {
    const ul = $('#timers')

    for (let i = 0; i < source.length; i++) {
      const s = source[i];

      let li = '' +
        '<li class="::meeting-class::" data-id="0" data-order="0" data-limit="::seconds::" data-seconds="" data-HasZoom="::HasZoom::">' +
        '  <div>' +
        '    <span class="timer-name">::meeting-name::</span>' +
        '    <div>' +
        '      <small class="part-minutes">::minutes:: min</small>' +
        '      <small class="participant">::participant::</small>' +
        '    </div>' +
        '  </div>' +
        '</li>'

      li = li.replace('::meeting-class::', s.class)
      li = li.replace('::seconds::', s.minutes * 60)
      li = li.replace('::meeting-name::', s.name)
      li = li.replace('::minutes::', s.minutes)
      li = li.replace('::participant::', s.participant)
      li = li.replace('::HasZoom::', s.hasParticipation)

      $(ul).append(li)
    }
  }
};

const auxies = {
  controls: {
    setJumpers: (val) => {
      $('#add30s').toggle(val)
      $('#sub15s').toggle(val)
    },
    add30s: () => {
      timerui.timer.overallTime += 30000;

    },
    sub15s: () => {
      if (timerui.timer.overallTime <= 15000) {
        timerui.timer.reset()
      } else {
        timerui.timer.overallTime -= 15000;
      }
    },
    init: () => {
      $('#add30s').dblclick(() => {
        auxies.controls.add30s()
      })

      $('#sub15s').dblclick(() => {
        auxies.controls.sub15s()
      })
    }
  }
}