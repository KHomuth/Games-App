import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof Ionicons>['name'];

/**
 * Gibt das passende Icon für eine Plattform zurück
 */
export function getPlatformIcon(platform: string): IconName {
  const name = platform.toLowerCase();

  if (name.includes('playstation') || name.includes('ps vita') || name.includes('psp')) {
    return 'logo-playstation';
  }

  if (name.includes('xbox')) {
    return 'logo-xbox';
  }

  if (
    name.includes('nintendo') ||
    name.includes('switch') ||
    name.includes('wii') ||
    name.includes('gamecube') ||
    name.includes('game boy') ||
    name.includes('snes') ||
    name.includes('nes') ||
    name.includes('ds')
  ) {
    return 'game-controller-outline';
  }

  if (name.includes('pc') || name.includes('windows')) {
    return 'logo-windows';
  }

  if (name.includes('mac') || name.includes('macos')) {
    return 'logo-apple';
  }

  if (name.includes('linux')) {
    return 'logo-tux';
  }

  if (name.includes('ios') || name.includes('iphone') || name.includes('ipad')) {
    return 'phone-portrait-outline';
  }

  if (name.includes('android')) {
    return 'logo-android';
  }

  if (name.includes('web')) {
    return 'globe-outline';
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
    name.includes('3do')
  ) {
    return 'hardware-chip-outline';
  }

  if (name === 'retro' || name === 'other') {
    return 'hardware-chip-outline';
  }

  return 'help-circle-outline';
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

  if (
    name.includes('nintendo') ||
    name.includes('switch') ||
    name.includes('wii') ||
    name.includes('gamecube') ||
    name.includes('game boy') ||
    name.includes('snes') ||
    name.includes('nes') ||
    name.includes('ds')
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
    name.includes('3do')
  ) {
    return 'retro';
  }

  return 'other';
}