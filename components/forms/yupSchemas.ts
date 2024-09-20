import * as yup from 'yup'

// This method requires using anonymous functions rather than arrow functions (using "function" keyword)
// because arrow functions preserve the context of "this", but Yup needs the nested "this" from addMethod.
yup.addMethod(yup.string, 'unique', function (message: string, list: string[]) {
  return this.test('unique', message, function (value) {
    return !!value && list.length !== new Set(list.concat(value)).size
  })
})

export const buildYupSchema = (
  requiredName?: string,
  uniqueName?: string,
  uniqueList?: string[],
) =>
  yup.object({
    name: yup
      .string()
      .required(`Must have a ${requiredName}`)
      // todo: ts isn't recognizing that addMethod() added this. Possible solutions: https://github.com/jquense/yup/issues/312
      // @ts-ignore
      .unique(`This ${uniqueName} already exists!`, uniqueList),
  })
