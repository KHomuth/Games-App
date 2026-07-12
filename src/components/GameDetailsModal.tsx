import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { RawgGame, RawgGameDetails } from '@/src/api/rawg/types';
import { useListScreenStyles } from '@/src/components/listScreenStyles';
import type { LibraryGameRow } from '@/src/db/libraryGames';
import { formatReleased } from '@/src/formatting/formatReleased';
import { useTheme } from '@/src/theme/ThemeContext';

export type GameDetailsContent = {
  name: string;
  backgroundImage: string | null;
  released: string | null;
  tba?: boolean;
  metacritic: number | null;
  esrbRating: string | null;
  genres: string[];
  platforms: string[];
  developers: string[];
  publishers: string[];
  website: string | null;
  description: string | null;
};

export function rawgToDetailsContent(
  game: RawgGame,
  details?: RawgGameDetails | null
): GameDetailsContent {
  const genres =
    details?.genres
      ?.map((g) => g.name)
      .filter((name): name is string => typeof name === 'string') ??
    game.genres
      ?.map((g) => g.name)
      .filter((name): name is string => typeof name === 'string') ??
    [];

  const platforms =
    details?.platforms
      ?.map((p) => p.platform?.name)
      .filter((name): name is string => typeof name === 'string') ??
    game.platforms
      ?.map((p) => p.platform?.name)
      .filter((name): name is string => typeof name === 'string') ??
    [];

  return {
    name: game.name,
    backgroundImage: game.background_image,
    released: details?.released ?? game.released,
    tba: game.tba,
    metacritic: details?.metacritic ?? game.metacritic,
    esrbRating: details?.esrb_rating?.name ?? null,
    genres,
    platforms,
    developers:
      details?.developers
        ?.map((d) => d.name)
        .filter((name): name is string => typeof name === 'string') ?? [],
    publishers:
      details?.publishers
        ?.map((p) => p.name)
        .filter((name): name is string => typeof name === 'string') ?? [],
    website: details?.website ?? null,
    description: details?.description_raw ?? null,
  };
}

export function libraryRowToDetailsContent(item: LibraryGameRow): GameDetailsContent {
  return {
    name: item.name,
    backgroundImage: item.backgroundImage,
    released: item.released,
    metacritic: item.metacritic,
    esrbRating: item.esrbRating,
    genres: item.genres,
    platforms: item.platforms,
    developers: item.developers,
    publishers: item.publishers,
    website: item.website,
    description: item.description,
  };
}

type Props = {
  visible: boolean;
  game: GameDetailsContent | null;
  loading?: boolean;
  onClose: () => void;
};

export function GameDetailsModal({ visible, game, loading = false, onClose }: Props) {
  const { colors } = useTheme();
  const styles = useListScreenStyles();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.modalCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>{game?.name}</Text>

            {game?.backgroundImage ? (
              <Image source={{ uri: game.backgroundImage }} style={styles.modalImage} />
            ) : null}

            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : game ? (
              <>
                <Text style={styles.meta}>
                  Released: {formatReleased(game.released, game.tba)}
                </Text>

                <Text style={styles.meta}>
                  Metacritic: {game.metacritic != null ? String(game.metacritic) : '—'}
                </Text>

                <Text style={styles.meta}>ESRB: {game.esrbRating ?? '—'}</Text>

                <Text style={styles.modalSectionTitle}>Game Information</Text>

                <Text style={styles.meta}>
                  Genres: {game.genres.length ? game.genres.join(', ') : '—'}
                </Text>

                <Text style={styles.meta}>
                  Platforms: {game.platforms.length ? game.platforms.join(', ') : '—'}
                </Text>

                <Text style={styles.modalSectionTitle}>Studio</Text>

                <Text style={styles.meta}>
                  Developers: {game.developers.length ? game.developers.join(', ') : '—'}
                </Text>

                <Text style={styles.meta}>
                  Publishers: {game.publishers.length ? game.publishers.join(', ') : '—'}
                </Text>

                <Text style={styles.meta}>Website: {game.website || '—'}</Text>

                <Text style={styles.modalSectionTitle}>Description</Text>

                <Text style={styles.modalDescription}>
                  {game.description || 'No description available.'}
                </Text>
              </>
            ) : null}

            <Pressable onPress={onClose} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}