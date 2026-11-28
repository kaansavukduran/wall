package com.fragariainteractive.wall;

final class JoystickInput {
    interface Dispatch {
        void send(String action, boolean pressed);
    }

    private final Dispatch dispatch;
    private int deviceId = -1;
    private int direction;
    private int hatHorizontal;
    private int hatVertical;

    JoystickInput(Dispatch dispatch) {
        this.dispatch = dispatch;
    }

    void update(int sourceId, float stick, float horizontalHat, float verticalHat) {
        if (deviceId != sourceId) {
            reset();
            deviceId = sourceId;
        }
        changeDirection(axis(stick));
        int horizontal = axis(horizontalHat);
        int vertical = axis(verticalHat);
        if (horizontal != 0 && horizontal != hatHorizontal) {
            dispatch.send(horizontal < 0 ? "left" : "right", true);
        }
        if (vertical != 0 && vertical != hatVertical) {
            dispatch.send(vertical < 0 ? "previous" : "next", true);
        }
        hatHorizontal = horizontal;
        hatVertical = vertical;
    }

    void remove(int removedId) {
        if (deviceId == removedId) reset();
    }

    void reset() {
        changeDirection(0);
        hatHorizontal = hatVertical = 0;
        deviceId = -1;
    }

    private void changeDirection(int next) {
        if (direction == next) return;
        if (direction != 0) dispatch.send(direction < 0 ? "move-left" : "move-right", false);
        direction = next;
        if (direction != 0) dispatch.send(direction < 0 ? "move-left" : "move-right", true);
    }

    private static int axis(float value) {
        return Math.abs(value) > 0.35f ? (value < 0 ? -1 : 1) : 0;
    }
}
