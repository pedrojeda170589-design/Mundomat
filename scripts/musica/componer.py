"""Música original de MundoTest26, compuesta y sintetizada por código.

No usa muestras, bancos de sonido ni servicios externos: cada instrumento se
genera con síntesis (osciladores, Karplus-Strong, ruido filtrado). Toda la
música es original, así que no depende de ninguna licencia de terceros.

Uso:  python3 scripts/musica/componer.py [carpeta_salida]
Genera public/audio/musica/<pista>.mp3 (requiere numpy y ffmpeg).
"""
import math
import os
import subprocess
import sys

import numpy as np

SR = 44100
RNG = np.random.default_rng(26)

NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6,
        "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}


def hz(name):
    """'A4' -> 440.0"""
    n, o = name[:-1], int(name[-1])
    midi = 12 * (o + 1) + NOTE[n]
    return 440.0 * 2 ** ((midi - 69) / 12)


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env_adsr(n, a=0.01, d=0.1, s=0.7, r=0.2):
    t = np.arange(n) / SR
    dur = n / SR
    e = np.ones(n) * s
    a_n = max(1, int(a * SR))
    d_n = max(1, int(d * SR))
    r_n = max(1, int(r * SR))
    e[:a_n] = np.linspace(0, 1, a_n)
    e[a_n:a_n + d_n] = np.linspace(1, s, min(d_n, max(0, n - a_n)))[: max(0, min(d_n, n - a_n))]
    if n > r_n:
        e[-r_n:] *= np.linspace(1, 0, r_n)
    return e


# ---------------- instrumentos ----------------

def music_box(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    partials = [(1, 1.0), (2.0, 0.35), (3.01, 0.18), (5.4, 0.08), (8.9, 0.03)]
    y = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (2.2 + 1.5 * k)) for k, a in partials)
    y *= np.minimum(1, t / 0.003)
    return y * 0.6


def pluck(f, dur, bright=0.5, decay=0.996):
    """Karplus-Strong: cuerda pulsada (guitarra, ukelele, charango)."""
    n = int(dur * SR)
    p = max(2, int(SR / f))
    buf = RNG.uniform(-1, 1, p)
    # filtro inicial: menos brillo = más suave
    for _ in range(int((1 - bright) * 4)):
        buf = 0.5 * (buf + np.roll(buf, 1))
    out = np.zeros(n)
    for i in range(n):
        v = buf[i % p]
        out[i] = v
        buf[i % p] = decay * 0.5 * (v + buf[(i + 1) % p])
    out *= np.minimum(1, np.arange(n) / (0.002 * SR))
    fade = int(0.03 * SR)
    if n > fade:
        out[-fade:] *= np.linspace(1, 0, fade)
    return out * 0.7


def flute(f, dur, vib=5.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    v = 1 + 0.006 * np.sin(2 * np.pi * vib * t) * np.minimum(1, t / 0.3)
    ph = 2 * np.pi * f * np.cumsum(v) / SR
    y = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    breath = np.convolve(RNG.normal(0, 1, n), np.ones(20) / 20, mode="same") * 0.04
    return (y + breath) * env_adsr(n, 0.06, 0.1, 0.85, min(0.25, dur * 0.3)) * 0.45


def pad(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for det in (-0.004, 0, 0.004):
        ph = 2 * np.pi * f * (1 + det) * t
        y += np.sin(ph) + 0.3 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)
    return y / 3 * env_adsr(n, min(0.8, dur * 0.4), 0.2, 0.9, min(0.8, dur * 0.4)) * 0.25


def marimba(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) * np.exp(-t * 6) + 0.3 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 18)
    y *= np.minimum(1, t / 0.002)
    return y * 0.6


def bass(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) + 0.2 * np.sin(4 * np.pi * f * t)
    return y * env_adsr(n, 0.01, 0.15, 0.6, 0.08) * 0.5


def pizz(f, dur):
    return pluck(f, min(dur, 0.35), bright=0.3, decay=0.985) * 0.9


def bombo(dur=0.5, soft=1.0):
    """Bombo legüero suave: golpe grave + parche."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 70 * np.exp(-t * 8) + 48
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    y += np.convolve(RNG.normal(0, 1, n), np.ones(30) / 30, mode="same") * np.exp(-t * 40) * 0.3
    return y * 0.7 * soft


def shaker(dur=0.08):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = RNG.normal(0, 1, n)
    noise = noise - np.convolve(noise, np.ones(6) / 6, mode="same")  # agudo
    return np.convolve(noise, np.ones(3) / 3, mode="same") * np.exp(-t * 70) * 0.05


def waves(dur):
    """Olas de fondo (ruido filtrado que sube y baja)."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = np.convolve(RNG.normal(0, 1, n), np.ones(200) / 200, mode="same")
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * t / 7.0) ** 2
    return noise * lfo * 0.6


# ---------------- utilidades de mezcla ----------------

class Track:
    def __init__(self, seconds):
        self.n = int(seconds * SR)
        self.L = np.zeros(self.n + SR * 4)
        self.R = np.zeros(self.n + SR * 4)

    def add(self, sig, at, gain=1.0, pan=0.0):
        i = int(at * SR)
        j = min(len(self.L), i + len(sig))
        s = sig[: j - i] * gain
        self.L[i:j] += s * math.cos((pan + 1) * math.pi / 4)
        self.R[i:j] += s * math.sin((pan + 1) * math.pi / 4)

    def render(self, reverb=0.25):
        out = []
        for ch in (self.L, self.R):
            y = ch.copy()
            # reverberación simple (ecos múltiples decrecientes)
            for k, (d, g) in enumerate([(0.031, 0.5), (0.047, 0.42), (0.071, 0.35), (0.113, 0.27), (0.167, 0.2)]):
                dd = int(d * SR * (1.0 + 0.07 * k))
                y[dd:] += ch[:-dd] * g * reverb
            # el final (cola) se suma al principio para que el loop no corte
            tail = y[self.n:]
            y = y[: self.n]
            y[: len(tail)] += tail
            out.append(y)
        st = np.stack(out, axis=1)
        st /= max(1e-9, np.abs(st).max())
        return st * 0.5


def write(st, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pcm = (np.clip(st, -1, 1) * 32767).astype(np.int16)
    tmp = path + ".raw"
    pcm.tofile(tmp)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", tmp,
                    "-af", "loudnorm=I=-20:TP=-2:LRA=11", "-ar", "44100", "-b:a", "96k", path], check=True)
    os.remove(tmp)
    print(path, f"{len(st) / SR:.1f}s", os.path.getsize(path) // 1024, "KB")


def chord_notes(root, kind, octave):
    base = 12 * (octave + 1) + NOTE[root]
    iv = {"M": [0, 4, 7], "m": [0, 3, 7], "7": [0, 4, 7, 10], "m7": [0, 3, 7, 10], "M7": [0, 4, 7, 11], "sus": [0, 5, 7]}[kind]
    return [base + i for i in iv]


def parse_chord(c):
    root = c[:2] if len(c) > 1 and c[1] in "#b" else c[:1]
    kind = c[len(root):] or "M"
    return root, kind


def melody_line(scale_midi, length, seed, step_choices=(-2, -1, 1, 2, 0, 3, -3), start=None):
    rng = np.random.default_rng(seed)
    idx = start if start is not None else len(scale_midi) // 2
    out = []
    for _ in range(length):
        out.append(scale_midi[idx])
        idx = int(np.clip(idx + rng.choice(step_choices), 0, len(scale_midi) - 1))
    return out


def scale(root_midi, mode, octaves=2):
    steps = {"major": [0, 2, 4, 5, 7, 9, 11], "minor": [0, 2, 3, 5, 7, 8, 10], "dorian": [0, 2, 3, 5, 7, 9, 10],
             "penta_m": [0, 3, 5, 7, 10], "penta": [0, 2, 4, 7, 9]}[mode]
    return [root_midi + 12 * o + s for o in range(octaves) for s in steps] + [root_midi + 12 * octaves]


# ---------------- piezas ----------------

def pieza_cuento():
    """Caja de música: calma, para escuchar cuentos."""
    bpm, beats = 72, 4
    prog = ["F", "Dm", "Bb", "C", "F", "Am", "Bb", "C"]
    beat = 60 / bpm
    bar = beat * beats
    reps = 2
    tr = Track(bar * len(prog) * reps)
    sc = scale(65, "major")  # F4
    mel = melody_line(sc, len(prog) * 4, 7, start=4)
    for r in range(reps):
        for b, c in enumerate(prog):
            t0 = (r * len(prog) + b) * bar
            root, kind = parse_chord(c)
            notes = chord_notes(root, kind, 3)
            tr.add(pad(midi_hz(notes[0]), bar * 1.05), t0, 0.5)
            tr.add(pad(midi_hz(notes[1] + 12), bar * 1.05), t0, 0.25, -0.3)
            for k in range(8):  # arpegio de caja de música
                n = notes[[0, 1, 2, 1][k % 4]] + 24
                tr.add(music_box(midi_hz(n), 1.6), t0 + k * beat / 2, 0.35, 0.3)
            for k in range(4):
                if (b + k + r) % 3 != 2:
                    tr.add(music_box(midi_hz(mel[b * 4 + k] + 12), 2.0), t0 + k * beat, 0.55, -0.2)
    return tr.render(0.35)


def pieza_leyenda():
    """Quena, bajo pedal y bombo legüero suave: misterio andino-patagónico."""
    bpm = 66
    beat = 60 / bpm
    bar = beat * 4
    prog = ["Am", "Am", "G", "Am", "F", "G", "Am", "Em"]
    reps = 2
    tr = Track(bar * len(prog) * reps)
    sc = scale(69, "penta_m")  # A4 pentatónica menor
    phrase = melody_line(sc, 32, 11, step_choices=(-1, 1, 0, 2, -2), start=3)
    for r in range(reps):
        for b, c in enumerate(prog):
            t0 = (r * len(prog) + b) * bar
            root, kind = parse_chord(c)
            notes = chord_notes(root, kind, 2)
            tr.add(pad(midi_hz(notes[0]), bar * 1.1), t0, 0.7)
            tr.add(pad(midi_hz(notes[2] + 12), bar * 1.1), t0, 0.3, 0.4)
            tr.add(bombo(0.6, 0.8), t0, 0.5, -0.1)
            tr.add(bombo(0.5, 0.5), t0 + beat * 2.5, 0.35, -0.1)
            tr.add(pluck(midi_hz(notes[0] + 12), bar, 0.4, 0.998), t0, 0.25, 0.5)
            if b % 2 == 0:  # la quena entra cada dos compases (respira)
                durs = [1.5, 0.5, 1, 1] if (b // 2 + r) % 2 == 0 else [1, 1, 2]
                tt = t0
                for k, d in enumerate(durs):
                    tr.add(flute(midi_hz(phrase[(b * 2 + k + r * 5) % len(phrase)]), d * beat * 1.05), tt, 0.6, -0.15)
                    tt += d * beat
    return tr.render(0.45)


def pieza_fabula():
    """Pizzicato juguetón con bajo saltarín."""
    bpm = 112
    beat = 60 / bpm
    bar = beat * 4
    prog = ["C", "G", "Am", "F", "C", "F", "G", "C"]
    reps = 3
    tr = Track(bar * len(prog) * reps)
    sc = scale(72, "major")
    mel = melody_line(sc, 64, 3, step_choices=(-1, 1, 2, -2, 4, -3))
    for r in range(reps):
        for b, c in enumerate(prog):
            t0 = (r * len(prog) + b) * bar
            root, kind = parse_chord(c)
            notes = chord_notes(root, kind, 2)
            for k in range(4):
                tr.add(pizz(midi_hz(notes[0] if k % 2 == 0 else notes[2]), 0.3), t0 + k * beat, 0.6, -0.3)
            for k in (1, 3):
                for nn in notes:
                    tr.add(pizz(midi_hz(nn + 12), 0.3), t0 + k * beat, 0.25, 0.2)
            pattern = [0.5, 0.5, 1, 0.5, 0.5, 1] if (b + r) % 2 == 0 else [1, 0.5, 0.5, 1, 1]
            tt = t0
            for k, d in enumerate(pattern):
                tr.add(pizz(midi_hz(mel[(b * 6 + k + r * 3) % len(mel)]), 0.3), tt, 0.7, 0.25)
                tt += d * beat
            tr.add(shaker(), t0 + beat * 1.5, 0.6, 0.6)
            tr.add(shaker(), t0 + beat * 3.5, 0.6, 0.6)
    return tr.render(0.25)


def pieza_costa():
    """1.º grado, costa: ukelele, olas y shaker."""
    bpm = 100
    beat = 60 / bpm
    bar = beat * 4
    prog = ["C", "G", "Am", "F"] * 2
    reps = 3
    tr = Track(bar * len(prog) * reps)
    sc = scale(72, "penta")
    mel = melody_line(sc, 64, 21, step_choices=(-1, 1, 1, -1, 2, -2, 0))
    tr.add(waves(bar * len(prog) * reps), 0, 0.15)
    strum = [0, 0.5, 1.5, 2, 2.5, 3.5]  # rasgueo de ukelele
    for r in range(reps):
        for b, c in enumerate(prog):
            t0 = (r * len(prog) + b) * bar
            root, kind = parse_chord(c)
            notes = chord_notes(root, kind, 4)
            for s in strum:
                for i, nn in enumerate(notes + [notes[0] + 12]):
                    tr.add(pluck(midi_hz(nn), 0.6, 0.7, 0.993), t0 + s * beat + i * 0.012, 0.18, 0.25)
            tr.add(bass(midi_hz(notes[0] - 24), beat * 1.8), t0, 0.5)
            tr.add(bass(midi_hz(notes[2] - 24), beat * 1.8), t0 + beat * 2, 0.4)
            for k in range(8):
                tr.add(shaker(), t0 + k * beat / 2, 0.5 if k % 2 else 0.25, -0.5)
            if r > 0 or b >= 4:
                pattern = [1, 0.5, 0.5, 1, 1] if b % 2 == 0 else [0.5, 0.5, 1, 2]
                tt = t0
                for k, d in enumerate(pattern):
                    tr.add(marimba(midi_hz(mel[(b * 5 + k + r * 7) % len(mel)]), d * beat * 1.2), tt, 0.55, -0.2)
                    tt += d * beat
    return tr.render(0.25)


def pieza_bosque():
    """2.º grado, bosque de lengas: guitarra en 6/8 y flauta."""
    bpm = 84  # negras con puntillo
    beat = 60 / bpm
    bar = beat * 2  # 6/8: dos pulsos de tres corcheas
    eighth = beat / 3
    prog = ["G", "Em", "C", "D", "G", "Em", "Am", "D"]
    reps = 3
    tr = Track(bar * len(prog) * reps)
    sc = scale(67, "major")
    mel = melody_line(sc, 64, 5, step_choices=(-1, 1, 2, -2, 0))
    for r in range(reps):
        for b, c in enumerate(prog):
            t0 = (r * len(prog) + b) * bar
            root, kind = parse_chord(c)
            notes = chord_notes(root, kind, 3)
            arp = [notes[0], notes[1], notes[2], notes[0] + 12, notes[2], notes[1]]
            for k, nn in enumerate(arp):
                tr.add(pluck(midi_hz(nn), 1.2, 0.45, 0.997), t0 + k * eighth, 0.4, 0.2)
            tr.add(bass(midi_hz(notes[0] - 12), bar), t0, 0.35)
            if r >= 1:
                durs = [3, 2, 1] if b % 2 == 0 else [2, 1, 3]
                tt = t0
                for k, d in enumerate(durs):
                    tr.add(flute(midi_hz(mel[(b * 3 + k + r * 4) % len(mel)] + 12), d * eighth * 1.05), tt, 0.45, -0.25)
                    tt += d * eighth
    return tr.render(0.35)


def pieza_meseta():
    """3.º grado, meseta y montaña: charango, bombo y flauta, aventura."""
    bpm = 96
    beat = 60 / bpm
    bar = beat * 4
    prog = ["Dm", "C", "Bb", "C", "Dm", "F", "C", "Dm"]
    reps = 3
    tr = Track(bar * len(prog) * reps)
    sc = scale(62 + 12, "dorian")
    mel = melody_line(sc, 64, 9, step_choices=(-1, 1, 2, -2, 0, 3))
    strum = [0, 0.75, 1, 1.5, 2, 2.75, 3, 3.5]  # rasgueo de charango
    for r in range(reps):
        for b, c in enumerate(prog):
            t0 = (r * len(prog) + b) * bar
            root, kind = parse_chord(c)
            notes = chord_notes(root, kind, 4)
            for s in strum:
                for i, nn in enumerate(notes):
                    tr.add(pluck(midi_hz(nn + 12), 0.35, 0.9, 0.99), t0 + s * beat + i * 0.008, 0.13, 0.35)
            tr.add(bombo(0.5), t0, 0.6)
            tr.add(bombo(0.4, 0.6), t0 + beat * 1.5, 0.45)
            tr.add(bombo(0.5), t0 + beat * 2, 0.55)
            tr.add(bass(midi_hz(notes[0] - 24), bar * 0.95), t0, 0.45)
            if r >= 1:
                pattern = [1, 1, 0.5, 0.5, 1] if b % 2 == 0 else [2, 1, 1]
                tt = t0
                for k, d in enumerate(pattern):
                    tr.add(flute(midi_hz(mel[(b * 5 + k + r * 3) % len(mel)]), d * beat * 1.05), tt, 0.55, -0.2)
                    tt += d * beat
    return tr.render(0.3)


def pieza_inicio():
    """Pantalla de inicio y tienda: alegre y con energía."""
    bpm = 116
    beat = 60 / bpm
    bar = beat * 4
    prog = ["F", "C", "Dm", "Bb", "F", "C", "Bb", "C"]
    reps = 3
    tr = Track(bar * len(prog) * reps)
    sc = scale(65 + 12, "major")
    mel = melody_line(sc, 64, 17, step_choices=(-1, 1, 2, -2, 0, 4))
    for r in range(reps):
        for b, c in enumerate(prog):
            t0 = (r * len(prog) + b) * bar
            root, kind = parse_chord(c)
            notes = chord_notes(root, kind, 3)
            for k in range(8):
                tr.add(marimba(midi_hz(notes[k % 3] + 12), 0.4), t0 + k * beat / 2, 0.3, 0.3)
            for k in range(4):
                tr.add(bass(midi_hz(notes[0] - 12 + (7 if k == 2 else 0)), beat * 0.9), t0 + k * beat, 0.45)
                tr.add(shaker(), t0 + k * beat + beat / 2, 0.6, -0.5)
            pattern = [0.5, 0.5, 1, 1, 1] if b % 2 == 0 else [1, 0.5, 0.5, 2]
            tt = t0
            for k, d in enumerate(pattern):
                tr.add(music_box(midi_hz(mel[(b * 5 + k + r * 2) % len(mel)]), 1.2), tt, 0.55, -0.25)
                tt += d * beat
    return tr.render(0.25)


def pieza_festejo():
    """Festejo corto al completar un mundo (no se repite)."""
    beat = 60 / 132
    tr = Track(6.0)
    seq = [("C5", 0), ("E5", 0.5), ("G5", 1), ("C6", 1.5), ("G5", 2.25), ("C6", 2.5)]
    for nn, at in seq:
        tr.add(marimba(hz(nn), 1.0), at * beat, 0.7)
        tr.add(music_box(hz(nn), 2.0), at * beat, 0.4, 0.3)
    for nn in ("C4", "E4", "G4", "C5"):
        tr.add(pad(hz(nn), 3.5), 2.5 * beat, 0.35)
    for k in range(6):
        tr.add(shaker(), k * beat / 2, 0.8)
    tr.add(bombo(0.6), 2.5 * beat, 0.6)
    st = tr.render(0.3)
    fade = int(1.2 * SR)
    st[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return st


PIEZAS = {
    "cuento": pieza_cuento,
    "leyenda": pieza_leyenda,
    "fabula": pieza_fabula,
    "mapa-costa": pieza_costa,
    "mapa-bosque": pieza_bosque,
    "mapa-meseta": pieza_meseta,
    "inicio": pieza_inicio,
    "festejo": pieza_festejo,
}

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "..", "public", "audio", "musica")
    only = sys.argv[2:] or list(PIEZAS)
    for name in only:
        write(PIEZAS[name](), os.path.join(out, f"{name}.mp3"))
