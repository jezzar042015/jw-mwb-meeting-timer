var timerui = {
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
    var limit = $(".selected").attr("data-limit");
    var warning = 0;

    if (limit <= 60) {
      warning = limit;
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
        $(".display").addClass("timer-overtime");
        break;
      case "warning":
        $(".display").addClass("timer-warning");
        break;
    }
  },
  removeAlerts: function () {
    $(".timer-warning").removeClass("timer-warning");
    $(".timer-overtime").removeClass("timer-overtime");
  },
  displayTime: function (seconds) {
    var s = seconds % 60;
    var m = Math.floor(seconds / 60) % 60;
    var h = Math.floor(seconds / 3600);
    $("#second").text(s < 10 ? "" + 0 + s : s);
    $("#minute").text(m < 10 ? "" + 0 + m : m);
    $("#hour").text(h < 10 ? "" + 0 + h : h);
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
    var t = timeVal.split(".");

    $("#hour").text(t[0]);
    $("#minute").text(t[1]);
    $("#second").text(t[2]);
  },
  setSelectedStoredTime: function () {
    var seconds = Number($(".selected").attr("data-seconds"));
    timerui.timer.overallTime = seconds * 1000;
    timerui.displayTime(seconds);
  },
  autoSetControl: function () {
    $("#start").prop("disabled", !timerui.hasActive());
    $("#restart").prop("disabled", !timerui.hasActive());

    var seconds = Number($(".selected").attr("data-seconds"));
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
      var t = {
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
    var hiddenElement = document.createElement("a");
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
    var meeting = $("#meeting-selector").val();

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
  init: function () {
    timerui.eventHandlers();
    timerui.timer = new Timer();
    timerui.autoSetControl();
    timerui.switchMeeting();
  },
  eventHandlers: function () {
    $("#timers li").on("click", function () {
      if (!timerui.timer.isRunning) {
        timerui.setActiveTimer($(this));
        timerui.autoSetControl();
        timerui.setSelectedStoredTime();
      }
    });

    $("#start").on("click", function () {
      if (timerui.timer.isRunning) {
        // stops the timer
        $(this).html("START");
        timerui.stop();
        timerui.storeRunningSeconds();
        timerui.enableOptions();
        timerui.removeAlerts();
      } else {
        // starts the timer
        $(this).html("STOP");
        timerui.start();
        timerui.disableRestrictedOptions();
      }
    });

    $("#restart").on("click", function () {
      // timerui.setModalBox(true);
      timerui.restart();
    });

    $("#meeting-selector").on("click", function () {
      timerui.switchMeeting();
    });

    $("#store-download").on("click", function () {
      timerui.downloadSource();
    });
  },
};
