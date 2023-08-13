import { handlers } from "./handlers.js";

export const events = {
    async load() {
        this.selectItem();
        this.startItemTimer();
        this.stopItemTimer();

        this.resetItemTimer();
        this.switchMeeting();
        this.manageCountDown();
        this.add30s();
        this.sub15s();
    },
    selectItem() {
        $("#timers li").on("click", handlers.loadItem);
    },
    startItemTimer() {
        $("#start").on("click", handlers.startItemTimer);
    },
    stopItemTimer() {
        $("#stop").on("click", handlers.stopItemTimer);
    },
    resetItemTimer() {
        $("#restart").on("click", handlers.resetItemTimer);
    },
    switchMeeting() {
        $("#meeting-selector").on("change", handlers.loadMeetingItems);
    },
    manageCountDown() {
        $("#countdown").on("click", handlers.manageCountDown);
    },
    add30s() {
        $('#add30s').click(handlers.jumpBySeconds);
    },
    sub15s() {
        $('#sub15s').click(handlers.jumpBackBySeconds);
    },
};