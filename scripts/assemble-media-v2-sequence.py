from __future__ import annotations

import argparse
import subprocess
import tempfile
from pathlib import Path

from PIL import Image


FRAME_SIZE = (704, 880)
FRAME_ORDER = (0, 1, 2, 3, 0)
FRAME_DURATIONS_MS = (500, 400, 500, 400, 500)


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
    parser.add_argument("slug")
    parser.add_argument("--ffmpeg", type=Path, required=True)
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    source = Image.open(args.source).convert("RGB")
    boundaries = [round(source.width * index / 4) for index in range(5)]
    raw_panels = [
        source.crop((boundaries[index], 0, boundaries[index + 1], source.height))
        for index in range(4)
    ]
    frames = [cover_resize(panel, FRAME_SIZE) for panel in raw_panels]
    sequence = Image.new("RGB", (FRAME_SIZE[0] * 4, FRAME_SIZE[1]))
    for index, frame in enumerate(frames):
        sequence.paste(frame, (index * FRAME_SIZE[0], 0))

    prefix = f"road12-v2-{args.slug}"
    poster_path = args.output / f"{prefix}-poster.webp"
    sequence_path = args.output / f"{prefix}-sequence.webp"
    motion_webp_path = args.output / f"{prefix}-motion.webp"
    motion_mp4_path = args.output / f"{prefix}-motion.mp4"

    frames[0].save(poster_path, "WEBP", quality=88, method=6)
    sequence.save(sequence_path, "WEBP", quality=86, method=6)
    animation = [frames[index] for index in FRAME_ORDER]
    animation[0].save(
        motion_webp_path,
        "WEBP",
        save_all=True,
        append_images=animation[1:],
        duration=list(FRAME_DURATIONS_MS),
        loop=0,
        quality=82,
        method=6,
    )

    with tempfile.TemporaryDirectory(prefix=f"road12-{args.slug}-") as temp_dir_name:
        temp_dir = Path(temp_dir_name)
        concat_lines: list[str] = []
        for index, (frame, duration_ms) in enumerate(zip(animation, FRAME_DURATIONS_MS), start=1):
            frame_path = temp_dir / f"frame-{index:03d}.png"
            frame.save(frame_path, "PNG", optimize=True)
            concat_lines.extend((f"file '{frame_path.as_posix()}'", f"duration {duration_ms / 1000:.3f}"))
        concat_lines.append(f"file '{(temp_dir / 'frame-005.png').as_posix()}'")
        concat_path = temp_dir / "frames.txt"
        concat_path.write_text("\n".join(concat_lines) + "\n", encoding="utf-8")
        subprocess.run(
            [
                str(args.ffmpeg), "-y", "-f", "concat", "-safe", "0", "-i", str(concat_path),
                "-vf", "fps=20,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "24",
                "-movflags", "+faststart", str(motion_mp4_path),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

    for path in (poster_path, sequence_path, motion_webp_path, motion_mp4_path):
        print(f"{path.name}\t{path.stat().st_size}")


if __name__ == "__main__":
    main()
