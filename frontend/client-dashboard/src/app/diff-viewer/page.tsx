'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@project-ichnaea/ui-components'
import { VersionSelector } from '../../components/VersionSelector'
import { DiffViewer } from '../../components/DiffViewer'

// Mock data for different file formats
const mockDatasets = {
  'dataset1': {
    name: 'Population Data 2023',
    format: 'csv' as const,
    versions: [
      {
        id: 'v1',
        name: 'Version 1',
        date: '2023-05-01',
        content: `id,name,age,city
1,John Doe,30,New York
2,Jane Smith,26,San Francisco
3,Bob Johnson,35,Chicago`
      },
      {
        id: 'v2',
        name: 'Version 2',
        date: '2023-05-15',
        content: `id,name,age,city
1,John Doe,30,New York
2,Jane Smith,26,San Francisco
3,Bob Johnson,35,Chicago
4,Alice Brown,28,Boston`
      },
    ]
  },
  'dataset2': {
    name: 'Economic Indicators 2023',
    format: 'json' as const,
    versions: [
      {
        id: 'v1',
        name: 'Version 1',
        date: '2023-06-01',
        content: JSON.stringify({
          gdp: {
            value: 21.43,
            unit: "trillion USD"
          },
          inflation: {
            value: 2.1,
            unit: "percent"
          },
          unemployment: {
            value: 3.6,
            unit: "percent"
          }
        }, null, 2)
      },
      {
        id: 'v2',
        name: 'Version 2',
        date: '2023-06-15',
        content: JSON.stringify({
          gdp: {
            value: 21.47,
            unit: "trillion USD"
          },
          inflation: {
            value: 2.2,
            unit: "percent"
          },
          unemployment: {
            value: 3.5,
            unit: "percent"
          },
          interestRate: {
            value: 1.75,
            unit: "percent"
          }
        }, null, 2)
      }
    ]
  },
  'dataset3': {
    name: 'Climate Data 2023',
    format: 'xml' as const,
    versions: [
      {
        id: 'v1',
        name: 'Version 1',
        date: '2023-07-01',
        content: `<?xml version="1.0" encoding="UTF-8"?>
<climate-data>
  <measurement id="1">
    <type>Temperature</type>
    <value>25.5</value>
    <unit>Celsius</unit>
  </measurement>
  <measurement id="2">
    <type>Humidity</type>
    <value>60</value>
    <unit>Percent</unit>
  </measurement>
</climate-data>`
      },
      {
        id: 'v2',
        name: 'Version 2',
        date: '2023-07-15',
        content: `<?xml version="1.0" encoding="UTF-8"?>
<climate-data>
  <measurement id="1">
    <type>Temperature</type>
    <value>26.2</value>
    <unit>Celsius</unit>
  </measurement>
  <measurement id="2">
    <type>Humidity</type>
    <value>58</value>
    <unit>Percent</unit>
  </measurement>
  <measurement id="3">
    <type>Wind Speed</type>
    <value>15</value>
    <unit>km/h</unit>
  </measurement>
</climate-data>`
      }
    ]
  }
}

export default function DiffViewerPage() {
  const searchParams = useSearchParams()
  const datasetId = searchParams.get('dataset') || 'dataset1'

  const [oldVersionId, setOldVersionId] = useState('')
  const [newVersionId, setNewVersionId] = useState('')
  const [oldVersionContent, setOldVersionContent] = useState('')
  const [newVersionContent, setNewVersionContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const dataset = mockDatasets[datasetId as keyof typeof mockDatasets]

  useEffect(() => {
    if (!dataset) {
      setError('Dataset not found')
      return
    }

    const versions = dataset.versions
    if (versions.length < 2) {
      setError('Not enough versions to compare')
      return
    }

    setOldVersionId(versions[0].id)
    setNewVersionId(versions[versions.length - 1].id)
  }, [datasetId, dataset])

  useEffect(() => {
    if (!dataset) return

    const oldVersion = dataset.versions.find(v => v.id === oldVersionId)
    const newVersion = dataset.versions.find(v => v.id === newVersionId)

    if (!oldVersion || !newVersion) {
      setError('Unable to find selected versions')
      return
    }

    setOldVersionContent(oldVersion.content)
    setNewVersionContent(newVersion.content)
    setError(null)
  }, [oldVersionId, newVersionId, dataset])

  if (!dataset) {
    return <div className="p-4 text-red-500">Dataset not found</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Data Diff Viewer</h1>
      <p className="mb-4">Viewing changes for dataset: {dataset.name}</p>
      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <div className="flex justify-between max-[433px]:flex-col max-[433px]:justify-center items-center mb-4">
          <VersionSelector
            versions={dataset.versions}
            selectedVersion={oldVersionId}
            onVersionChange={setOldVersionId}
            label="Old Version"
          />
          <VersionSelector
            versions={dataset.versions}
            selectedVersion={newVersionId}
            onVersionChange={setNewVersionId}
            label="New Version"
          />
        </div>
        <p className="mb-4">File Format: {dataset.format.toUpperCase()}</p>
        <Button
          onClick={() => {
            // This is where you would typically fetch the actual versions from your Git-like system
            console.log('Fetching versions...')
          }}
        >
          Fetch Latest Versions
        </Button>
      </div>
      {error ? (
        <div className="border rounded-md p-4 text-red-500">{error}</div>
      ) : (
        <div className="border rounded-md">
          <div className="bg-gray-100 p-2 border-b">
            <h2 className="text-lg font-semibold">Showing changes between {dataset.format.toUpperCase()} versions</h2>
          </div>
          <DiffViewer oldVersion={oldVersionContent} newVersion={newVersionContent} fileFormat={dataset.format} />
        </div>
      )}
    </div>
  )
}
