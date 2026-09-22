export class Example {
    public jsCode?: Function;

    constructor(public title: string, public desc: string, public code: string, public sourceCodeJS?: string, public sourceCodeHTML?: string) {
        this.jsCode = new Function(sourceCodeJS);
    }
}
