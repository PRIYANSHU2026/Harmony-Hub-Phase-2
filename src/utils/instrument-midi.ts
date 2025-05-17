/**
 * Instrument MIDI Utilities
 *
 * This file contains utilities for working with MIDI files for trumpet instrument
 */

// Only keeping trumpet program number
export const INSTRUMENT_PROGRAM_MAP: Record<string, number> = {
  trumpet: 56,
  muted_trumpet: 59,
}

// Common instrument choices - only trumpet now
export const COMMON_INSTRUMENTS = [
  "trumpet",
  "muted_trumpet",
];

// Sample MIDI paths for trumpet
export const INSTRUMENT_SAMPLE_MIDI: Record<string, string[]> = {
  trumpet: [
    '/midi/trumpet/trumpet-scale-c-major.mid',
    '/midi/trumpet/trumpet-scale-g-major.mid',
    '/midi/trumpet/trumpet-scale-f-major.mid',
  ],
  muted_trumpet: [
    '/midi/trumpet/trumpet-scale-c-major.mid',
    '/midi/trumpet/trumpet-scale-g-major.mid',
    '/midi/trumpet/trumpet-scale-f-major.mid',
  ],
}

// Trumpet sound files mapping by key
export const TRUMPET_SOUND_FILES: Record<string, string[]> = {
  A: [
    '/sounds/key/A/Lng_Swll_Flgl_Trmpt_11_A_265.wav',
    '/sounds/key/A/Lng_Swll_Trmpt_N_Attck_12_A_265.wav',
    '/sounds/key/A/Mdm_Swll_Flgl_Trmpt_12_A_265.wav',
    '/sounds/key/A/Shrt_Swll_Flgl_Trmpt_12_A_265.wav',
  ],
  B: [
    '/sounds/key/B/Lng_Swll_Flgl_Trmpt_01_B_265.wav',
    '/sounds/key/B/Lng_Swll_Trmpt_N_Attck_02_B_265.wav',
    '/sounds/key/B/Mdm_Swll_Flgl_Trmpt_02_B_265.wav',
    '/sounds/key/B/Shrt_Swll_Flgl_Trmpt_02_B_265.wav',
  ],
  C: [
    '/sounds/key/C/125_C_Loop_Trumpet_265_SP04.wav',
    '/sounds/key/C/Lng_Swll_Flgl_Trmpt_02_C_265.wav',
    '/sounds/key/C/Lng_Swll_Trmpt_N_Attck_03_C_265.wav',
    '/sounds/key/C/Mdm_Swll_Flgl_Trmpt_03_C_265.wav',
    '/sounds/key/C/Shrt_Swll_Flgl_Trmpt_03_C_265.wav',
  ],
  D: [
    '/sounds/key/D/Lng_Swll_Flgl_Trmpt_04_D_265.wav',
    '/sounds/key/D/Lng_Swll_Trmpt_N_Attck_05_D_265.wav',
    '/sounds/key/D/Mdm_Swll_Flgl_Trmpt_05_D_265.wav',
    '/sounds/key/D/Shrt_Swll_Flgl_Trmpt_05_D_265.wav',
  ],
  E: [
    '/sounds/key/E/Lng_Swll_Flgl_Trmpt_06_E_265.wav',
    '/sounds/key/E/Lng_Swll_Trmpt_N_Attck_07_E_265.wav',
    '/sounds/key/E/Mdm_Swll_Flgl_Trmpt_07_E_265.wav',
    '/sounds/key/E/Shrt_Swll_Flgl_Trmpt_07_E_265.wav',
  ],
  F: [
    '/sounds/key/F/125_F_Loop_Trumpet_265_SP01.wav',
    '/sounds/key/F/Lng_Swll_Flgl_Trmpt_07_F_265.wav',
    '/sounds/key/F/Lng_Swll_Trmpt_N_Attck_08_F_265.wav',
    '/sounds/key/F/Mdm_Swll_Flgl_Trmpt_08_F_265.wav',
    '/sounds/key/F/Shrt_Swll_Flgl_Trmpt_08_F_265.wav',
  ],
  G: [
    '/sounds/key/G/Lng_Swll_Flgl_Trmpt_09_G_265.wav',
    '/sounds/key/G/Lng_Swll_Trmpt_N_Attck_10_G_265.wav',
    '/sounds/key/G/Mdm_Swll_Flgl_Trmpt_10_G_265.wav',
    '/sounds/key/G/Shrt_Swll_Flgl_Trmpt_10_G_265.wav',
  ],
}

/**
 * Get a friendly display name for an instrument
 */
export function getInstrumentDisplayName(instrumentKey: string): string {
  const displayNames: Record<string, string> = {
    trumpet: "Trumpet",
    muted_trumpet: "Muted Trumpet",
  };

  return displayNames[instrumentKey] || instrumentKey.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Get a sample MIDI file for an instrument
 * @param instrument The instrument key
 * @param index Optional index to get a specific sample
 * @returns Path to the MIDI file
 */
export function getInstrumentSampleMidi(instrument: string, index?: number): string {
  const samples = INSTRUMENT_SAMPLE_MIDI[instrument];

  if (!samples || samples.length === 0) {
    // Return a default trumpet sample if no samples exist for this instrument
    return '/midi/trumpet/trumpet-scale-c-major.mid';
  }

  if (index !== undefined && index >= 0 && index < samples.length) {
    return samples[index];
  }

  // Return the first sample by default
  return samples[0];
}

/**
 * Get trumpet sound files for a specific key
 * @param key The musical key (A-G)
 * @param index Optional index to get a specific sample
 * @returns Path to the sound file
 */
export function getTrumpetSoundFile(key: string, index?: number): string {
  // Normalize key to uppercase single letter
  const normalizedKey = key.charAt(0).toUpperCase();

  const sounds = TRUMPET_SOUND_FILES[normalizedKey];

  if (!sounds || sounds.length === 0) {
    // Return a default C trumpet sound if no sounds exist for this key
    return '/sounds/key/C/125_C_Loop_Trumpet_265_SP04.wav';
  }

  if (index !== undefined && index >= 0 && index < sounds.length) {
    return sounds[index];
  }

  // Return a random sound file for the key
  const randomIndex = Math.floor(Math.random() * sounds.length);
  return sounds[randomIndex];
}

/**
 * Get all trumpet sound files for practice
 * @returns Object with all trumpet sounds organized by key
 */
export function getAllTrumpetSounds(): Record<string, string[]> {
  return TRUMPET_SOUND_FILES;
}
