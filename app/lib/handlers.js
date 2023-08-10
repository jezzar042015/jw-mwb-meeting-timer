import timer from "./timer.js";
import { render } from "./render.js";
import { watchers } from "./watchers.js";
import alerts from "./alerts.js";

export const handlers = {
    loadItem() {
        if (!timer.instance.isRunning) {
            handlers.setActiveTimer(this);
            watchers.setTimerControls();
            timer.loadConsumedTime();
            render.setActiveTitle()
            render.runningTime()
        }
    },
    setItemTimer() {
        // starts or stop timer
        if (timer.instance.isRunning) {
            $(this).html("START");
            timer.instance.stop();
            timer.store();
            watchers.dropRestrictions();
            alerts.drop();
            render.showSidebar();
            render.hideTimer()
        } else {
            $(this).html("STOP");
            timer.start();
            watchers.imposeRestrictions();
            render.hideSidebar()
        }

        watchers.setJumpers(timer.instance.isRunning);
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