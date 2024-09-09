import { Injectable } from "@angular/core";
import { Idiom } from "../services/selected-language.service";

@Injectable()
export class LanguageUtils {

  isSupportedLanguage(idiom: Idiom): boolean {
    if (idiom === 'rumgr' || idiom === 'surmiran' || idiom === 'sutsilv' || idiom === 'sursilv') {
      return true;
    }

    return false;
  }
}
