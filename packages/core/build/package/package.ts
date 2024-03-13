import { forIn, Package } from '@ra2inier/core/boot';

/**
 * 解析项目的依赖，构建项目的依赖树
 * @returns obj { graph: 深度图, tree: 依赖树的头, residue: 在packages中未用到的包  }
 *
 */
export function resolveReferences(root: string, packages: Record<string, Package>) {
   const dp: Record<string, ReferTreeNode> = {}
   /**
    * 构建依赖树
    */
   const dfs = (key: string, depth: number) => {
      if (!packages[key]) return
      if (key in dp) {
         const tar = dp[key]
         if (tar.depth > depth) { tar.depth = depth }
         return dp[key]
      }
      const node = new ReferTreeNode(key, depth, packages[key])
      dp[key] = node
      for (const child of packages[key].references) {
         const tmp = dfs(child.key, depth + 1)
         if (!tmp) return
         node.depth = depth
         node.children[child.key] = tmp
      }
      return node
   }
   /**
    * 二次遍历确定最短路径
    */
   const tree = dfs(root, 0)
   if (tree) reDfs(tree)

   /**
    * 输出深度图
    */
   const depthGraph: Package[][] = []
   forIn(dp, (key, node) => {
      if (!depthGraph[node.depth]) depthGraph[node.depth] = []
      depthGraph[node.depth].push(node.package)
   })

   /**
    * 输出剩余的冗余包
    */
   const residue: Package[] = []
   forIn(packages, (key, val) => {
      if (!(key in dp)) residue.push(val)
   })

   /**
    * 输出剩余
    */
   return {
      graph: depthGraph,
      tree,
      residue
   }
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
