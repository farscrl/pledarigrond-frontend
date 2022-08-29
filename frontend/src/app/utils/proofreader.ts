import tokenize from '@stdlib/nlp-tokenize';
import { IProofreaderInterface, ITextWithPosition } from '@farscrl/tiptap-extension-spellchecker';

export class Proofreader implements IProofreaderInterface {
  hunspell: any;

  constructor(hunspell: any) {
    this.hunspell = hunspell;
  }

  changeLanguage(hunspell: any) {
    this.hunspell = hunspell;
  }

  proofreadText(sentence: string): Promise<ITextWithPosition[]> {
    const tokens = this.tokenizeString(sentence);
    const errors: ITextWithPosition[] = [];

    tokens.forEach(tkn => {
      if (!this.hunspell.check(tkn.word)) {
        errors.push(tkn);
      }
    });

    return Promise.resolve(errors);
  }

  getSuggestions(word: string): Promise<string[]> {
    return Promise.resolve(this.hunspell.suggest(word));
  }

  normalizeTextForLanguage(text: string): string {
    return text.split('’').join("'");;
  }

  private tokenizeString(text: string): ITextWithPosition[] {
    const tkns = tokenize(text, false) as string[];
    const tokens: ITextWithPosition[] = [];

    let trimmedOffset = 0;
    tkns.forEach(tkn => {
      // remove interpunctuation tokens
      if (tkn === '©' || tkn === '' || tkn === ':' || tkn === ';' || tkn === '!' || tkn === '+' || tkn == ',' || tkn === '.' || tkn === '(' || tkn === ')' || tkn === '{' || tkn === '}' ||tkn === '[' || tkn === ']' || this.isNumeric(tkn)) {
        return;
      }

      if(tkn.startsWith("«") || tkn.startsWith('"')) {
        tkn = tkn.slice(1, tkn.length);
      }

      if (tkn.endsWith("»") || tkn.endsWith('"')) {
        tkn = tkn.slice(0, tkn.length - 1);
      }

      const index = text.indexOf(tkn);
      tokens.push({
        offset: trimmedOffset + index,
        length: tkn.length,
        word: tkn
      });
      text = text.substring(index);
      trimmedOffset += index;
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
}
