import {
  $applyNodeReplacement,
  $isElementNode,
  $isRangeSelection,
  ElementNode,
  type LexicalNode,
  type NodeKey,
  type RangeSelection,
  type SerializedElementNode,
  type Spread,
} from 'lexical'

export type SerializedHighlightNode = Spread<
  { type: 'highlight'; version: 1 },
  SerializedElementNode
>

export class HighlightNode extends ElementNode {
  static getType(): string {
    return 'highlight'
  }

  static clone(node: HighlightNode): HighlightNode {
    return new HighlightNode(node.__key)
  }

  constructor(key?: NodeKey) {
    super(key)
  }

  createDOM(): HTMLElement {
    const el = document.createElement('span')
    el.setAttribute('data-lexical-highlight', 'true')
    el.style.backgroundColor = '#fde047'
    el.style.color = '#111827'
    el.style.borderRadius = '2px'
    el.style.padding = '0 2px'
    return el
  }

  updateDOM(): boolean {
    return false
  }

  static importJSON(_serializedNode: SerializedHighlightNode): HighlightNode {
    return $createHighlightNode()
  }

  exportJSON(): SerializedHighlightNode {
    return {
      ...super.exportJSON(),
      type: 'highlight',
      version: 1,
    }
  }

  isInline(): true {
    return true
  }

  canBeEmpty(): false {
    return false
  }

  canInsertTextBefore(): true {
    return true
  }

  canInsertTextAfter(): true {
    return true
  }

  extractWithChild(): boolean {
    return true
  }
}

export function $createHighlightNode(): HighlightNode {
  return $applyNodeReplacement(new HighlightNode())
}

export function $isHighlightNode(
  node: LexicalNode | null | undefined,
): node is HighlightNode {
  return node instanceof HighlightNode
}

export function $wrapSelectionInHighlightNode(selection: RangeSelection): void {
  const nodes = selection.extract()
  const highlightNode = $createHighlightNode()
  const firstNode = nodes[0]

  if (firstNode) {
    firstNode.insertBefore(highlightNode)
  }

  for (const node of nodes) {
    highlightNode.append(node)
  }
}

export function $unwrapHighlightNode(node: HighlightNode): void {
  const children = node.getChildren()
  const parent = node.getParent()
  if (parent && $isElementNode(parent)) {
    for (let i = children.length - 1; i >= 0; i--) {
      node.insertAfter(children[i])
    }
    node.remove()
  }
}
