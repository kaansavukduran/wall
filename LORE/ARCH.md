# Architecture

index.html and start.js own the current browser boot path. game.js owns local progression, routing, keyboard and touch input. world.js owns cached pixel-art stages and sprite playback. content.js owns authored episode translations and source links. The app exports as static files for a Pages project subpath.
