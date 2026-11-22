# /// script
# requires-python = ">=3.11,<3.13"
# dependencies = ["ctranslate2==4.6.0", "sentencepiece==0.2.1", "huggingface-hub==0.34.4"]
# ///
"""Translate a JSON batch of syndicated RSS text on the ETL runner's CPU."""
import html
import json
from pathlib import Path
import sys

import ctranslate2
from huggingface_hub import snapshot_download
from sentencepiece import SentencePieceProcessor


def translate(texts):
    # Helsinki-NLP OPUS-MT English–Chinese, CTranslate2 conversion by Sams200.
    # Only tokenizer data, vocab and native model weights are loaded.
    model = Path(snapshot_download(
        "Sams200/opus-mt-en-zh", revision="b86e9540537d109f999f23f0f6de71b99bd9ad0a",
        allow_patterns=["config.json", "model.bin", "shared_vocabulary.json", "source.spm", "target.spm"],
    ))
    source = SentencePieceProcessor(model_file=str(model / "source.spm"))
    target = SentencePieceProcessor(model_file=str(model / "target.spm"))
    translator = ctranslate2.Translator(str(model), device="cpu", compute_type="int8", intra_threads=2)
    tokens = [[">>cmn_Hans<<", *source.encode(html.unescape(text), out_type=str), "</s>"] for text in texts]
    results = translator.translate_batch(tokens, beam_size=3, max_batch_size=8)
    return [target.decode(result.hypotheses[0]) for result in results]


if __name__ == "__main__":
    texts = json.load(sys.stdin.buffer)
    print(json.dumps(translate(texts), ensure_ascii=True))
