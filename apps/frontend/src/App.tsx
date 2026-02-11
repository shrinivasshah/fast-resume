export function App() {
  return (
    <div className="min-h-screen bg-base-200 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-base-content tracking-tight">
            ⚡ Fast <span className="text-primary">Resume</span>
          </h1>
          <p className="text-xl text-neutral opacity-80 max-w-2xl mx-auto">
            Build a professional, ATS-friendly resume in minutes with the power of AI.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <button className="btn btn-primary btn-lg shadow-lg hover:scale-105 transition-transform">
              Create My Resume Now
            </button>
            <button className="btn btn-outline btn-lg border-primary text-primary hover:bg-primary hover:text-white">
              Try Demo
            </button>
          </div>
        </header>

        {/* Component Showcase */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* Card Component */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold">Smart Templates</h2>
              <p className="text-neutral">
                Choose from dozens of professionally designed, ATS-optimized templates.
              </p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-secondary btn-sm">Browse Gallery</button>
              </div>
            </div>
          </div>

          <div className="card bg-primary text-primary-content shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold">AI Assistance</h2>
              <p className="opacity-90">
                Let our AI optimize your bullet points and tailor your resume to job descriptions.
              </p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-ghost border-white hover:bg-white/20 btn-sm">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs & Controls */}
        <section className="bg-base-100 p-8 rounded-box shadow-sm border border-base-300 space-y-6">
          <h3 className="text-2xl font-bold border-b pb-4">Form Controls</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="input input-bordered w-full focus:input-primary transition-all bg-base-200/50" 
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Professional Title</span>
              </label>
              <input 
                type="text" 
                placeholder="Software Engineer" 
                className="input input-bordered w-full focus:input-primary transition-all bg-base-200/50" 
              />
            </div>
          </div>
        </section>

        {/* Typography & Colors */}
        <section className="p-8 space-y-6">
          <h3 className="text-2xl font-bold">Design Tokens</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 p-3 bg-base-100 rounded-lg shadow-sm border">
              <div className="w-8 h-8 rounded-full bg-primary"></div>
              <span className="text-sm font-medium">Primary (#1A73E8)</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-base-100 rounded-lg shadow-sm border">
              <div className="w-8 h-8 rounded-full bg-secondary border"></div>
              <span className="text-sm font-medium">Secondary (#E8F0FE)</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-base-100 rounded-lg shadow-sm border">
              <div className="w-8 h-8 rounded-full bg-accent"></div>
              <span className="text-sm font-medium">Accent (#EA4335)</span>
            </div>
          </div>
        </section>

        <footer className="text-center py-12 text-neutral opacity-60 text-sm">
          &copy; 2026 Fast Resume • Built with modern aesthetics
        </footer>
      </div>
    </div>
  );
}
