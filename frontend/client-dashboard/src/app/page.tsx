import Link from 'next/link'
import { Button } from "@project-ichnaea/ui-components"
import { Database, FileText, GitCompare, Search, ArrowRight, Users, BarChart, AreaChartIcon as ChartArea, CheckCircle } from 'lucide-react'
import { FeatureCard } from '../components/ui/FeatureCard'

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen mx-auto w-full">
      <section className="py-20 text-center">
        <h1 className="text-6xl font-extrabold mb-6 animate-fade-in text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600">
          Project Ichnaea
        </h1>
        <p className="text-2xl mb-8 max-w-2xl mx-auto text-gray-700">
          Unleash the power of data exploration and analysis
        </p>
        <div className="flex justify-center max-[433px]:flex-col gap-4">
          <Button asChild size="lg" variant="default">
            <Link href="/datasets">Explore Datasets <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="">
            <Link href="/diff-viewer">Try Diff Viewer</Link>
          </Button>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-purple-600">Discover Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Search className="h-12 w-12 text-purple-500" />}
              title="Intuitive Explorer"
              description="Navigate through datasets with powerful search and filtering capabilities. Find the data you need quickly and efficiently."
            />
            <FeatureCard
              icon={<GitCompare className="h-12 w-12 text-blue-500" />}
              title="Smart Diff Viewer"
              description="Visualize changes between dataset versions effortlessly. Identify updates, additions, and deletions with ease."
            />
            <FeatureCard
              icon={<Database className="h-12 w-12 text-pink-500" />}
              title="Format Flexibility"
              description="Work with CSV, JSON, XML, and more. Import and export your data in the format that suits your needs best."
            />
            <FeatureCard
              icon={<FileText className="h-12 w-12 text-yellow-500" />}
              title="Rich Metadata"
              description="Access comprehensive dataset information and history. Understand the context and lineage of your data."
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-purple-600">Why Choose Project Ichnaea?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Empower Your Data Analysis</h3>
                <p className="text-gray-600 mb-6">
                  Project Ichnaea provides a comprehensive suite of tools designed to streamline your data exploration and analysis process.
                  From intuitive dataset navigation to advanced comparison features, we've got you covered.
                </p>
                <ul className="space-y-2">
                  {[
                    "Effortlessly explore large datasets",
                    "Compare and track changes across versions",
                    "Collaborate with team members in real-time",
                    "Generate insightful visualizations"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <FeatureCard
                icon={<ChartArea className="h-8 w-8 text-red-500" />}
                title="Data Visualization"
                description="Create stunning visualizations to better understand your data and communicate insights effectively."
              />
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Built for Data Professionals</h3>
                <p className="text-gray-600 mb-6">
                  Whether you're a data scientist, analyst, or researcher, Project Ichnaea is designed to meet your needs.
                  Our platform is built with performance and usability in mind, ensuring a smooth experience even with large-scale datasets.
                </p>
              </div>
              <FeatureCard
                icon={<Users className="h-8 w-8 text-green-500" />}
                title="Team Collaboration"
                description="Work together seamlessly with built-in collaboration features. Share datasets, analyses, and insights with your team."
              />
              <FeatureCard
                icon={<BarChart className="h-8 w-8 text-indigo-500" />}
                title="Advanced Analytics"
                description="Leverage powerful analytics tools to gain deeper insights from your data and make data-driven decisions."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-purple-600">Ready to Get Started?</h2>
          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Join thousands of data professionals who are already using Project Ichnaea to unlock the full potential of their datasets.
          </p>
          <Button size="lg">
            Join Us Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}

