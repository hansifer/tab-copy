export async function hasNavigatorPermission(name: PermissionName) {
  let hasPermission = false

  try {
    hasPermission = (await navigator.permissions.query({ name })).state === 'granted'
  } catch (ex) {
    console.warn(`Unable to check navigator permission "${name}"`, ex)
  }

  return hasPermission
}
