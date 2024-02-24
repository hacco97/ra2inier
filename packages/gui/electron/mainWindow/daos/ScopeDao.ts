import { Scope, fromRaw, isUniqueObject } from "@ra2inier/core";
import { component, inject } from "~/mainWindow/ioc.config";
import { DaoConfig } from "./DaoConfig";
import { escapePath, readJson, writeJson } from "@ra2inier/core/node";

@component('scope-dao')
export class ScopeDao {
   @inject('dao-config') declare config: DaoConfig

   readScopesByPath(scopeFile: string) {
      const tmp: Scope[] = readJson(scopeFile)
      const res: Record<string, Scope> = {}
      if (tmp instanceof Array)
         for (let scope of tmp) {
            scope = fromRaw(scope, Scope)
            if (isUniqueObject(scope))
               res[scope.key] = scope
         }
      return res
   }

   addScopeByPath(file: string, scope: Scope) {
      const tmp = readJson(file)
      tmp.push(scope)
      writeJson(file, tmp)
   }

   writeScopesByPath(file: string, scopes: Record<string, Scope>) {
      const tmp = []
      for (const key in scopes) {
         tmp.push(scopes[key])
      }
      writeJson(file, tmp)
   }

}
