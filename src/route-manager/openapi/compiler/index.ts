//specFile: SpecBodyVersion,

import { oas31 } from "openapi3-ts";
import { OASVersions, InferSpecBodyFromVersion, MetaConfigBase } from "../openapi.types";
import { Error } from '../../build-endpoint'

interface OpenApiManager {
  build: (buildConfig: { failOnError: boolean }) => {
    spec: {
        components: {
            schemas?: any;
            parameters?: any,
          };
          paths: any;
    },
    errors: Error[]
  };
}

export const OpenAPISpecCompiler = <SpecVersion extends OASVersions>(config: {
  version: SpecVersion;
  specFile: InferSpecBodyFromVersion<SpecVersion>,
  openApiManagers: OpenApiManager[],
  metaManager?: MetaConfigBase<SpecVersion>
}) => {
    const build = (buildConfig?: {
        failOnError?: boolean,
    }) => {
        let specFile = config.specFile as oas31.OpenAPIObject
        if (!buildConfig) {
            buildConfig = {
                failOnError: false
            }
        }
        const failOnError = buildConfig.failOnError!
        for (const manager of config.openApiManagers) {
            const subBuild = manager.build({
                failOnError: failOnError
            })


            if (subBuild.spec.components.parameters || subBuild.spec.components.schemas) {
                if (!specFile.components) {
                    specFile.components = {}
                }
            }

            if (subBuild.spec.components.schemas) {

                if (!specFile.components?.schemas) {
                    specFile.components!.schemas = {}
                }
                specFile.components!.schemas = {
                    ...specFile.components!.schemas,
                    ...subBuild.spec.components.schemas
                }
            }

            if (subBuild.spec.components.parameters) {

                if (!specFile.components?.parameters) {
                    specFile.components!.parameters = {}
                }
                specFile.components!.parameters = {
                    ...specFile.components!.parameters,
                    ...subBuild.spec.components.parameters
                }
            }

            specFile.paths = {
                ...specFile.paths,
                ...subBuild.spec.paths
            }
        }

        if (config.metaManager) {
            if (Array.isArray(config.metaManager.tags)) {
                specFile.tags = [
                    ...config.metaManager.tags,
                    ...(specFile.tags ? specFile.tags : [])
                ]
            }
        }

        return specFile
    }

    return {
        build
    }
}
