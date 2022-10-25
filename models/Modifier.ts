export default interface Modifier {
  _id: string
  name: string
  status: string
  canDelete: boolean // certain modifiers that enable special behavior can't be deleted
}
