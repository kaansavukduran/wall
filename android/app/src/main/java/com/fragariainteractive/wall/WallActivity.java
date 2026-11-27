package com.fragariainteractive.wall;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.InputDevice;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.WindowInsets;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

public final class WallActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private WebView game;
    private int direction;
    private int hatHorizontal;
    private int hatVertical;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        game = new WebView(this);
        game.setBackgroundColor(Color.BLACK);
        game.getSettings().setJavaScriptEnabled(true);
        game.getSettings().setDomStorageEnabled(true);
        game.getSettings().setAllowFileAccess(false);
        game.getSettings().setAllowContentAccess(false);

        WebViewAssetLoader assets = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();
        game.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assets.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                if ("https".equals(url.getScheme()) && HOST.equals(url.getHost())) return false;
                if (request.isForMainFrame() && "https".equals(url.getScheme())) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, url));
                    } catch (ActivityNotFoundException ignored) {
                        // Browsing the bundled lesson remains available.
                    }
                }
                return true;
            }
        });

        if (Build.VERSION.SDK_INT >= 30) {
            game.setOnApplyWindowInsetsListener((view, insets) -> {
                android.graphics.Insets bars = insets.getInsets(
                    WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
                return insets;
            });
        }
        setContentView(game);
        game.loadUrl("https://" + HOST + "/assets/index.html");
    }

    private void send(String action, boolean pressed) {
        if (game == null) return;
        game.evaluateJavascript(
            "window.dispatchEvent(new CustomEvent('wall-controller',{detail:{action:'"
            + action + "',pressed:" + pressed + "}}))", null);
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (!event.isFromSource(InputDevice.SOURCE_GAMEPAD)
                && !event.isFromSource(InputDevice.SOURCE_JOYSTICK)
                && !event.isFromSource(InputDevice.SOURCE_DPAD)) {
            return super.dispatchKeyEvent(event);
        }
        String action = switch (event.getKeyCode()) {
            case KeyEvent.KEYCODE_BUTTON_A, KeyEvent.KEYCODE_DPAD_CENTER -> "activate";
            case KeyEvent.KEYCODE_BUTTON_B -> "back";
            case KeyEvent.KEYCODE_BUTTON_X -> "inspect";
            case KeyEvent.KEYCODE_BUTTON_Y -> "timeline";
            case KeyEvent.KEYCODE_BUTTON_START -> "library";
            case KeyEvent.KEYCODE_DPAD_UP -> "previous";
            case KeyEvent.KEYCODE_DPAD_DOWN -> "next";
            case KeyEvent.KEYCODE_DPAD_LEFT -> "left";
            case KeyEvent.KEYCODE_DPAD_RIGHT -> "right";
            default -> null;
        };
        if (action == null) return super.dispatchKeyEvent(event);
        if (event.getAction() == KeyEvent.ACTION_DOWN && event.getRepeatCount() == 0) send(action, true);
        return true;
    }

    @Override
    public boolean dispatchGenericMotionEvent(MotionEvent event) {
        if (!event.isFromSource(InputDevice.SOURCE_JOYSTICK) || event.getAction() != MotionEvent.ACTION_MOVE) {
            return super.dispatchGenericMotionEvent(event);
        }
        int nextDirection = axis(event.getAxisValue(MotionEvent.AXIS_X));
        if (direction != nextDirection) {
            if (direction != 0) send(direction < 0 ? "move-left" : "move-right", false);
            direction = nextDirection;
            if (direction != 0) send(direction < 0 ? "move-left" : "move-right", true);
        }
        int nextHorizontal = axis(event.getAxisValue(MotionEvent.AXIS_HAT_X));
        int nextVertical = axis(event.getAxisValue(MotionEvent.AXIS_HAT_Y));
        if (nextHorizontal != 0 && nextHorizontal != hatHorizontal) {
            send(nextHorizontal < 0 ? "left" : "right", true);
        }
        if (nextVertical != 0 && nextVertical != hatVertical) {
            send(nextVertical < 0 ? "previous" : "next", true);
        }
        hatHorizontal = nextHorizontal;
        hatVertical = nextVertical;
        return true;
    }

    private static int axis(float value) {
        return Math.abs(value) > 0.35f ? (value < 0 ? -1 : 1) : 0;
    }

    @Override
    protected void onPause() {
        if (direction != 0) send(direction < 0 ? "move-left" : "move-right", false);
        direction = hatHorizontal = hatVertical = 0;
        game.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        game.onResume();
    }
}
