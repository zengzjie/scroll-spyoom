export interface NodeItem {
  min: number;
  max: number;
}

export const generateNodes = (itemList: string[], offsetTop: number) => {
  const nodes: NodeItem[] = [];
  itemList.forEach((id) => {
    const node = document.getElementById(id) as HTMLElement;
    console.log(node.offsetTop, 'nodes');
    if (node) {
      nodes.push({
        min: node.offsetTop - offsetTop,
        max: node.offsetTop - offsetTop + node.offsetHeight,
      });
    }
  });

  return nodes;
};

// 通过二分查找找到 [目标节点的区域范围, 目标节点Index]
export function binarySearch(
  arr: NodeItem[],
  target: number,
  param: { left?: number; right?: number },
): null | [NodeItem, number] {
  if (!arr.length) return null;
  let left = param.left || 0;
  let right = param.right || arr.length - 1;
  if (target < arr[left].min) return null;
  if (target > arr[right].max) return null;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (target < arr[mid].min) {
      right = mid - 1;
      continue;
    } else if (target > arr[mid].max) {
      left = mid + 1;
      continue;
    } else {
      return [arr[mid], mid]; // [targetNode, targetNodeIndex]
    }
  }
  return null;
}
