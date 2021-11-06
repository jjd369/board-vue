import modules from '../modules'

export default function dispatchActionInit() {
  return (store) => {
    for (const moduleName in modules) {
      const moduleDefinition = modules[moduleName]
      if (moduleDefinition.actions['init']) {
        store.dispatch(`${moduleName}/init`)
      }
    }
  }
}
