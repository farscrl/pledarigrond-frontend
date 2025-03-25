import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LemmaVersion } from '../../../../models/lemma-version';

@Component({
    selector: 'app-details-example',
    templateUrl: './details-example.component.html',
    styleUrl: './details-example.component.scss',
    standalone: false
})
export class DetailsExampleComponent implements OnChanges {

  @Input()
  lemmaVersion?: LemmaVersion;

  public examples: Example[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['lemmaVersion'] || ! changes['lemmaVersion'].currentValue) {
      return;
    }
    this.defineExamples();
  }

  private defineExamples() {
    this.examples = [];
    const examplesString = this.lemmaVersion?.lemmaValues.examples;
    if (!examplesString) {
      return;
    }

    const examples = examplesString.split('\n');
    examples.forEach(example => this.examples.push(this.splitExampleString(example)));
  }

  splitExampleString(str: string): Example {
    const example = new Example();

    const parts = str.split('###');
    const rm = parts[0];
    const de = parts.length > 1 ? parts.slice(1).join('###') : '';

    example.rm = rm;
    example.de = de;
    return example;
  }
}

class Example {
  public rm?: string;
  public de?: string;
}
