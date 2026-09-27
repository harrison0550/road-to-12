from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "icons"
PREVIEWS = ROOT / "ui-app-icon-previews"
OUT.mkdir(parents=True, exist_ok=True)
PREVIEWS.mkdir(parents=True, exist_ok=True)

FONT_BOLD = Path("C:/Windows/Fonts/arialbd.ttf")


def gradient(size, top=(5, 16, 34), bottom=(6, 34, 69)):
    image = Image.new("RGB", (size, size))
    pixels = image.load()
    for y in range(size):
        t = y / max(1, size - 1)
        color = tuple(round(a * (1 - t) + b * t) for a, b in zip(top, bottom))
        for x in range(size):
            pixels[x, y] = color
    return image.convert("RGBA")


def draw_icon(size=1024, maskable=False):
    scale = size / 1024
    canvas = gradient(size)
    glow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    line = max(6, round(34 * scale))
    inset = 120 if maskable else 86
    points = [
        (inset, 455), (275, 278), (366, 377), (506, 174),
        (621, 335), (690, 265), (1024 - inset, 455),
    ]
    points = [(round(x * scale), round(y * scale)) for x, y in points]
    glow_draw.line(points, fill=(37, 139, 255, 220), width=line * 2, joint="curve")
    glow = glow.filter(ImageFilter.GaussianBlur(max(4, round(24 * scale))))
    canvas.alpha_composite(glow)

    draw = ImageDraw.Draw(canvas)
    draw.line(points, fill=(91, 178, 255, 255), width=line, joint="curve")
    snow = [(470, 230), (506, 174), (555, 243), (526, 228), (504, 260)]
    draw.polygon([(round(x * scale), round(y * scale)) for x, y in snow], fill=(225, 243, 255, 255))
    trail = [(310, 495), (395, 447), (472, 469), (553, 420), (622, 443), (706, 388)]
    draw.line([(round(x * scale), round(y * scale)) for x, y in trail], fill=(34, 211, 238, 255), width=max(4, round(13 * scale)), joint="curve")

    text = "12%"
    font = ImageFont.truetype(str(FONT_BOLD), round((270 if not maskable else 245) * scale))
    box = draw.textbbox((0, 0), text, font=font, stroke_width=0)
    tw = box[2] - box[0]
    y = round((525 if not maskable else 535) * scale)
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.text(((size - tw) // 2, y), text, font=font, fill=(44, 151, 255, 210), stroke_width=max(1, round(4 * scale)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(max(3, round(13 * scale))))
    canvas.alpha_composite(shadow)
    draw = ImageDraw.Draw(canvas)
    draw.text(((size - tw) // 2, y), text, font=font, fill=(247, 251, 255, 255), stroke_width=max(1, round(3 * scale)), stroke_fill=(115, 190, 255, 255))
    return canvas


primary = draw_icon()
maskable = draw_icon(maskable=True)
primary.save(OUT / "road12-app-icon-1024.png", optimize=True)
maskable.resize((512, 512), Image.Resampling.LANCZOS).save(OUT / "road12-maskable-512.png", optimize=True)

for size, name in [
    (180, "apple-touch-icon-180.png"),
    (192, "road12-app-icon-192.png"),
    (512, "road12-app-icon-512.png"),
    (32, "favicon-32.png"),
    (16, "favicon-16.png"),
]:
    primary.resize((size, size), Image.Resampling.LANCZOS).save(OUT / name, optimize=True)

# Approval board: icon alone on light and dark surfaces.
board = Image.new("RGB", (1400, 760), (238, 244, 250))
bd = ImageDraw.Draw(board)
bd.rounded_rectangle((700, 0, 1400, 760), radius=0, fill=(4, 12, 26))
preview = primary.resize((500, 500), Image.Resampling.LANCZOS)
for x in (100, 800):
    board.paste(preview, (x, 90), preview)
font = ImageFont.truetype(str(FONT_BOLD), 34)
bd.text((350, 650), "LIGHT SURFACE", anchor="mm", font=font, fill=(19, 55, 91))
bd.text((1050, 650), "DARK SURFACE", anchor="mm", font=font, fill=(143, 201, 255))
board.save(PREVIEWS / "road12-app-icon-light-dark.png", optimize=True)

# Simple iPhone home-screen simulation at the requested mobile scale.
phone = Image.new("RGB", (390, 844), (5, 14, 29))
pd = ImageDraw.Draw(phone)
for y in range(844):
    t = y / 843
    pd.line((0, y, 390, y), fill=(5, round(17 + 15 * t), round(35 + 28 * t)))
pd.rounded_rectangle((15, 15, 375, 829), radius=48, outline=(40, 82, 125), width=2)
pd.rounded_rectangle((146, 28, 244, 55), radius=14, fill=(0, 0, 0))
pd.text((34, 38), "9:41", font=ImageFont.truetype(str(FONT_BOLD), 17), fill="white")
home_icon = primary.resize((122, 122), Image.Resampling.LANCZOS)
mask = Image.new("L", (122, 122), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, 121, 121), radius=27, fill=255)
phone.paste(home_icon, (134, 208), mask)
pd.text((195, 350), "Road to 12%", anchor="mm", font=ImageFont.truetype(str(FONT_BOLD), 18), fill=(246, 250, 255))
pd.text((195, 715), "Exercise Media Library v2", anchor="mm", font=ImageFont.truetype(str(FONT_BOLD), 20), fill=(91, 178, 255))
phone.save(PREVIEWS / "road12-iphone-home-screen-390x844.png", optimize=True)

print(f"Generated icons in {OUT}")
print(f"Generated previews in {PREVIEWS}")
