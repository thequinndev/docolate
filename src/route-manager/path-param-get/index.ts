export const getParamsFromPath = (path: string): Record<string, false> => {

    // First remove the leading slash
    if (path.startsWith('/')) {
        path = path.slice(1);
    }

    // Default to false as they will be set to true if found
    const result: Record<string, false> = path.split('/').reduce((acc, item) => {
        if ((item.includes('{') && item.includes('}'))) {
            const key = item.replace('{', '').replace('}', '')
            acc[key] = false
        }
        
        if (item.includes(':')) {
            const key = item.replace(':', '')
            acc[key] = false
        }

        return acc;
      }, {} as Record<string, false>);

    return result
}