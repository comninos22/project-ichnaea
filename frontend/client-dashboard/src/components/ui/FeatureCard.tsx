import { Card, CardContent, CardHeader, CardTitle } from '@project-ichnaea/ui-components'
import React from 'react'

export const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) => {
  return (
    <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border-transparent hover:border-purple-100">
      <CardHeader>
        <CardTitle className="flex flex-col items-center gap-4 text-center">
          <div className="transform transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
          <span className="text-xl font-semibold text-gray-800">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
