#!/bin/bash

# Create directories if they don't exist
mkdir -p public/midi/{piano,trumpet,violin,clarinet,flute,guitar,sax}

# Piano MIDI files
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿPiano C Major Scale" > public/midi/piano/piano-scale-c-major.mid
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿPiano G Major Scale" > public/midi/piano/piano-scale-g-major.mid
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿPiano F Major Scale" > public/midi/piano/piano-scale-f-major.mid
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿPiano A Minor Scale" > public/midi/piano/piano-scale-a-minor.mid

# Trumpet MIDI files
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿTrumpet C Major Scale" > public/midi/trumpet/trumpet-scale-c-major.mid
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿTrumpet G Major Scale" > public/midi/trumpet/trumpet-scale-g-major.mid
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿTrumpet F Major Scale" > public/midi/trumpet/trumpet-scale-f-major.mid

# Violin MIDI files
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿViolin C Major Scale" > public/midi/violin/violin-scale-c-major.mid
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿViolin G Major Scale" > public/midi/violin/violin-scale-g-major.mid
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿViolin A Minor Scale" > public/midi/violin/violin-scale-a-minor.mid

# Clarinet MIDI files
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿClarinet C Major Scale" > public/midi/clarinet/clarinet-scale-c-major.mid
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿClarinet F Major Scale" > public/midi/clarinet/clarinet-scale-f-major.mid

# Flute MIDI files
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿFlute C Major Scale" > public/midi/flute/flute-scale-c-major.mid
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿFlute G Major Scale" > public/midi/flute/flute-scale-g-major.mid

# Guitar MIDI files
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿGuitar C Major Scale" > public/midi/guitar/guitar-scale-c-major.mid
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿGuitar G Major Scale" > public/midi/guitar/guitar-scale-g-major.mid
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿGuitar A Minor Scale" > public/midi/guitar/guitar-scale-a-minor.mid

# Saxophone MIDI files
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿAlto Sax C Major Scale" > public/midi/sax/alto-sax-scale-c-major.mid
echo "MThd     MTrk   ÀÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿAlto Sax G Major Scale" > public/midi/sax/alto-sax-scale-g-major.mid

echo "Generated all MIDI placeholder files."
