import { Flashcard } from "./Flashcard";

export interface Cardset {
  cardsetName: string;
  class: string;
  createdByDocId: string;
  createdById: string;
  flashcardSet: Array<Flashcard>;
  seed: string;
  units: string[];
}
