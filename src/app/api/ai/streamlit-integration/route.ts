import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.parameters) {
      return NextResponse.json(
        { error: "Exercise parameters are required" },
        { status: 400 }
      );
    }

    // Create a temporary file to store the output
    const tempDir = os.tmpdir();
    const outputFile = path.join(tempDir, `exercise-${Date.now()}.json`);

    // Convert parameters to JSON string
    const paramsJson = JSON.stringify(data.parameters);

    // Path to the Python bridge script
    const scriptPath = path.join(process.cwd(), "streamlit-integration", "streamlit_bridge.py");

    // Execute the Python script with the parameters
    const command = `python3 ${scriptPath} --action generate --params '${paramsJson}' --output ${outputFile}`;

    try {
      // Execute the command
      await execAsync(command);

      // Read the output file
      const outputData = fs.readFileSync(outputFile, "utf-8");
      const result = JSON.parse(outputData);

      // Clean up the temporary file
      fs.unlinkSync(outputFile);

      return NextResponse.json(result);
    } catch (error: any) {
      console.error("Error executing Python script:", error);

      // Check if the output file was created and contains error information
      let errorMessage = "Failed to execute the Python script";

      if (fs.existsSync(outputFile)) {
        try {
          const outputData = fs.readFileSync(outputFile, "utf-8");
          const result = JSON.parse(outputData);
          if (result.error) {
            errorMessage = result.error;
          }
          fs.unlinkSync(outputFile);
        } catch (e) {
          // Ignore errors when reading the output file
        }
      }

      return NextResponse.json(
        { error: errorMessage, details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in streamlit integration API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Fallback for non-Python environments or testing
async function generateFallbackExercise(params: any) {
  return {
    exerciseId: `ex-${Date.now()}`,
    midiData: "MOCK_MIDI_DATA",
    musicXML: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work>
    <work-title>${params.focusType || "Exercise"} in ${params.key || "C"}</work-title>
  </work>
  <identification>
    <creator type="composer">HarmonyHub AI</creator>
    <encoding>
      <software>HarmonyHub</software>
      <encoding-date>${new Date().toISOString().slice(0, 10)}</encoding-date>
    </encoding>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>${params.instrument || "Piano"}</part-name>
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
          <beats>${params.meterNumerator || "4"}</beats>
          <beat-type>${params.meterDenominator || "4"}</beat-type>
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
    </measure>
  </part>
</score-partwise>`,
    metadata: {
      title: `${params.focusType || "Exercise"} in ${params.key || "C"}`,
      instrument: params.instrument || "Piano",
      key: params.key || "C",
      timeSignature: `${params.meterNumerator || "4"}/${params.meterDenominator || "4"}`,
      difficulty: params.level || "Beginner",
      focus: `${params.focusType || "intervals"} - ${params.focusValue || "thirds"}`,
      bars: parseInt(params.bars || "16"),
      generatedAt: new Date().toISOString()
    }
  };
}
