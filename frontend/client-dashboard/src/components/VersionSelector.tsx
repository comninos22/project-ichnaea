import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@project-ichnaea/ui-components"

interface Version {
  id: string
  name: string
  date: string
}

interface VersionSelectorProps {
  versions: Version[]
  selectedVersion: string
  onVersionChange: (version: string) => void
  label: string
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({ versions, selectedVersion, onVersionChange, label }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">{label}:</span>
      <Select value={selectedVersion} onValueChange={onVersionChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select version" />
        </SelectTrigger>
        <SelectContent>
          {versions.map((version) => (
            <SelectItem key={version.id} value={version.id}>
              {version.name} - {version.date}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
