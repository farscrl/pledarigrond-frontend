export abstract class ModalComponent<TData = void, TResult = void> {
  result!: TResult;

  /** @internal wired by ModalService right after creation. Do not set from feature code. */
  _closeHandler?: () => void;

  async close(): Promise<void> {
    this._closeHandler?.();
  }
}
