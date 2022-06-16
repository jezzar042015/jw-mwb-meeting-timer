var timerui = {
  timeInSeconds: 0,
  timer: {},
  start: function () {
    this.timer.start();
    this.runInterval();
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
  },
  disableUnselectedOptions: function () {
    $("#timers li").each(function () {
      if (!$(this).hasClass("selected")) {
        $(this).addClass("disabled");
      }
    });
  },
  enableOptions: function () {
    $(".disabled").removeClass("disabled");
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
  setActiveTimer: function (selected) {
    timerui.unsetSelection();
    $(selected).addClass("selected");
  },
  init: function () {
    timerui.eventHandlers();
    timerui.timer = new Timer();
    timerui.autoSetControl();
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
        timerui.timer.stop();
        timerui.storeRunningSeconds();
        timerui.enableOptions();
        timerui.removeAlerts();
      } else {
        // starts the timer
        $(this).html("STOP");
        timerui.start();
        timerui.disableUnselectedOptions();
      }
    });

    $("#restart").on("click", function () {
      timerui.timer.reset();
    });
  },
};
