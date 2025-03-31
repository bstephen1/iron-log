/** an api query that has yet to be invalidated.
 *  If there are multiple duplicate keys, the values will
 *  be condensed into an array
 */
export type ApiParams<T> = {
  [key in keyof T]: string | string[] | undefined
}
