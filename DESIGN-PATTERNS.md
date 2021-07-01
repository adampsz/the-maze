# Wzorce projektowe

## Zastosowane wzorce

- Model View Controller
  - model (`./src/model`) przechowujący stan labiryntu, aktualizujący byty, ...
  - view (`./src/view`, `./src/ui`) odpowiedzialny za prezentację labiryntu.
- Singleton - `./src/model/App`, `./src/model/blocks/GenericBlock`
- Flyweight (?) - w całej grze są tworzone tylko dwie instancje `GenericBlock`, które wielokrotnie są wykorzystywane jako ściana i podłoga.

## Inne wzorce

- Memento - umożliwiłby zapis stanu gry, checkpointy, ...
- Indexer
