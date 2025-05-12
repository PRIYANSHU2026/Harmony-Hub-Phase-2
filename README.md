# HarmonyHub

AI-powered music education platform integrating MIDI-GPT for dynamic exercise generation

## Overview

HarmonyHub is an educational platform designed to enhance music education by leveraging generative AI to create personalized music exercises. The platform integrates MIDI-GPT, a controllable multi-track music machine, to generate pedagogically sound exercises for various instruments and skill levels.

While music educators strive to provide personalized learning paths, existing educational tools often lack the flexibility to adapt to diverse student needs. HarmonyHub bridges this gap by empowering teachers to design customized exercises and dynamically adjust lessons based on individual progress.

## Features

- **AI-Generated Exercises**: Generate tailored exercises for different instruments, skill levels, and music concepts
- **Interactive Sheet Music**: View exercises as professional-quality sheet music with VexFlow
- **Customizable Parameters**: Control key signatures, time signatures, difficulty levels, and pedagogical focus
- **MIDI Playback**: Listen to generated exercises directly in the browser
- **Exercise Management**: Save, organize, and share exercises with students

## Technical Implementation

HarmonyHub is implemented as:

1. **Web Application**: A Next.js-based web application with:
   - React frontend with TailwindCSS for styling
   - API routes for MIDI-GPT integration
   - VexFlow for sheet music rendering

2. **Streamlit GUI**: A standalone Streamlit application that provides:
   - Simple interface for exercise generation
   - Visualization of generated sheet music
   - MIDI playback and download capabilities

## MIDI-GPT Integration

The core of HarmonyHub is its integration with MIDI-GPT, a generative system developed by the Metacreation Lab, designed for computer-assisted music composition workflows. The system:

- Takes natural language input (e.g., "Generate a 16-bar beginner trumpet exercise in C major focusing on thirds")
- Generates appropriately structured MIDI data
- Outputs structured JSON including MusicXML for rendering

## Installation

### Web Application

```bash
# Clone the repository
git clone https://github.com/your-username/harmonyhub.git
cd harmonyhub

# Install dependencies
bun install

# Start the development server
bun run dev
```

### Streamlit Application

```bash
# Install required dependencies
pip install streamlit music21 midiutil matplotlib miditoolkit

# Run the Streamlit app
cd harmonyhub
streamlit run streamlit_app.py
```

## Development Roadmap

### Phase 1: LLM-Driven Exercise Generation with VexFlow Rendering (Current)

- MIDI-GPT integration fine-tuned on graded exercises for various instruments
- Web-based interface for specifying exercise parameters
- Rendering generated exercises as interactive sheet music

### Phase 2: Student Performance Assessment

- Integration with audio input for performance assessment
- Automated feedback generation
- Progress tracking and analytics

### Phase 3: Adaptive Learning and Collaboration

- Dynamic adjustment of exercise difficulty based on student performance
- Collaborative features for teacher-student interaction
- Integration with popular learning management systems

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [MIDI-GPT](https://github.com/Metacreation-Lab/MIDI-GPT) by Metacreation Lab
- [VexFlow](https://github.com/0xfe/vexflow) for music notation rendering
- [OpenSheetMusicDisplay](https://github.com/opensheetmusicdisplay/opensheetmusicdisplay) for MusicXML rendering
- [Streamlit](https://streamlit.io/) for the Python GUI framework
