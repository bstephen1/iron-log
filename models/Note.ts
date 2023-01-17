export default class Note {
  constructor(
    public readonly userId: string = '',
    public value = '',
    public tags: string[] = []
  ) {}
}
