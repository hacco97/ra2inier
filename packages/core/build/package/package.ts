import { forIn, Package } from '@ra2inier/core/boot';

/**
 * 解析项目的依赖，构建项目的依赖树
 * @returns [深度图，依赖树]
 */
export function resolveReferences(root: string, packages: Record<string, Package>) {
   const dp: Record<string, ReferTreeNode> = {}
   /**
    * 构建依赖树
    */
   function dfs(key: string, depth: number) {
      if (!packages[key]) return
      if (key in dp) {
         const tar = dp[key]
         if (tar.depth > depth) { tar.depth = depth }
         return dp[key]
      }
      const node = new ReferTreeNode(key, depth, packages[key])
      dp[key] = node
      for (const child of packages[key].references) {
         const tmp = dfs(child, depth + 1)
         if (!tmp) return
         node.depth = depth
         node.children[child] = tmp
      }
      return node
   }
   /**
    * 二次遍历确定最短路径
    */
   const tree = dfs(root, 0)
   if (tree) reDfs(tree)

   /**
    * 输入深度图
    */
   const depthGraph: Package[][] = []
   forIn(dp, (key, node) => {
      if (!depthGraph[node.depth]) depthGraph[node.depth] = []
      depthGraph[node.depth].push(node.package)
   })
   return [depthGraph, tree]
}

function reDfs(node: ReferTreeNode) {
   if (node.touched) return
   node.touched = true
   forIn(node.children, (key, child) => {
      if (child.depth > node.depth + 1) child.depth = node.depth + 1
      reDfs(child)
   })
}

class ReferTreeNode {
   declare package: Package
   key: string = ''
   children: Record<string, ReferTreeNode> = {}
   depth = 0
   touched = false

   constructor(key: string, depth: number, pkg?: Package) {
      this.key = key
      this.depth = depth
      pkg && (this.package = pkg)
   }
}
