/** Tuning for game result FlatLists (Search / Library). */
export const GAME_LIST_FLATLIST_PROPS = {
  initialNumToRender: 8,
  maxToRenderPerBatch: 6,
  updateCellsBatchingPeriod: 50,
  windowSize: 7,
  removeClippedSubviews: true,
} as const;
