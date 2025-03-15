import { EntityPropertyData } from '../../data';

const buildDescription = (description: EntityPropertyData['description']): string => {
    if (!description) {
        return ''
    }

    return `${description.maxValueComment ? `${description.maxValueComment} ` : ''}${description.propertyComment ?? ''}`
}

export const renderErDiagramProperty = (propertyData: EntityPropertyData): string => {

    let dataType = `${propertyData.coreDataType} `
    if (propertyData.maxLength) {
        dataType = `${propertyData.coreDataType}(${propertyData.maxLength}) `
    }

    const name = `${propertyData.name.toLowerCase()} `

    const constraints = propertyData.constraints.length ? `${propertyData.constraints.join(',')} ` : ''

    let description = buildDescription(propertyData.description)
    
    if (description.trim() !== '') {
        description = `"${description}"`
    }

    return `${dataType}${name}${constraints}${description}`.trim()
    
}