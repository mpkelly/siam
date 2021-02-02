export const parseTabbedContent = (input: string, valueConverter = defaultValueConverter) => {
  const nodes: LineNode[] = input.split("\n").map((line) => {
    const indentation = numberOfTabs(line);
    const rest = line.substring(indentation);
    const [name, ...value] = rest.trim().split(" ");
    return { indentation, name, value: value.join(" ") };
  });
  const tree: TreeNode = {};
  const parents: any[] = [];
  nodes
    .filter((node) => node.name)
    .forEach((node) => {
      let parent: TreeNode = tree;
      if (node.indentation > 0) {
        const entry = parents[node.indentation - 1];
        if (entry) {
          parent = entry.node[entry.name];
          if (new Object(parent) !== parent) {
            parent = entry.node[entry.name] = {};
          }
        }
      }
      parents.splice(node.indentation, 1, { node: parent, name: node.name });
      const value = valueConverter(node.value)
      parent[node.name] = value || {};
    });
  return tree;
};

export const defaultValueConverter = (value?:string):TreeNodeValue => {
  return value;
}

export const numberOfTabs = (input: string) => {
  let count = 0;
  let index = 0;
  while (input.charAt(index++) === "\t") {
    count++;
  }
  return count;
};

type LineNode = {
  name: string;
  value: string;
  indentation: number;
};

export type TreeNodeValue = string|number|boolean|number[]|string[]|boolean[]|undefined

export type TreeNode = {
  [key: string]: TreeNodeValue | TreeNode;
};