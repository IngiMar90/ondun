# Human breathing recordings

Both WAV files are excerpts from **Long single breath through nose (male) 01.wav** by **thomasXkiteXforXlife**, published 14 November 2017.

- Source: https://freesound.org/people/thomasXkiteXforXlife/sounds/410864/
- Public HQ MP3 supplied by the source page: https://cdn.freesound.org/previews/410/410864_3102860-hq.mp3
- License: **CC0 1.0 Universal**, https://creativecommons.org/publicdomain/zero/1.0/
- The creator describes a microphone recording of a man breathing slowly through his nose (four slow inhales, one quick inhale, three slow exhales), using a Rode NTG-2 and Tascam DR-40. No synthetic noise or AI-generated sound is used in the app's audio.

## Edits

`inhale.wav`: 3.05–5.65 seconds of the source, slowed with FFmpeg `atempo=0.65` (pitch preserved).

`exhale.wav`: 17.65–20.65 seconds of the source, slowed with FFmpeg `atempo=0.75` (pitch preserved).

Both: 100 Hz high-pass filter to reduce low rumble, mono 24 kHz PCM 16-bit, trimmed/padded to exactly four seconds, 30 ms fade-in and 100 ms fade-out. Volume normalized to RMS 0.08 with a 0.65 peak ceiling. No looping within a breath, added noise, music, speech or reverb.

The sound is permitted to be copied, adapted and redistributed under CC0. Credit is retained here for provenance even though CC0 does not require attribution.
