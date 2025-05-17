# Harmony Hub - Trumpet Edition with Mistral 7B

An AI-powered trumpet practice platform with Mistral 7B integration for dynamic exercise generation and personalized feedback.

## Overview

This specialized version of Harmony Hub focuses exclusively on trumpet practice, leveraging Mistral 7B AI for generating customized exercises and providing intelligent feedback on your playing. It includes a comprehensive library of authentic trumpet sounds across different keys and a chatbot specifically trained to assist with trumpet technique.

## Features

### Trumpet-Only Focus
- Exercise generator optimized for trumpet technique and practice routines
- Authentic trumpet sound samples in all musical keys
- Trumpet-specific exercise templates for various aspects of technique

### AI-Generated Exercises
- Create customized trumpet exercises based on difficulty, key, and specific skills
- Focus on different technical aspects: intervals, scales, arpeggios, tonguing, flexibility
- Adaptable to player level from beginner to advanced

### Real Trumpet Sound Library
- High-quality trumpet recordings in multiple keys (C, F, Bb, G, D, A, E)
- Different articulation styles and tone qualities
- Practice alongside authentic sound references

### Mistral 7B AI Assistant
- Intelligent practice assistant powered by Mistral 7B
- Get personalized advice on trumpet technique and practice routines
- Ask questions about embouchure, breathing, range extension, tonguing techniques
- Receive custom-tailored feedback for your specific challenges

## Getting Started

### Prerequisites
- Node.js 18+ and Bun
- A Hugging Face API token (for Mistral 7B integration)
- Web browser with audio support

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/PRIYANSHU2026/Harmony-Hub-Phase-2.git
   cd Harmony-Hub-Phase-2
   ```

2. Install dependencies
   ```bash
   bun install
   ```

3. Set up your Hugging Face API token
   - Create an account at [huggingface.co](https://huggingface.co)
   - Generate an API token in your account settings
   - Add the token in the AI Tools page of the application

4. Start the development server
   ```bash
   bun run dev
   ```

## Usage Guide

### Generating Trumpet Exercises
1. Navigate to the Exercise Generator page
2. Select your difficulty level, key, and technical focus
3. Click "Generate Trumpet Exercise"
4. View the generated sheet music, play along with audio, or download as MIDI/XML

### Using the Trumpet Sound Library
1. Go to the AI Tools page
2. Select a key from the dropdown menu
3. Play the trumpet sound to hear an authentic reference
4. Choose between different articulation styles and sound qualities

### Getting AI Trumpet Advice
1. Use the Trumpet Practice Assistant chatbot in the AI Tools page
2. Ask questions about trumpet technique, practice routines, or specific challenges
3. Receive personalized advice based on Mistral 7B's understanding of trumpet playing

## Technical Implementation

### Sound Files
- Authentic trumpet recordings organized by key
- Multiple articulation styles and tone qualities per key
- WAV format for high-quality playback

### Trumpet-Specific AI Prompting
- Custom system prompts focused on trumpet technique and pedagogy
- Contextual understanding of trumpet-specific terminology
- Tailored feedback based on common trumpet challenges

### Sheet Music Generation
- Trumpet-appropriate range considerations
- Properly notated articulations and dynamics
- Contextual exercise generation based on skill level

## Acknowledgments
- Sound samples from Sound-Tracks-Harmony-Hub-MIDI repository
- Mistral 7B model for AI-powered assistance
- Original Harmony Hub platform by PRIYANSHU2026
