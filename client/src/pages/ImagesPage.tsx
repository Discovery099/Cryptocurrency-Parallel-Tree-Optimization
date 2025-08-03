import { ImageGenerator } from "@/components/ui/ImageGenerator";

export default function ImagesPage() {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Platform Screenshots</h1>
          <p className="text-slate-400">Professional interface previews for documentation</p>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Mining Dashboard</h2>
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <ImageGenerator type="dashboard" className="w-full" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">GPU Management</h2>
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <ImageGenerator type="gpu-management" className="w-full" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Mining Pools</h2>
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <ImageGenerator type="mining-pools" className="w-full" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Analytics Dashboard</h2>
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <ImageGenerator type="analytics" className="w-full" />
            </div>
          </div>
        </div>

        <div className="text-center pt-8">
          <p className="text-slate-400">
            These images are generated programmatically and can be embedded in documentation
          </p>
        </div>
      </div>
    </div>
  );
}