import { ClientInterface } from "../client-interface";
import { BaseQueryItem } from "../query.types";

type MockArrayDefinitions = Record<string, {
    markedBy: any[],
    returns: any
}[]>

type MockKeyValueDefinitions = Record<string, {
    markedBy: any,
    returns: any
}[]>
export const mockArrayClient = (definitions: MockArrayDefinitions): ClientInterface => {
    const arraysEqual = (a: any[], b: any[]) => {
        if (a.length !== b.length) return false;

        const count = new Map();
      
        for (let num of a) count.set(num, (count.get(num) || 0) + 1);
        for (let num of b) {
          if (!count.has(num) || count.get(num) === 0) return false;
          count.set(num, count.get(num) - 1);
        }
      
        return true;
      }

  const beginTransaction = async () => {}

  const rollbackTransaction = async () => {}

  const commitTransaction = async () => {}

  const queryRun = async (queryItem: BaseQueryItem, parameters?: any) => {
    if (parameters && !queryItem.parameters?.arrayResolver) {
        throw new Error(`Attempting to run query ${queryItem.alias} with invalid parameters.`)
    }

    const resolvedParams = queryItem.parameters?.arrayResolver(parameters)
    return definitions[queryItem.alias].find(item => {
        return arraysEqual(item.markedBy, resolvedParams!)
    })?.returns
  };

  return {
    beginTransaction,
    rollbackTransaction,
    commitTransaction,
    queryRun,
  };
};

export const mockKeyValueClient = (definitions: MockKeyValueDefinitions): ClientInterface => {
    function objectsEqual(obj1: any, obj2: any) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
      
        if (keys1.length !== keys2.length) return false;
      
        return keys1.every(key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]);
      }

  const beginTransaction = async () => {}

  const rollbackTransaction = async () => {}

  const commitTransaction = async () => {}

  const queryRun = async (queryItem: BaseQueryItem, parameters?: any) => {
    if (parameters && !queryItem.parameters?.keyValueResolver) {
        throw new Error(`Attempting to run query ${queryItem.alias} with invalid parameters.`)
    }

    const resolvedParams = queryItem.parameters?.keyValueResolver(parameters)
    return definitions[queryItem.alias].find(item => {
        return objectsEqual(item.markedBy, resolvedParams!)
    })?.returns
  };

  return {
    beginTransaction,
    rollbackTransaction,
    commitTransaction,
    queryRun,
  };
};