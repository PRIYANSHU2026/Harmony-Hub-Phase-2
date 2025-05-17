import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-slate-900 py-20 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-5xl font-bold">HarmonyHub</h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            AI-powered trumpet practice platform with Mistral 7B integration for dynamic exercise generation
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/exercise-generator"
              className="rounded-md bg-primary px-6 py-3 text-lg font-medium text-white hover:bg-primary/90"
            >
              Generate Trumpet Exercises
            </Link>
            <Link
              href="/ai-tools"
              className="rounded-md bg-green-600 px-6 py-3 text-lg font-medium text-white hover:bg-green-700"
            >
              AI Practice Assistant
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
              title="AI-Generated Trumpet Exercises"
              description="Generate pedagogically sound trumpet exercises with customizable parameters for difficulty and technique focus."
              icon="🎺"
            />
            <FeatureCard
              title="Interactive Sheet Music"
              description="View exercises as professional-quality sheet music with playback capabilities featuring real trumpet sounds."
              icon="📝"
            />
            <FeatureCard
              title="Mistral 7B AI Feedback"
              description="Get personalized practice advice from our Mistral 7B-powered trumpet assistant to improve your playing."
              icon="🤖"
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
              description="Choose difficulty, key, and specific trumpet skills to focus on."
            />
            <StepCard
              step="2"
              title="Generate Exercise"
              description="Our Mistral 7B AI creates a customized trumpet exercise."
            />
            <StepCard
              step="3"
              title="Practice with Sound"
              description="Play along with authentic trumpet sounds in your selected key."
            />
            <StepCard
              step="4"
              title="Get AI Feedback"
              description="Receive trumpet-specific advice from our AI practice assistant."
            />
          </div>
        </div>
      </section>

      {/* Trumpet Sound Section */}
      <section className="w-full bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-3xl font-bold">Authentic Trumpet Sound Library</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-gray-600">
            Practice with high-quality trumpet sound samples in every key to develop your ear and perfect your tone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['C', 'F', 'Bb', 'Eb', 'G', 'D', 'A'].map((key) => (
              <div key={key} className="rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="mb-3 text-2xl font-bold text-primary">{key}</div>
                <p className="mb-2 text-sm text-gray-600">Key of {key}</p>
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 text-3xl">
                  🎺
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="w-full bg-slate-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold">Mistral 7B Trumpet Practice Assistant</h2>
              <p className="mb-6 text-lg">
                Our AI assistant specializes in trumpet technique, giving you personalized feedback
                to improve your playing. Ask questions about embouchure, breathing, articulation,
                range development, and more.
              </p>
              <ul className="mb-8 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2 text-green-400">✓</span> Advanced technique guidance
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-400">✓</span> Personalized practice routines
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-400">✓</span> Instant feedback on common problems
                </li>
              </ul>
              <Link
                href="/ai-tools"
                className="rounded-md bg-white px-6 py-3 text-lg font-medium text-slate-800 hover:bg-gray-100"
              >
                Try the AI Assistant
              </Link>
            </div>
            <div className="rounded-lg bg-white p-6 text-gray-800">
              <div className="mb-4 flex items-center border-b border-gray-200 pb-3">
                <div className="mr-3 rounded-full bg-primary p-2 text-white">🎺</div>
                <div className="text-lg font-medium">Trumpet Assistant</div>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg bg-gray-100 p-3">
                  <p className="text-sm font-medium text-gray-600">You</p>
                  <p>How can I improve my high notes on trumpet?</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <p className="text-sm font-medium text-gray-600">Trumpet Assistant</p>
                  <p>
                    To improve your high range, work on lip slurs daily starting from
                    a comfortable range and gradually extending higher. Keep your throat
                    relaxed and focus on strong air support. Aim for quality over quantity,
                    and be patient with your progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-primary py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-3xl font-bold">Ready to Improve Your Trumpet Playing?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Start generating personalized trumpet exercises and get AI-powered feedback today
          </p>
          <Link
            href="/exercise-generator"
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
