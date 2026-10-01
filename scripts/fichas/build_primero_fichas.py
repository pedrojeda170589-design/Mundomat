"""Generador y validador de los JSON de fichas de 1.º grado.
Escribe:
  scripts/fichas/primero-lengua.json (39 mundos)
  scripts/fichas/primero-matematica.json (24 mundos)
  scripts/fichas/primero-sociales.json (18 mundos)
  scripts/fichas/primero-naturales.json (15 mundos)
Total: 96 fichas (1 por mundo).
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))

from data_lengua_1 import LENGUA_1
from data_matematica_1 import MATEMATICA_1
from data_sociales_1 import SOCIALES_1
from data_naturales_1 import NATURALES_1

DATA_BY_SUBJ = {
    "lengua": (LENGUA_1, 11001, 39),
    "matematica": (MATEMATICA_1, 12001, 24),
    "sociales": (SOCIALES_1, 13001, 18),
    "naturales": (NATURALES_1, 14001, 15),
}

VALID_KINDS = {"hacer", "juego", "investigo", "converso", "creo"}


def check_no_emojis(data, subject):
    text = json.dumps(data)
    emoji_pattern = re.compile(
        r'[\U00010000-\U0010ffff]'
        r'|[\u2600-\u27bf]'
        r'|[\u2300-\u23ff]'
        r'|[\u2b50-\u2b55]'
    )
    matches = emoji_pattern.findall(text)
    if matches:
        raise ValueError(f"Emojis encontrados en {subject}: {matches[:10]}")


def validate_and_save():
    total_mundos = 0
    for subject, (data, start_id, count) in DATA_BY_SUBJ.items():
        print(f"Validando {subject}...")
        check_no_emojis(data, subject)
        
        expected_keys = [str(start_id + i) for i in range(count)]
        actual_keys = list(data.keys())
        
        if len(actual_keys) != count:
            raise ValueError(f"{subject}: se esperaban {count} mundos, pero hay {len(actual_keys)}")
        
        for k in expected_keys:
            if k not in data:
                raise ValueError(f"{subject}: falta la clave {k}")
            fichas = data[k]
            if not isinstance(fichas, list) or len(fichas) != 1:
                raise ValueError(f"{subject}[{k}]: debe ser una lista con exactamente 1 ficha")
            f = fichas[0]
            if not f.get("title") or not f.get("purpose"):
                raise ValueError(f"{subject}[{k}]: falta title o purpose")
            blocks = f.get("blocks", [])
            if len(blocks) < 2:
                raise ValueError(f"{subject}[{k}]: se esperaban al menos 2 bloques, hay {len(blocks)}")
            kinds = set()
            for b in blocks:
                kind = b.get("kind")
                if kind not in VALID_KINDS:
                    raise ValueError(f"{subject}[{k}]: kind inválido '{kind}'")
                kinds.add(kind)
                if not b.get("title") or not b.get("steps"):
                    raise ValueError(f"{subject}[{k}]: bloque sin title o steps")
            self_check = f.get("selfCheck", [])
            if len(self_check) != 3:
                raise ValueError(f"{subject}[{k}]: selfCheck debe tener 3 items, hay {len(self_check)}")
            for item in self_check:
                if not item.startswith("Puedo"):
                    raise ValueError(f"{subject}[{k}]: selfCheck item debe empezar con 'Puedo', vino: '{item}'")
        
        out_path = os.path.join(HERE, f"primero-{subject}.json")
        with open(out_path, "w", encoding="utf-8") as fp:
            json.dump(data, fp, ensure_ascii=False, indent=2)
        print(f"  -> Guardado {out_path} ({count} mundos)")
        total_mundos += count
    
    print(f"\n¡Validación exitosa! {total_mundos} mundos guardados en formato JSON sin errores ni emojis.")


if __name__ == "__main__":
    validate_and_save()
