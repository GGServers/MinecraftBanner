Minecraft Banner Generator
---

## About

This Minecraft Banner Geneator is created for MinecraftBanner.org.

It uses HTML5 to generate the banner, no jQuery at all!

It uses the [Minecraft API](https://mcapi.us/) JavaScript library for fetching server info.

[Live Preview](http://gabrielsimmer.com/banner)

## Creating your own banner template

A banner template consists of two things:

1. A .png of the background
2. A .json telling the script how to render text
3. (Optional) A GIMP/Photoshop file for the image

Both files should be named the same thing with their respective file extensions.

The .png background _does not need_ to be specific dimensions, however it is
favorable to display them as rectangles.

#### Example image

![Example](https://raw.githubusercontent.com/GGServers/MinecraftBanner/v1/template/image/classic.png)

### JSON

The JSON file is where you can specify the location for text to go.

```json
{
    "name": "classic",
    "width": "500",
    "height": "200",
    "font": "Titillium Web",
    "ip": {
        "x": 10,
        "y": 40,
        "size":"40px"
    },
    "status": {
        "x": 20,
        "y": 100,
        "size":"40px"
    },
    "players": {
        "x": 20,
        "y": 160,
        "size":"25px"
    }
}
```

Name is (currently) optional, width and height are to be used. Font tells the JavaScript which font family to use, and should a font which is either loaded via CSS, JavaScript, HTML, or the client has installed.

Each "section" block tells the script where to render the text and what size (in px). More options (colours etc) may be added later on.
