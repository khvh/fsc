export let container;

export const useContainer = <T = any>(c?: T) => {
  container = container ?? c;

  return container as T;
};
