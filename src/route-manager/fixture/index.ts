import { EndpointArrayByOperationIds, EndpointBase } from "../endpoint";

export const FixtureManager = <
    Operations extends EndpointArrayByOperationIds<EndpointBase[]>
>(endpointGroup: Operations) => {
    const route = <OperationId extends keyof Operations>() => {
        return {
            
        }
    }
}