'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@project-ichnaea/ui-components"
import { Button } from "@project-ichnaea/ui-components"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@project-ichnaea/ui-components"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@project-ichnaea/ui-components"
import { Database, Download, FileText } from 'lucide-react'

const datasets = [
  {
    id: 'dataset1',
    name: 'Population Data 2023',
    category: 'Demographics',
    commitSha: '8f9d8f9d8f9d8f9d8f9d8f9d8f9d8f9d8f9d8f9d',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    lastUpdate: '2023-06-15T10:30:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    versions: ['v1', 'v2', 'v3'],
    description: 'Comprehensive population statistics for the year 2023.',
    fileFormat: 'csv'
  },
  {
    id: 'dataset2',
    name: 'Economic Indicators 2023',
    category: 'Economics',
    commitSha: '7e8d7e8d7e8d7e8d7e8d7e8d7e8d7e8d7e8d7e8d',
    sha256: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    lastUpdate: '2023-06-10T14:45:00Z',
    createdAt: '2023-01-15T00:00:00Z',
    versions: ['v1', 'v2'],
    description: 'Key economic indicators and trends for 2023.',
    fileFormat: 'json'
  },
  {
    id: 'dataset3',
    name: 'Climate Change Data 2023',
    category: 'Environment',
    commitSha: '6d7c6d7c6d7c6d7c6d7c6d7c6d7c6d7c6d7c6d7c',
    sha256: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
    lastUpdate: '2023-06-05T09:15:00Z',
    createdAt: '2023-02-01T00:00:00Z',
    versions: ['v1', 'v2', 'v3', 'v4'],
    description: 'Global climate change metrics and analysis for 2023.',
    fileFormat: 'xml'
  },
  {
    id: 'dataset4',
    name: 'Public Health Statistics 2023',
    category: 'Healthcare',
    commitSha: '5c6b5c6b5c6b5c6b5c6b5c6b5c6b5c6b5c6b5c6b',
    sha256: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
    lastUpdate: '2023-06-20T11:00:00Z',
    createdAt: '2023-02-15T00:00:00Z',
    versions: ['v1', 'v2', 'v3'],
    description: 'Comprehensive public health data and trends for 2023.',
    fileFormat: 'csv'
  },
]

export default function DatasetsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const router = useRouter()

  const filteredDatasets = useMemo(() => {
    return datasets.filter(dataset =>
      (categoryFilter === 'All' || dataset.category === categoryFilter) &&
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, categoryFilter])


  const categories = ['All', ...(Array.from(new Set(datasets.map(d => d.category))))]

  const handleFileChangesClick = (datasetId: string) => {
    router.push(`/diff-viewer?dataset=${datasetId}`)
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Dataset Explorer</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Input
          placeholder="Search datasets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatasets.map((dataset) => (
          <Card key={dataset.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{dataset.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500 mb-2">{dataset.category}</p>
              <p className="text-sm mb-4">{dataset.description}</p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>File Format: {dataset.fileFormat.toUpperCase()}</p>
                <p>Last updated: {new Date(dataset.lastUpdate).toLocaleString()}</p>
                <p>Created: {new Date(dataset.createdAt).toLocaleString()}</p>
                <p>Commit SHA: {dataset.commitSha.slice(0, 7)}</p>
                <p>SHA256: {dataset.sha256.slice(0, 7)}...</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => console.log('Verify clicked', dataset.id)}>
                <Database className="w-4 h-4 mr-2" />
                Verify
              </Button>
              <Button variant="outline" size="sm" onClick={() => console.log('Download clicked', dataset.id)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button size="sm" onClick={() => handleFileChangesClick(dataset.id)}>
                <FileText className="w-4 h-4 mr-2" />
                Changes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-6">
        Showing {filteredDatasets.length} of {datasets.length} datasets
      </p>
    </div>
  )
}
