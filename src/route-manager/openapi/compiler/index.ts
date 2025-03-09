//specFile: SpecBodyVersion,

import { oas31 } from "openapi3-ts";
import { OASVersions, InferSpecBodyFromVersion } from "../openapi.types";
import { Error } from '@thequinndev/route-manager/build-endpoint'

interface OpenApiManager {
  build: (buildConfig: { failOnError: boolean }) => {
    spec: {
        components: {
            schemas?: any;
          };
          paths: any;
    },
    errors: Error[]
  };
}

export const OpenApiSpecCompiler = <SpecVersion extends OASVersions>(config: {
  version: SpecVersion;
  specFile: InferSpecBodyFromVersion<SpecVersion>,
  openApiManagers: OpenApiManager[];
}) => {
    const build = (buildConfig: {
        
        failOnError?: boolean,
    }) => {
        let specFile = config.specFile as oas31.OpenAPIObject
        const failOnError = buildConfig.failOnError ?? false
        for (const manager of config.openApiManagers) {
            const subBuild = manager.build({
                failOnError: failOnError
            })

            if (subBuild.spec.components.schemas) {
                if (!specFile.components?.schemas) {
                    specFile.components = {
                        schemas: {}
                    }
                }
                specFile.components.schemas = {
                    ...specFile.components.schemas,
                    ...subBuild.spec.components.schemas
                }
            }

            specFile.paths = {
                ...specFile.paths,
                ...subBuild.spec.paths
            }
        }

        return specFile
    }

    return {
        build
    }
}
