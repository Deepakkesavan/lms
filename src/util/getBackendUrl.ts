export const getBackendUrl = (
  mainKey: string,
  subKey: string
): string | undefined => {
  const config = JSON.parse(sessionStorage.getItem('module-config') || '{}');

  const modules = config?.modules.find((m: any) => m.key == mainKey);
  const subModule = modules.subModules?.find((s: any) => s.key === subKey);

  return `${subModule.url}/api`;
};
