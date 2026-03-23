import {
  $applyNodeReplacement,
  $createParagraphNode,
  ElementNode,
  type LexicalNode,
  type SerializedElementNode,
  type Spread,
} from 'lexical'

export type SerializedSupportiveTextNode = Spread<
  { type: 'supportiveText'; version: 1 },
  SerializedElementNode
>

export class SupportiveTextNode extends ElementNode {
  static getType(): string {
    return 'supportiveText'
  }

  static clone(node: SupportiveTextNode): SupportiveTextNode {
    return new SupportiveTextNode(node.__key)
  }

  createDOM(): HTMLElement {
    const el = document.createElement('p')
    el.setAttribute('data-lexical-supportive-text', 'true')
    el.style.backgroundColor = '#ffb94a33'
    el.style.padding = '4px 8px'
    el.style.borderRadius = '4px'
    return el
  }

  updateDOM(): boolean {
    return false
  }

  static importJSON(_serializedNode: SerializedSupportiveTextNode): SupportiveTextNode {
    return $createSupportiveTextNode()
  }

  exportJSON(): SerializedSupportiveTextNode {
    return {
      ...super.exportJSON(),
      type: 'supportiveText',
      version: 1,
    }
  }

  insertNewAfter(): ElementNode {
    const newElement = $createParagraphNode()
    newElement.setDirection(this.getDirection())
    this.insertAfter(newElement)
    return newElement
  }

  collapseAtStart(): true {
    const paragraph = $createParagraphNode()
    const children = this.getChildren()
    children.forEach((child) => paragraph.append(child))
    this.replace(paragraph)
    return true
  }
}

export function $createSupportiveTextNode(): SupportiveTextNode {
  return $applyNodeReplacement(new SupportiveTextNode())
}

export function $isSupportiveTextNode(
  node: LexicalNode | null | undefined,
): node is SupportiveTextNode {
  return node instanceof SupportiveTextNode
}
