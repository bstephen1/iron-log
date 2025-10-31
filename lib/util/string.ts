/** Capitalize first letter of a string.
 *  Mui has an undocumented capitalize() function, but it doesn't work in node env
 *  (eg, running ts script files from command line).   */
export const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)
