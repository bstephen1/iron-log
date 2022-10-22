export default interface Modifier {
  id: string
  name: string
  status: string
  canDelete: boolean //certain modifiers that enable special behavior can't be deleted
}
