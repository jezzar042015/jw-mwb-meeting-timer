import { source } from "./data.js";

export const watchers = {
    hasActive() {
        return $(".selected").length > 0;
    },
    setTimerControls() {
        $("#start").prop("disabled", !this.hasActive());
        $("#restart").prop("disabled", !this.hasActive());

        let seconds = Number($(".selected").attr("data-seconds"));
        $("#restart").prop("disabled", seconds === 0);
    },
    setJumpers(show) {
        $('#add30s').toggle(show);
        $('#sub15s').toggle(show);
    },
    getActiveId() {
        return $('.selected').data('id');
    },
    getActiveSource() {
        return source[this.getActiveId()];
    },
    dropRestrictions() {
        $("#restart").prop("disabled", false);
    },
    imposeRestrictions() {
        $("#restart").prop("disabled", true);
    }
}