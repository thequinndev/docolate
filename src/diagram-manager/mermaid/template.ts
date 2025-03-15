type TemplateTypes = 'erDiagram'

export const mermaidTemplate = (templateType: TemplateTypes, body: string) => {
    return `\`\`\`mermaid\n${templateType}${body}\n\`\`\``
}