import type { ComponentProps } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof Ionicons>['name'];
type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/**
 * Gibt das passende Icon für eine Plattform zurück
 */
export function getPlatformIcon(platform: string): {
  family: 'ion' | 'material';
  name: IconName | MaterialIconName;
} {
  const name = platform.toLowerCase();

  if (name === 'playstation') {
    return {
      family: 'ion',
      name: 'logo-playstation',
    };
  }

  if (name === 'xbox') {
    return {
      family: 'ion',
      name: 'logo-xbox',
    };
  }

  if (name === 'switch') {
    return {
      family: 'material',
      name: 'nintendo-switch',
    };
  }

  if (name === 'wii') {
    return {
      family: 'material',
      name: 'nintendo-wii',
    };
  }

  if (name === 'gameboy') {
    return {
      family: 'material',
      name: 'nintendo-game-boy',
    };
  }

  if (name === 'nintendo') {
    return {
      family: 'ion',
      name: 'game-controller-outline',
    };
  }

  if (name === 'pc') {
    return {
      family: 'ion',
      name: 'logo-windows',
    };
  }

  if (name === 'mac') {
    return {
      family: 'ion',
      name: 'logo-apple',
    };
  }

  if (name === 'linux') {
    return {
      family: 'ion',
      name: 'logo-tux',
    };
  }

  if (name === 'ios') {
    return {
      family: 'ion',
      name: 'phone-portrait-outline',
    };
  }

  if (name === 'android') {
    return {
      family: 'ion',
      name: 'logo-android',
    };
  }

  if (name === 'web') {
    return {
      family: 'ion',
      name: 'globe-outline',
    };
  }

  if (name === 'retro' || name === 'other') {
    return {
      family: 'material',
      name: 'controller-classic',
    };
  }

  return {
    family: 'ion',
    name: 'help-circle-outline',
  };
}

/**
 * Vereinheitlicht Plattformen (damit keine Duplikate entstehen)
 */
export function getPlatformKey(platform: string): string {
  const name = platform.toLowerCase();

  if (name.includes('playstation') || name.includes('ps vita') || name.includes('psp')) {
    return 'playstation';
  }

  if (name.includes('xbox')) {
    return 'xbox';
  }

  if (name.includes('switch')) {
    return 'switch';
  }

  if (name.includes('wii')) {
    return 'wii';
  }

  if (
    name.includes('game boy') ||
    name.includes('game boy color') ||
    name.includes('game boy advance') ||
    name.includes('gba') ||
    name.includes('ds') ||
    name.includes('3ds')
  ) {
    return 'gameboy';
  }

  if (
    name.includes('nintendo') ||
    name.includes('gamecube') ||
    name.includes('snes') ||
    name.includes('nes')
  ) {
    return 'nintendo';
  }

  if (name.includes('pc') || name.includes('windows')) {
    return 'pc';
  }

  if (name.includes('mac') || name.includes('macos')) {
    return 'mac';
  }

  if (name.includes('linux')) {
    return 'linux';
  }

  if (name.includes('ios') || name.includes('iphone') || name.includes('ipad')) {
    return 'ios';
  }

  if (name.includes('android')) {
    return 'android';
  }

  if (name.includes('web')) {
    return 'web';
  }

  if (
    name.includes('sega') ||
    name.includes('genesis') ||
    name.includes('saturn') ||
    name.includes('dreamcast') ||
    name.includes('atari') ||
    name.includes('jaguar') ||
    name.includes('neo geo') ||
    name.includes('commodore') ||
    name.includes('amiga') ||
    name.includes('3do') ||
    name.includes('game gear') ||
    name.includes('apple ii')
  ) {
    return 'retro';
  }

  return 'other';
}