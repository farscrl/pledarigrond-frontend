import tokenize from '@stdlib/nlp-tokenize';
import { IProofreaderInterface, ITextWithPosition } from '@farscrl/tiptap-extension-spellchecker';
import { Hunspell } from "hunspell-asm";

export class Proofreader implements IProofreaderInterface {
  hunspell: Hunspell;
  punctuation = ['.', '©', '', ':', ';', '!', '+', ',', '(', ')', '{', '}', '[', ']', '?', '|', "«", "»"];

  constructor(hunspell: Hunspell) {
    this.hunspell = hunspell;
  }

  changeLanguage(hunspell: any) {
    this.hunspell = hunspell;
  }

  proofreadText(sentence: string): Promise<ITextWithPosition[]> {
    const tokens = this.tokenizeString(sentence);
    const errors: ITextWithPosition[] = [];

    tokens.forEach(tkn => {
      if (!this.hunspell.spell(this.removeSpecialChars(tkn.word))) {
        errors.push(tkn);
      }
    });

    return Promise.resolve(errors);
  }

  getSuggestions(word: string): Promise<string[]> {
    return Promise.resolve(this.hunspell.suggest(this.removeSpecialChars(word)));
  }

  normalizeTextForLanguage(text: string): string {
    return text.split('’').join("'");;
  }

  private tokenizeString(text: string): ITextWithPosition[] {
    const tkns = tokenize(text, false) as string[];
    const tokens: ITextWithPosition[] = [];

    let trimmedOffset = 0;

    tkns.forEach(tkn => {
      if (this.punctuation.includes(tkn)) {
        return;
      }

      if (this.isNumeric(tkn)) {
        return;
      }

      tkn = this.normalizeString(tkn);

      const index = text.indexOf(tkn, trimmedOffset);
      tokens.push({
        offset: index,
        length: tkn.length,
        word: tkn
      });
      trimmedOffset = (index + tkn.length);
    });

    return tokens;
  }

  private isNumeric(str: string) {
    if (typeof str != "string") {
      return false;
    }

    // @ts-ignore
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  private normalizeString(tkn: string) {
    let didChange = false;

    do {
      didChange = false;
      const first = tkn.charAt(0);
      if (this.punctuation.includes(first)) {
        tkn = tkn.slice(1, tkn.length);
        didChange = true;
      }
    } while (didChange);

    do {
      didChange = false;
      const last = tkn.slice(-1);
      if (this.punctuation.includes(last)) {
        tkn = tkn.slice(0, tkn.length - 1);
        didChange = true;
      }
    } while (didChange);

    return tkn;
  }

  private removeSpecialChars(text: string): string {
    // remove soft hyphen, zero-width space, thin space
    return text.replace(/[\u00AD\u200B\u2009]+/g,'');
  }
}
