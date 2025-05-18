/**
 * MIDI-GPT Integration Utilities
 *
 * This file integrates with Mistral 7B model for MIDI generation and processing.
 */

export interface ExerciseParameters {
  instrument: string;
  level: string;
  key: string;
  meterNumerator: string;
  meterDenominator: string;
  focusType: string;
  focusValue: string;
  bars: string;
}

export interface GeneratedExercise {
  exerciseId: string;
  midiData: string;
  musicXML: string;
  metadata: {
    title: string;
    instrument: string;
    key: string;
    timeSignature: string;
    difficulty: string;
    focus: string;
    bars: number;
    generatedAt: Date;
  };
  suggestedImprovements?: string[];
}

// Store the API token if provided by the user
let userHuggingFaceToken: string | null = null;
// Track token validation state
let tokenValidated: boolean = false;

/**
 * Set the Hugging Face API token for Mistral 7B model access
 */
export function setHuggingFaceToken(token: string) {
  userHuggingFaceToken = token;
  tokenValidated = false; // Reset validation state when token changes

  // Store in localStorage for persistence across page reloads
  if (typeof window !== 'undefined') {
    localStorage.setItem('hf_api_token', token);
  }
  return { success: true };
}

/**
 * Get the stored Hugging Face API token
 */
export function getHuggingFaceToken(): string | null {
  // Try to get from memory first
  if (userHuggingFaceToken) {
    return userHuggingFaceToken;
  }

  // Try to get from localStorage if in browser environment
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('hf_api_token');
    if (storedToken) {
      userHuggingFaceToken = storedToken;
      return storedToken;
    }
  }

  return null;
}

/**
 * Validate the user's Hugging Face API token by making a test request
 * @returns Promise that resolves to true if token is valid
 */
export async function validateHuggingFaceToken(token: string): Promise<{valid: boolean, message: string}> {
  if (!token) {
    return { valid: false, message: "No API token provided" };
  }

  try {
    // Make a minimal test request to Hugging Face API
    const response = await fetch('/api/ai/mistral-chat/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiToken: token }),
    });

    const data = await response.json();

    if (response.ok && data.valid) {
      tokenValidated = true;
      return { valid: true, message: "Hugging Face connection established successfully!" };
    } else {
      return { valid: false, message: data.message || "Invalid Hugging Face API token" };
    }
  } catch (error) {
    console.error('Error validating Hugging Face token:', error);
    return { valid: false, message: "Error connecting to Hugging Face API" };
  }
}

/**
 * Check if the token has been validated
 */
export function isTokenValidated(): boolean {
  return tokenValidated;
}

/**
 * Mark the token as validated after a successful operation
 */
export function markTokenValidated(isValid: boolean = true): void {
  tokenValidated = isValid;
}

/**
 * Function to generate a music exercise using Mistral 7B model
 */
export async function generateExercise(params: ExerciseParameters): Promise<GeneratedExercise> {
  try {
    // Prepare prompt based on parameters
    const prompt = `Generate a ${params.level} level ${params.focusType} exercise for ${params.instrument} in ${params.key} with time signature ${params.meterNumerator}/${params.meterDenominator} focusing on ${params.focusValue} that is ${params.bars} bars long.`;

    // Get user's Hugging Face API token if available
    const apiToken = getHuggingFaceToken();

    // Call the Mistral MIDI generation API
    const response = await fetch('/api/ai/mistral-midi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        parameters: params,
        apiToken
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error generating exercise:', errorData);
      throw new Error(errorData.error || 'Failed to generate exercise');
    }

    const data = await response.json();

    return {
      exerciseId: `ex-${Date.now()}`,
      midiData: data.midiSequence,
      musicXML: data.musicXML,
      metadata: {
        title: `${params.focusType} Exercise in ${params.key}`,
        instrument: params.instrument,
        key: params.key,
        timeSignature: `${params.meterNumerator}/${params.meterDenominator}`,
        difficulty: params.level,
        focus: `${params.focusType} - ${params.focusValue}`,
        bars: parseInt(params.bars),
        generatedAt: new Date()
      },
      suggestedImprovements: data.suggestedImprovements || []
    };
  } catch (error) {
    console.error('Error in exercise generation:', error);

    // Fallback to mock implementation if the API call fails
    console.warn('Using fallback mock implementation');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, this would contain actual MIDI data
    const mockMidiData = "MOCK_MIDI_DATA";

    // In a real implementation, this would contain actual MusicXML data for rendering
    const mockMusicXML = generateMockMusicXML(params);

    return {
      exerciseId: `ex-${Date.now()}`,
      midiData: mockMidiData,
      musicXML: mockMusicXML,
      metadata: {
        title: `${params.focusType} Exercise in ${params.key}`,
        instrument: params.instrument,
        key: params.key,
        timeSignature: `${params.meterNumerator}/${params.meterDenominator}`,
        difficulty: params.level,
        focus: `${params.focusType} - ${params.focusValue}`,
        bars: parseInt(params.bars),
        generatedAt: new Date()
      },
      suggestedImprovements: [
        "Practice with a metronome to maintain steady tempo",
        `Focus on accurate finger positions for ${params.focusType}`,
        "Practice at a slower tempo first, then gradually increase speed"
      ]
    };
  }
}

/**
 * Generate a mock MusicXML for fallback purposes
 */
function generateMockMusicXML(params: ExerciseParameters): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work>
    <work-title>${params.focusType} Exercise in ${params.key}</work-title>
  </work>
  <identification>
    <creator type="composer">HarmonyHub AI (Mistral 7B)</creator>
    <encoding>
      <software>HarmonyHub</software>
      <encoding-date>${new Date().toISOString().slice(0, 10)}</encoding-date>
    </encoding>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>${params.instrument}</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>${params.meterNumerator}</beats>
          <beat-type>${params.meterDenominator}</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>E</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>G</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>C</step>
          <octave>5</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
    </measure>
  </part>
</score-partwise>`;
}

/**
 * Convert MIDI data to MusicXML
 */
export function convertMidiToMusicXML(midiData: string): string {
  // In a real implementation, this would perform actual conversion
  // For now, return a simple MusicXML template
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Piano</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <!-- More notes would be here in a real implementation -->
    </measure>
  </part>
</score-partwise>`;
}

/**
 * Record MIDI input from user
 *
 * @param duration Duration in milliseconds to record
 * @returns Promise that resolves with recorded MIDI data
 */
export async function recordUserMidi(duration: number = 10000): Promise<string> {
  return new Promise((resolve, reject) => {
    // In a real implementation, this would connect to a MIDI input device
    // and record MIDI data

    // Mock recording process
    console.log(`Recording MIDI for ${duration}ms...`);

    // Simulate recording delay
    setTimeout(() => {
      // Mock recorded MIDI data
      const mockMidiData = "RECORDED_MIDI_DATA_" + Date.now();
      resolve(mockMidiData);
    }, duration);
  });
}

/**
 * Analyze recorded MIDI data and provide suggestions
 *
 * @param midiData MIDI data to analyze
 * @param targetExercise Optional exercise to compare against
 * @returns Analysis results with suggestions
 */
export async function analyzeMidiPerformance(midiData: string, targetExercise?: GeneratedExercise) {
  try {
    // In a real implementation, this would send the MIDI data to Mistral for analysis
    // For now, return mock analysis results

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      accuracy: Math.random() * 100,
      tempo: 60 + Math.random() * 60,
      rhythmAccuracy: Math.random() * 100,
      pitchAccuracy: Math.random() * 100,
      expressiveness: Math.random() * 100,
      suggestions: [
        "Work on maintaining a consistent tempo throughout the piece",
        "Pay attention to note durations, especially in measure 3",
        "Practice the transitions between measures 2 and 3 more carefully",
        "Consider using a metronome to improve your rhythm accuracy",
        "Focus on hand position to improve your playing technique"
      ]
    };
  } catch (error) {
    console.error('Error analyzing MIDI performance:', error);
    throw new Error('Failed to analyze MIDI performance');
  }
}

/**
 * Convert MusicXML to VexFlow format
 */
export function convertMusicXMLToVexFlow(musicXML: string): any {
  // In a real implementation, this would parse MusicXML and return VexFlow data
  // For now, return a simple mock structure
  return {
    clef: "treble",
    timeSignature: "4/4",
    keySignature: "C",
    notes: [
      { clef: "treble", keys: ["c/4"], duration: "q" },
      { clef: "treble", keys: ["d/4"], duration: "q" },
      { clef: "treble", keys: ["e/4"], duration: "q" },
      { clef: "treble", keys: ["f/4"], duration: "q" }
    ]
  };
}
