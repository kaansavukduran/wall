package com.fragariainteractive.wall;

import java.util.ArrayList;
import java.util.List;

public final class JoystickInputTest {
    public static void main(String[] args) {
        var actions = new ArrayList<String>();
        var input = new JoystickInput((action, pressed) -> actions.add(action + ":" + pressed));

        input.update(11, -1f, -1f, 1f);
        input.remove(12);
        input.update(11, -1f, -1f, 1f);
        expect(actions, "move-left:true", "left:true", "next:true");

        input.remove(11);
        input.remove(11);
        expect(actions, "move-left:false");

        input.update(11, 0.35f, -1f, 1f);
        input.update(11, 1f, -1f, 1f);
        expect(actions, "left:true", "next:true", "move-right:true");

        input.update(12, 1f, 0f, 0f);
        input.remove(11);
        expect(actions, "move-right:false", "move-right:true");

        input.reset();
        input.remove(12);
        expect(actions, "move-right:false");

        input.update(12, 1f, 0f, 0f);
        input.remove(12);
        expect(actions, "move-right:true", "move-right:false");
        System.out.println("Joystick input releases only the active device and resets after reconnect, switch and pause");
    }

    private static void expect(List<String> actual, String... expected) {
        if (!actual.equals(List.of(expected))) {
            throw new AssertionError("Expected " + List.of(expected) + ", received " + actual);
        }
        actual.clear();
    }
}
