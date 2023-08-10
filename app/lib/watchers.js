export const watchers = {
    hasActive() {
        return $(".selected").length > 0;
    },
    setTimerControls: function () {
        $("#start").prop("disabled", !this.hasActive());
        $("#restart").prop("disabled", !this.hasActive());
    
        let seconds = Number($(".selected").attr("data-seconds"));
        $("#restart").prop("disabled", seconds === 0);
      },

}