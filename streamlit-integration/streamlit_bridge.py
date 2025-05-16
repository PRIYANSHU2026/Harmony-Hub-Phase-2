#!/usr/bin/env python3
"""
Streamlit Bridge Script

This script serves as a bridge between the Next.js frontend and the Streamlit app.
It allows the Next.js app to trigger Streamlit functions and get results.
"""

import sys
import json
import os
import random
import string
import argparse
from typing import Dict, Any, Optional
import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom

# Sample music XML template
MUSIC_XML_TEMPLATE = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work>
    <work-title>{title}</work-title>
  </work>
  <identification>
    <creator type="composer">HarmonyHub AI</creator>
    <encoding>
      <software>HarmonyHub</software>
      <encoding-date>{date}</encoding-date>
    </encoding>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>{instrument}</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    {measures}
  </part>
</score-partwise>"""

MEASURE_TEMPLATE = """
    <measure number="{measure_number}">
      {attributes}
      {notes}
    </measure>"""

ATTRIBUTES_TEMPLATE = """
      <attributes>
        <divisions>1</divisions>
        <key>
          <fifths>{fifths}</fifths>
        </key>
        <time>
          <beats>{beats}</beats>
          <beat-type>{beat_type}</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>"""

NOTE_TEMPLATE = """
      <note>
        <pitch>
          <step>{step}</step>
          <octave>{octave}</octave>
          {alter}
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>"""

REST_TEMPLATE = """
      <note>
        <rest/>
        <duration>1</duration>
        <type>quarter</type>
      </note>"""

# Key signature mapping (number of sharps/flats)
KEY_SIGNATURE_MAP = {
    "C": 0, "G": 1, "D": 2, "A": 3, "E": 4, "B": 5, "F#": 6,
    "Gb": -6, "Db": -5, "Ab": -4, "Eb": -3, "Bb": -2, "F": -1,
    "Am": 0, "Em": 1, "Bm": 2, "F#m": 3, "C#m": 4, "G#m": 5, "D#m": 6,
    "Ebm": -6, "Bbm": -5, "Fm": -4, "Cm": -3, "Gm": -2, "Dm": -1,
}

def generate_music_xml(params: Dict[str, Any]) -> str:
    """
    Generate a MusicXML file based on the given parameters.

    Args:
        params: A dictionary containing music generation parameters

    Returns:
        A MusicXML string
    """
    instrument = params.get("instrument", "Piano")
    key = params.get("key", "C")
    time_signature = params.get("timeSignature", "4/4")
    bars = int(params.get("bars", 16))

    # Parse time signature
    beats, beat_type = time_signature.split("/")

    # Get key signature (number of sharps/flats)
    fifths = KEY_SIGNATURE_MAP.get(key, 0)

    # Generate measures
    measures = []
    for i in range(1, bars + 1):
        # Add attributes only to the first measure
        attributes = ""
        if i == 1:
            attributes = ATTRIBUTES_TEMPLATE.format(
                fifths=fifths,
                beats=beats,
                beat_type=beat_type
            )

        # Generate notes for this measure
        measure_notes = generate_notes_for_measure(params, int(beats))

        # Create the measure
        measure = MEASURE_TEMPLATE.format(
            measure_number=i,
            attributes=attributes,
            notes=measure_notes
        )
        measures.append(measure)

    # Generate the full XML
    xml = MUSIC_XML_TEMPLATE.format(
        title=f"{params.get('focusType', 'Exercise')} in {key}",
        date="2025-05-16",
        instrument=instrument,
        measures="".join(measures)
    )

    # Format the XML nicely
    try:
        dom = minidom.parseString(xml)
        xml = dom.toprettyxml(indent="  ")
    except Exception as e:
        print(f"XML formatting error: {e}")

    return xml

def generate_notes_for_measure(params: Dict[str, Any], beats: int) -> str:
    """
    Generate notes for a single measure based on the parameters.

    Args:
        params: A dictionary containing music generation parameters
        beats: Number of beats in the measure

    Returns:
        A string containing the note elements
    """
    focus_type = params.get("focusType", "intervals")
    focus_value = params.get("focusValue", "thirds")
    level = params.get("level", "beginner")

    notes_content = []

    for _ in range(beats):
        # Randomly decide if this is a rest (20% chance)
        if random.random() < 0.2:
            notes_content.append(REST_TEMPLATE)
            continue

        # Generate a note based on the focus type
        if focus_type == "intervals":
            # Generate intervals
            interval_map = {
                "seconds": [0, 2],
                "thirds": [0, 4],
                "fourths": [0, 5],
                "fifths": [0, 7]
            }

            # Get the interval pattern
            interval = interval_map.get(focus_value, [0, 4])

            # Base note
            base_step = random.choice(["C", "D", "E", "F", "G", "A", "B"])
            base_octave = random.choice([3, 4])

            # 50% chance to add an accidental
            alter_element = ""
            if random.random() < 0.3:
                alter_value = random.choice([1, -1])
                alter_element = f"<alter>{alter_value}</alter>"

            note = NOTE_TEMPLATE.format(
                step=base_step,
                octave=base_octave,
                alter=alter_element
            )
            notes_content.append(note)

        elif focus_type == "scales":
            # Generate scale patterns
            scale_map = {
                "major": ["C", "D", "E", "F", "G", "A", "B"],
                "minor": ["A", "B", "C", "D", "E", "F", "G"],
                "chromatic": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
            }

            scale = scale_map.get(focus_value, ["C", "D", "E", "F", "G", "A", "B"])

            # Pick a random note from the scale
            note_name = random.choice(scale)

            # Handle accidentals
            step = note_name[0]
            alter_element = ""
            if len(note_name) > 1:
                if note_name[1] == "#":
                    alter_element = "<alter>1</alter>"
                elif note_name[1] == "b":
                    alter_element = "<alter>-1</alter>"

            octave = random.choice([3, 4, 5])

            note = NOTE_TEMPLATE.format(
                step=step,
                octave=octave,
                alter=alter_element
            )
            notes_content.append(note)

        else:
            # Default: generate random notes
            step = random.choice(["C", "D", "E", "F", "G", "A", "B"])
            octave = random.choice([3, 4, 5])

            note = NOTE_TEMPLATE.format(
                step=step,
                octave=octave,
                alter=""
            )
            notes_content.append(note)

    return "".join(notes_content)

def generate_exercise(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate an exercise based on the provided parameters.

    Args:
        params: A dictionary containing the exercise parameters

    Returns:
        A dictionary containing the generated exercise data
    """
    # Generate a unique ID for the exercise
    exercise_id = f"ex-{''.join(random.choices(string.ascii_lowercase + string.digits, k=8))}"

    # Parse parameters
    instrument = params.get("instrument", "piano")
    level = params.get("level", "beginner")
    key = params.get("key", "C")
    meter_numerator = params.get("meterNumerator", "4")
    meter_denominator = params.get("meterDenominator", "4")
    focus_type = params.get("focusType", "intervals")
    focus_value = params.get("focusValue", "thirds")
    bars = params.get("bars", "16")

    # Generate the MusicXML
    music_xml = generate_music_xml({
        "instrument": instrument,
        "key": key,
        "timeSignature": f"{meter_numerator}/{meter_denominator}",
        "bars": bars,
        "focusType": focus_type,
        "focusValue": focus_value,
        "level": level
    })

    # In a real implementation, we would also generate MIDI data
    # For now, we'll just return a placeholder
    midi_data = "MOCK_MIDI_DATA"

    # Create the response
    response = {
        "exerciseId": exercise_id,
        "midiData": midi_data,
        "musicXML": music_xml,
        "metadata": {
            "title": f"{focus_type.capitalize()} Exercise in {key}",
            "instrument": instrument.capitalize(),
            "key": key,
            "timeSignature": f"{meter_numerator}/{meter_denominator}",
            "difficulty": level.capitalize(),
            "focus": f"{focus_type} - {focus_value}",
            "bars": int(bars),
            "generatedAt": "2025-05-16T12:00:00Z"
        }
    }

    return response

def main():
    """Main function to handle command line arguments and execute the appropriate function."""
    parser = argparse.ArgumentParser(description="Streamlit Bridge Script")
    parser.add_argument("--action", required=True, help="Action to perform (e.g., generate)")
    parser.add_argument("--params", help="JSON string of parameters")
    parser.add_argument("--output", help="Output file path")

    args = parser.parse_args()

    # Parse parameters if provided
    params = {}
    if args.params:
        try:
            params = json.loads(args.params)
        except json.JSONDecodeError:
            print("Error: Invalid JSON parameter string")
            sys.exit(1)

    # Execute the requested action
    if args.action == "generate":
        result = generate_exercise(params)

        # Output the result
        if args.output:
            with open(args.output, "w") as f:
                json.dump(result, f, indent=2)
        else:
            print(json.dumps(result, indent=2))
    else:
        print(f"Error: Unknown action '{args.action}'")
        sys.exit(1)

if __name__ == "__main__":
    main()
