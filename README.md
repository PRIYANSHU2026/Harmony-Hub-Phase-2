# HarmonyHub - AI-Powered Music Education Platform

HarmonyHub is an AI-powered personalized music education platform integrating MIDI-GPT for dynamic exercise generation. The system leverages various AI models, including Shuka-1 for text generation and Dia-1.6B for text-to-speech capabilities.

## Overview

HarmonyHub is designed to enhance music education by leveraging generative AI to create personalized music exercises. The platform integrates MIDI-GPT, a controllable multi-track music machine, to generate pedagogically sound exercises for various instruments and skill levels. In addition, it incorporates advanced text and speech AI models to provide a holistic, interactive learning experience.

## Features

- **AI-Generated Music Exercises**: Generate customized music exercises based on instrument, difficulty, key, and music theory concepts.
- **Interactive Sheet Music**: View exercises as professionally rendered sheet music with proper MusicXML parsing.
- **MIDI Export**: Download exercises as MIDI files for playback in any music software.
- **XML Generation**: Export exercise data in standardized XML format with comprehensive schema.
- **AI Text Generation**: Generate text content using the Shuka-1 model.
- **Text-to-Speech**: Convert text to speech using the Dia-1.6B model.
- **Streamlit Integration**: Bridge between Next.js frontend and Python-based AI generation.

## Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **API**: tRPC for type-safe API communication
- **AI Models**:
  - Shuka-1 for text generation
  - Dia-1.6B for text-to-speech
  - MIDI-GPT for music generation (via Python bridge)
- **Music Rendering**: VexFlow for sheet music visualization
- **Python Integration**: Streamlit for music generation UI and bridge script

## Architecture

The application follows a modular architecture:

1. **Next.js Frontend**: Provides the user interface and handles client-side logic.
2. **API Layer**: Manages communication between the frontend and backend services.
3. **Python Bridge**: Connects the JavaScript frontend with Python-based AI models.
4. **AI Models**: External services for text generation, speech synthesis, and music generation.
5. **Data Storage**: XML and MIDI formats for storing and exchanging music data.

## Integration Details

### MusicXML Parser

The system includes a comprehensive MusicXML parser that renders sheet music using VexFlow. It can handle:

- Various time signatures
- Key signatures with sharps and flats
- Note durations and accidentals
- Multi-measure scores

### MIDI Export

The MIDI export functionality converts MusicXML data to standard MIDI format, enabling:

- Playback in any MIDI-compatible software
- Note pitch, duration, and velocity information
- Proper time signature and tempo encoding

### Streamlit Integration

The system integrates with a Python-based Streamlit application through a custom bridge script:

1. Frontend sends exercise parameters to an API endpoint.
2. API calls the Python bridge script with the parameters.
3. Python script generates MusicXML and MIDI data.
4. Results are returned to the frontend for display and download.

### AI Model Integration

The Shuka-1 and Dia-1.6B models are integrated via API endpoints:

- `/api/ai/text-generation`: Generates text using Shuka-1.
- `/api/ai/text-to-speech`: Converts text to speech using Dia-1.6B.

## Setup and Development

### Prerequisites

- Node.js 18+ and Bun
- Python 3.8+ (for Streamlit integration)
- Recommended: Visual Studio Code with TypeScript and Python extensions

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/PRIYANSHU2026/Harmony-Hub-Phase-2.git
   cd Harmony-Hub-Phase-2
   ```

2. Install JavaScript dependencies
   ```bash
   bun install
   ```

3. Install Python dependencies (for Streamlit integration)
   ```bash
   pip install streamlit music21 midiutil
   ```

4. Set up environment variables
   ```bash
   cp .env.example .env
   ```

5. Start the development server
   ```bash
   bun run dev
   ```

### Running Streamlit App (Optional)

The Streamlit app can be run separately for standalone use:

```bash
streamlit run streamlit_app.py
```

## Development Roadmap

### Phase 1: LLM-Driven Exercise Generation with VexFlow Rendering (Current)

- MIDI-GPT integration fine-tuned on graded exercises for various instruments.
- Web-based interface for specifying exercise parameters.
- Rendering generated exercises as interactive sheet music.

### Phase 2: Student Performance Assessment

- Integration with audio input for performance assessment.
- Automated feedback generation.
- Progress tracking and analytics.

### Phase 3: Adaptive Learning and Collaboration

- Dynamic adjustment of exercise difficulty based on student performance.
- Collaborative features for teacher-student interaction.
- Integration with popular learning management systems.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [MIDI-GPT](https://github.com/Metacreation-Lab/MIDI-GPT) by Metacreation Lab
- [VexFlow](https://github.com/0xfe/vexflow) for music notation rendering
- [OpenSheetMusicDisplay](https://github.com/opensheetmusicdisplay/opensheetmusicdisplay) for MusicXML rendering
- [Streamlit](https://streamlit.io/) for the Python GUI framework
