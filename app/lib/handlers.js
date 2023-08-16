import timer from "./timer.js";
import { render } from "./render.js";
import { watchers } from "./watchers.js";
import alerts from "./alerts.js";
import countdown from "./countdown.js";

export const handlers = {
    loadItem() {
        if (!timer.instance.isRunning) {
            handlers.setActiveTimer(this);
            watchers.setTimerControls();
            timer.loadConsumedTime();
            render.setActiveTitle();
            render.loadItemDetails();
            render.runningTime();
            render.hideTimer();
        }
    },
    startItemTimer() {
        timer.start();
        watchers.imposeRestrictions();
        render.hideSidebar();
        render.showTimer();
        watchers.setJumpers(timer.instance.isRunning);
    },
    stopItemTimer() {
        if (countdown.running) {
            countdown.running = false
        } else {
            timer.instance.stop();
            timer.store();
            watchers.dropRestrictions();
            alerts.drop();
            watchers.setJumpers(timer.instance.isRunning);
            render.loadItemDetails();
        }
        render.showSidebar();
        render.hideTimer();

    },
    setActiveTimer(i) {
        handlers.unsetSelection();
        $(i).addClass("selected");
    },
    unsetSelection() {
        $(".selected").removeClass("selected");
        $(".disabled").removeClass("disabled");
    },
    resetItemTimer() {
        timer.restart()
        render.loadItemDetails();
    },
    async loadMeetingItems() {
        const toggle = async () => {

            let meeting = $("#meeting-selector").val();
            let mwb_parts = $(".m-mwb");
            let public_parts = $(".m-public");

            if (meeting === "mwb") {
                mwb_parts.show();
                public_parts.hide();
            } else if (meeting === "public") {
                mwb_parts.hide();
                public_parts.show();
            }
        }
        await toggle();
        handlers.autoSelectFirstItem();
    },
    async autoSelectFirstItem() {
        $("#timers li:visible:first").click();
    },
    manageCountDown() {

        countdown.running = true
        render.hideSidebar();
        render.showTimer();
        render.setActiveTitle('countdown');
    },
    jumpBySeconds() {
        let seconds = 30 * 1000
        timer.instance.overallTime += seconds;
    },
    jumpBackBySeconds() {
        let seconds = 15 * 1000
        if (timer.instance.overallTime <= seconds) {
            timer.instance.reset();
        } else {
            timer.instance.overallTime -= seconds;
        }
    },



}