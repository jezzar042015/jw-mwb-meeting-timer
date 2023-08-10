import { handlers } from "./handlers.js";

export const events = {
    async load() {
        this.selectItem();
        this.setItemTimer();
        this.resetItemTimer();
        this.switchMeeting();
        this.manageCountDown();
        this.add30s();
        this.sub15s();
    },
    selectItem() {
        $("#timers li").on("click", handlers.loadItem);
    },
    setItemTimer() {
        $("#start").on("click", handlers.setItemTimer);
    },
    resetItemTimer() {
        $("#restart").on("click", handlers.resetItemTimer);
    },
    switchMeeting() {
        $("#meeting-selector").on("click", handlers.loadMeetingItems);
    },
    manageCountDown() {
        $("#countdown").on("click", handlers.manageCountDown);
    },
    add30s() {
        $('#add30s').dblclick(handlers.jumpBySeconds);
    },
    sub15s() {
        $('#sub15s').dblclick(handlers.jumpBackBySeconds);
    },
};