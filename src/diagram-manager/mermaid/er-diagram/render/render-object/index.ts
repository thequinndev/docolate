import { EntityData } from '../../data';
import { renderErDiagramProperty } from "../render-property";
import { aliasPlaceholder, tabProperties, tabEntities } from '../../../formatting'

export const renderErDiagramObject = (objectData: EntityData) => {
    const propertyStrings: string[] = []

    for (const propertyData of Object.values(objectData.properties)) {
        propertyStrings.push(renderErDiagramProperty(propertyData))
    }

    return `\n${tabEntities}${objectData.name.toUpperCase()}${aliasPlaceholder} {\n${tabProperties}${propertyStrings.join(`\n${tabProperties}`)}\n${tabEntities}}`
}