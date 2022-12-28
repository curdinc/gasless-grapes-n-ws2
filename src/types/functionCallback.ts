export type VoidReturnType = void | Promise<void>;
export type ErrorCallbackType = (args: { error: Error }) => VoidReturnType;
