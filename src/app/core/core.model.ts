export interface ILoadingState {
  loaded: boolean;
  loading: boolean;
}

export interface ILoadingDetailState<TDetail, TId> extends ILoadingState {
  id: TId,
  item: TDetail | undefined;
}