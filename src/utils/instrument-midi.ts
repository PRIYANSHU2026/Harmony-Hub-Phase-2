/**
 * Instrument MIDI Utilities
 *
 * This file contains utilities for working with MIDI files for different instruments
 */

// Map of instrument names to their MIDI program numbers
export const INSTRUMENT_PROGRAM_MAP: Record<string, number> = {
  piano: 0,
  acoustic_piano: 0,
  bright_piano: 1,
  electric_grand: 2,
  honky_tonk_piano: 3,
  electric_piano: 4,
  electric_piano_2: 5,
  harpsichord: 6,
  clavinet: 7,

  // Chromatic Percussion
  celesta: 8,
  glockenspiel: 9,
  music_box: 10,
  vibraphone: 11,
  marimba: 12,
  xylophone: 13,
  tubular_bells: 14,
  dulcimer: 15,

  // Organ
  hammond_organ: 16,
  percussive_organ: 17,
  rock_organ: 18,
  church_organ: 19,
  reed_organ: 20,
  accordion: 21,
  harmonica: 22,
  tango_accordion: 23,

  // Guitar
  acoustic_guitar_nylon: 24,
  acoustic_guitar_steel: 25,
  electric_guitar_jazz: 26,
  electric_guitar_clean: 27,
  electric_guitar_muted: 28,
  overdriven_guitar: 29,
  distortion_guitar: 30,
  guitar_harmonics: 31,

  // Bass
  acoustic_bass: 32,
  electric_bass_finger: 33,
  electric_bass_pick: 34,
  fretless_bass: 35,
  slap_bass_1: 36,
  slap_bass_2: 37,
  synth_bass_1: 38,
  synth_bass_2: 39,

  // Strings
  violin: 40,
  viola: 41,
  cello: 42,
  contrabass: 43,
  tremolo_strings: 44,
  pizzicato_strings: 45,
  orchestral_harp: 46,
  timpani: 47,

  // Ensemble
  string_ensemble_1: 48,
  string_ensemble_2: 49,
  synth_strings_1: 50,
  synth_strings_2: 51,
  choir_aahs: 52,
  voice_oohs: 53,
  synth_choir: 54,
  orchestra_hit: 55,

  // Brass
  trumpet: 56,
  trombone: 57,
  tuba: 58,
  muted_trumpet: 59,
  french_horn: 60,
  brass_section: 61,
  synth_brass_1: 62,
  synth_brass_2: 63,

  // Reed
  soprano_sax: 64,
  alto_sax: 65,
  tenor_sax: 66,
  baritone_sax: 67,
  oboe: 68,
  english_horn: 69,
  bassoon: 70,
  clarinet: 71,

  // Pipe
  piccolo: 72,
  flute: 73,
  recorder: 74,
  pan_flute: 75,
  blown_bottle: 76,
  shakuhachi: 77,
  whistle: 78,
  ocarina: 79
};

// Common instrument choices in the app
export const COMMON_INSTRUMENTS = [
  "piano",
  "trumpet",
  "violin",
  "clarinet",
  "flute",
  "acoustic_guitar_nylon",
  "alto_sax"
];

// Sample MIDI paths for common instruments
export const INSTRUMENT_SAMPLE_MIDI: Record<string, string[]> = {
  piano: [
    '/midi/piano/piano-scale-c-major.mid',
    '/midi/piano/piano-scale-g-major.mid',
    '/midi/piano/piano-scale-f-major.mid',
    '/midi/piano/piano-scale-a-minor.mid',
  ],
  trumpet: [
    '/midi/trumpet/trumpet-scale-c-major.mid',
    '/midi/trumpet/trumpet-scale-g-major.mid',
    '/midi/trumpet/trumpet-scale-f-major.mid',
  ],
  violin: [
    '/midi/violin/violin-scale-c-major.mid',
    '/midi/violin/violin-scale-g-major.mid',
    '/midi/violin/violin-scale-a-minor.mid',
  ],
  clarinet: [
    '/midi/clarinet/clarinet-scale-c-major.mid',
    '/midi/clarinet/clarinet-scale-f-major.mid',
  ],
  flute: [
    '/midi/flute/flute-scale-c-major.mid',
    '/midi/flute/flute-scale-g-major.mid',
  ],
  acoustic_guitar_nylon: [
    '/midi/guitar/guitar-scale-c-major.mid',
    '/midi/guitar/guitar-scale-g-major.mid',
    '/midi/guitar/guitar-scale-a-minor.mid',
  ],
  alto_sax: [
    '/midi/sax/alto-sax-scale-c-major.mid',
    '/midi/sax/alto-sax-scale-g-major.mid',
  ]
};

/**
 * Get a friendly display name for an instrument
 */
export function getInstrumentDisplayName(instrumentKey: string): string {
  const displayNames: Record<string, string> = {
    piano: "Piano",
    acoustic_piano: "Acoustic Piano",
    bright_piano: "Bright Piano",
    trumpet: "Trumpet",
    violin: "Violin",
    clarinet: "Clarinet",
    flute: "Flute",
    acoustic_guitar_nylon: "Acoustic Guitar",
    alto_sax: "Alto Saxophone",
    // Add more mappings as needed
  };

  return displayNames[instrumentKey] || instrumentKey.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Get a sample MIDI file for an instrument
 * @param instrument The instrument key
 * @param index Optional index to get a specific sample
 * @returns Path to the MIDI file or a default one if not found
 */
export function getInstrumentSampleMidi(instrument: string, index?: number): string {
  const samples = INSTRUMENT_SAMPLE_MIDI[instrument];

  if (!samples || samples.length === 0) {
    // Return a default piano sample if no samples exist for this instrument
    return '/midi/piano/piano-scale-c-major.mid';
  }

  if (index !== undefined && index >= 0 && index < samples.length) {
    return samples[index];
  }

  // Return the first sample by default
  return samples[0];
}
