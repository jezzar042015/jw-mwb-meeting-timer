const alerts = {
    raise() {

    },
    drop() {
        $(".timer-warning").removeClass("timer-warning");
        $(".blinking-overtime").removeClass("blinking-overtime");
    }
}

export default alerts;