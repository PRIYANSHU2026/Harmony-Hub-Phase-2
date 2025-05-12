import Link from "next/link";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">About HarmonyHub</h1>

      <div className="mb-8">
        <p className="mb-4 text-lg">
          HarmonyHub is an AI-powered music education platform designed to enhance the teaching and learning experience for music educators and students.
        </p>
        <p className="mb-4">
          While music educators strive to provide personalized learning paths, existing educational tools often lack the flexibility to adapt to diverse student needs. HarmonyHub bridges this gap by integrating Generative AI into a modular, web-based platform, empowering teachers to design customized exercises and dynamically adjust lessons based on individual progress.
        </p>
        <p className="mb-4">
          By leveraging AI-assisted personalization, HarmonyHub enhances the teacher's ability to cater to different learning styles, ensuring a more engaging and effective music education experience for all students.
        </p>
      </div>

      <h2 className="mb-4 text-2xl font-semibold">Our Technology</h2>

      <div className="mb-8">
        <h3 className="mb-2 text-xl font-semibold">MIDI-GPT Integration</h3>
        <p className="mb-4">
          At the heart of HarmonyHub is MIDI-GPT, a generative system based on the Transformer architecture, designed for computer-assisted music composition workflows. Developed by the Metacreation Lab, MIDI-GPT enables us to generate pedagogically sound musical exercises tailored to specific learning objectives.
        </p>

        <div className="mb-6 rounded-lg bg-gray-100 p-4">
          <h4 className="mb-2 font-medium">Key Technical Features:</h4>
          <ul className="list-inside list-disc space-y-2">
            <li>Fine-tuned LLM that understands music theory and education principles</li>
            <li>Generation of graded exercises for different instruments and skill levels</li>
            <li>Structured JSON output that includes MusicXML for accurate sheet music rendering</li>
            <li>Ability to control musical parameters like key, time signature, and pedagogical focus</li>
          </ul>
        </div>
      </div>

      <h2 className="mb-4 text-2xl font-semibold">Development Roadmap</h2>

      <div className="mb-8">
        <h3 className="mb-2 text-xl font-semibold">Phase 1: LLM-Driven Exercise Generation with VexFlow Rendering</h3>
        <p className="mb-4">
          Our current phase focuses on generating pedagogically sound exercises and displaying them as sheet music via VexFlow.
        </p>

        <div className="mb-6 rounded-lg bg-gray-100 p-4">
          <h4 className="mb-2 font-medium">Key Tasks:</h4>
          <ul className="list-inside list-disc space-y-2">
            <li>MIDI-GPT integration fine-tuned on graded exercises for various instruments</li>
            <li>Web-based interface for specifying exercise parameters</li>
            <li>Rendering generated exercises as interactive sheet music</li>
            <li>MIDI playback capabilities for auditory learning</li>
          </ul>
        </div>

        <h3 className="mb-2 text-xl font-semibold">Future Phases</h3>
        <div className="mb-6 rounded-lg bg-gray-100 p-4">
          <h4 className="mb-2 font-medium">Planned Features:</h4>
          <ul className="list-inside list-disc space-y-2">
            <li>Student performance assessment and feedback</li>
            <li>Adaptive learning paths based on progress</li>
            <li>Collaborative features for teacher-student interaction</li>
            <li>Integration with popular music education platforms</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/exercise-generator"
          className="rounded-md bg-primary px-6 py-3 text-lg font-medium text-white hover:bg-primary/90"
        >
          Try the Exercise Generator
        </Link>
      </div>
    </div>
  );
}
