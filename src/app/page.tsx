import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-slate-900 py-20 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-5xl font-bold">HarmonyHub</h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            AI-powered personalized music education platform integrating MIDI-GPT for dynamic exercise generation
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/exercise-generator"
              className="rounded-md bg-primary px-6 py-3 text-lg font-medium text-white hover:bg-primary/90"
            >
              Generate Exercises
            </Link>
            <Link
              href="/ai-tools"
              className="rounded-md bg-green-600 px-6 py-3 text-lg font-medium text-white hover:bg-green-700"
            >
              AI Tools
            </Link>
            <Link
              href="/about"
              className="rounded-md border border-white bg-transparent px-6 py-3 text-lg font-medium text-white hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Key Features</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              title="AI-Generated Exercises"
              description="Generate pedagogically sound exercises with customizable parameters for instrument, difficulty, and music theory concepts."
              icon="🎵"
            />
            <FeatureCard
              title="Interactive Sheet Music"
              description="View exercises as professional-quality sheet music with playback capabilities and interactive annotations."
              icon="📝"
            />
            <FeatureCard
              title="Progress Tracking"
              description="Track student progress with detailed analytics and personalized feedback to guide their musical development."
              icon="📊"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <StepCard
              step="1"
              title="Select Parameters"
              description="Choose instrument, key, difficulty, and specific skills to focus on."
            />
            <StepCard
              step="2"
              title="Generate Exercise"
              description="Our AI creates a customized exercise based on your parameters."
            />
            <StepCard
              step="3"
              title="Interact & Practice"
              description="View, play, and practice with the generated sheet music."
            />
            <StepCard
              step="4"
              title="Track Progress"
              description="Monitor improvement and get suggestions for next steps."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-primary py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-3xl font-bold">Ready to Enhance Your Music Education?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Start generating personalized exercises for your students today
          </p>
          <Link
            href="/register"
            className="rounded-md bg-white px-6 py-3 text-lg font-medium text-primary hover:bg-gray-100"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
        {step}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
