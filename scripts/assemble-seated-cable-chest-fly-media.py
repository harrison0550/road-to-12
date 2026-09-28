from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def cover_resize(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_ratio = size[0] / size[1]
    source_ratio = image.width / image.height
    if source_ratio > target_ratio:
        width = round(image.height * target_ratio)
        left = (image.width - width) // 2
        image = image.crop((left, 0, left + width, image.height))
    elif source_ratio < target_ratio:
        height = round(image.width / target_ratio)
        top = (image.height - height) // 2
        image = image.crop((0, top, image.width, top + height))
    return image.resize(size, Image.Resampling.LANCZOS)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("preview", type=Path)
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    args.preview.mkdir(parents=True, exist_ok=True)
    source = Image.open(args.source).convert("RGB")
    if source.width % 4:
        raise ValueError("The movement sequence must contain four equal panels.")

    panel_width = source.width // 4
    raw_panels = [source.crop((index * panel_width, 0, (index + 1) * panel_width, source.height)) for index in range(4)]
    frames = [cover_resize(panel, (720, 960)) for panel in raw_panels]

    slug = "seated-cable-chest-fly"
    sequence_path = args.output / f"road12-v2-{slug}-sequence.webp"
    poster_path = args.output / f"road12-v2-{slug}-poster.webp"
    motion_path = args.output / f"road12-v2-{slug}-motion.webp"
    source.save(sequence_path, "WEBP", quality=90, method=6)
    frames[0].save(poster_path, "WEBP", quality=92, method=6)

    order = [0, 1, 2, 1, 0]
    animation: list[Image.Image] = []
    durations: list[int] = []
    for step, panel_index in enumerate(order):
        current = frames[panel_index]
        animation.append(current)
        durations.append(360 if panel_index in (0, 2) else 180)
        if step == len(order) - 1:
            continue
        following = frames[order[step + 1]]
        for blend_step in range(1, 6):
            animation.append(Image.blend(current, following, blend_step / 6))
            durations.append(55)
    animation[0].save(
        motion_path,
        "WEBP",
        save_all=True,
        append_images=animation[1:],
        duration=durations,
        loop=0,
        quality=84,
        method=6,
    )

    source.save(args.preview / "seated-cable-chest-fly-sequence-approval.png", "PNG", optimize=True)
    frames[0].save(args.preview / "seated-cable-chest-fly-poster-approval.png", "PNG", optimize=True)
    for index, frame in enumerate(frames, start=1):
        frame.save(args.preview / f"seated-cable-chest-fly-frame-{index:03d}.png", "PNG", optimize=True)

    print(f"source={source.size}")
    print(f"sequence={sequence_path}")
    print(f"poster={poster_path}")
    print(f"motion={motion_path} frames={len(animation)}")


if __name__ == "__main__":
    main()
