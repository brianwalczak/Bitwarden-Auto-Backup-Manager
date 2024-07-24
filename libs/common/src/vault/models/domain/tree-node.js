"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeNode = void 0;
class TreeNode {
    constructor(node, parent, name, id) {
        this.children = [];
        this.parent = parent;
        this.node = node;
        if (name) {
            this.node.name = name;
        }
        if (id) {
            this.node.id = id;
        }
    }
}
exports.TreeNode = TreeNode;
//# sourceMappingURL=tree-node.js.map