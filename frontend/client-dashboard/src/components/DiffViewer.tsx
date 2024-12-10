import React from 'react'
import { diffLines, Change } from 'diff'
import Papa from 'papaparse'
import { XMLParser } from 'fast-xml-parser'

interface DiffViewerProps {
  oldVersion: string
  newVersion: string
  fileFormat: 'csv' | 'json' | 'xml'
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ oldVersion, newVersion, fileFormat }) => {
  const parseData = (data: string, format: string) => {
    try {
      switch (format) {
        case 'csv':
          return Papa.parse(data, { header: true }).data
        case 'json':
          return JSON.parse(data)
        case 'xml':
          const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
            textNodeName: "#text",
            parseAttributeValue: true,
            parseTagValue: true,
            trimValues: true
          })
          return parser.parse(data)
        default:
          throw new Error(`Unsupported file format: ${format}`)
      }
    } catch (error) {
      console.error(`Error parsing ${format.toUpperCase()} data:`, error)
      return null
    }
  }

  const oldData = parseData(oldVersion, fileFormat)
  const newData = parseData(newVersion, fileFormat)

  if (oldData === null || newData === null) {
    return <div className="p-4 text-red-500">Error: Unable to parse {fileFormat.toUpperCase()} data</div>
  }

  const formatData = (data: any, format: string): string => {
    switch (format) {
      case 'csv':
        return Papa.unparse(data)
      case 'json':
        return JSON.stringify(data, null, 2)
      case 'xml':
        // For XML, we'll use a simple stringification for now
        return JSON.stringify(data, null, 2)
      default:
        return ''
    }
  }

  const oldFormatted = formatData(oldData, fileFormat)
  const newFormatted = formatData(newData, fileFormat)

  const diff = diffLines(oldFormatted, newFormatted)

  return (
    <div className="border rounded-md overflow-x-auto bg-gray-50">
      <pre className="p-4 text-sm">
        {diff.map((part: Change, index: number) => (
          <div
            key={index}
            className={`${
              part.added ? 'bg-green-100 text-green-800' :
              part.removed ? 'bg-red-100 text-red-800' :
              'text-gray-700'
            }`}
          >
            {part.added ? '+' : part.removed ? '-' : ' '}
            {part.value}
          </div>
        ))}
      </pre>
    </div>
  )
}
