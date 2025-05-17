# Harmony Hub - Mistral 7B Integration

This document describes the integration of Mistral 7B AI model into Harmony Hub for music exercise generation and analysis.

## Features Added

1. **Mistral 7B Integration**
   - Replaced previous AI endpoints with Mistral 7B for more advanced music generation
   - Enhanced MIDI generation capabilities with detailed musical understanding
   - Added suggestion system for practice improvement

2. **MIDI Recording & Analysis**
   - Added ability to record MIDI input from users
   - Implemented performance analysis with detailed metrics
   - Created reporting system with personalized suggestions

3. **Hugging Face API Integration**
   - Added user-configurable API token system
   - Secured API calls with proper token validation
   - Provided fallback mechanisms when token is unavailable

4. **Instrument MIDI Files**
   - Added sample MIDI files for various instruments
   - Created utility functions for accessing instrument-specific MIDI files
   - Implemented proper MIDI program mapping for different instruments

## Usage

### Setting up your Hugging Face API Token

1. Sign up for a Hugging Face account at [huggingface.co](https://huggingface.co)
2. Generate an API token in your account settings
3. Enter your token in the Harmony Hub AI Tools page
4. The token will be securely stored in your browser's local storage

### Generating Exercises with Mistral 7B

1. Navigate to the Exercise Generator page
2. Select your instrument, difficulty level, and musical parameters
3. Click "Generate Exercise" to create a new exercise using Mistral 7B
4. View the generated sheet music, download as MIDI or XML, or analyze the exercise

### Recording and Analyzing MIDI Performance

1. Go to the AI Tools page
2. Set the recording duration
3. Click "Start Recording" to capture your MIDI performance
4. After recording, click "Analyze" to get AI-powered feedback
5. Review performance metrics and suggested improvements

## Technical Implementation

The Mistral 7B integration uses the Hugging Face Inference API to access the model. The application makes calls to the Mistral 7B model with properly formatted prompts that include musical parameters and user requirements.

In production, the system would send the following types of prompts to the model:

```
Generate a beginner level intervals exercise for trumpet in C with time signature 4/4 focusing on thirds that is 16 bars long.
```

The model responds with musical content that is converted to both MIDI data and MusicXML for rendering. The system also extracts suggested improvements from the model's response to help users practice effectively.

## File Structure

- `/src/app/api/ai/mistral-midi/route.ts` - API endpoint for Mistral 7B integration
- `/src/utils/midi-gpt-integration.ts` - Utility functions for MIDI generation and analysis
- `/src/utils/instrument-midi.ts` - Utility functions for instrument-specific MIDI handling
- `/public/midi/` - Directory containing sample MIDI files for different instruments

## Dependencies

- `@huggingface/inference` - For communicating with the Hugging Face API
- `transformers` - For local model processing capabilities
- Existing music notation and MIDI processing libraries

## Setting up for Development

1. Clone the repository
2. Run `bun install` to install dependencies
3. Set up your Hugging Face API token in `.env` (for development) or in the AI Tools page (for production)
4. Run `bun run dev` to start the development server
