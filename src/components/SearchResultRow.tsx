import { memo } from 'react';

import type { RawgGame } from '@/src/api/rawg/types';

import { GameResultCard } from './GameResultCard';

type Props = {
  game: RawgGame;
  inLibrary: boolean;
  busy: boolean;
  actionLabel?: string;
  onSave: (game: RawgGame) => void;
  onRemove: (rawgId: number) => void;
  onOpenDetails: (game: RawgGame) => void;
};

function SearchResultRowComponent({
  game,
  inLibrary,
  busy,
  actionLabel,
  onSave,
  onRemove,
  onOpenDetails,
}: Props) {
  return (
    <GameResultCard
      game={game}
      inLibrary={inLibrary}
      onAdd={!inLibrary ? () => onSave(game) : undefined}
      onRemove={inLibrary ? () => onRemove(game.id) : undefined}
      onPress={() => onOpenDetails(game)}
      actionDisabled={busy}
      actionLabel={actionLabel}
    />
  );
}

function propsAreEqual(prev: Props, next: Props): boolean {
  return (
    prev.game.id === next.game.id &&
    prev.inLibrary === next.inLibrary &&
    prev.busy === next.busy &&
    prev.actionLabel === next.actionLabel
  );
}

export const SearchResultRow = memo(SearchResultRowComponent, propsAreEqual);