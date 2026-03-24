'use client'

import { $getSelection, $isRangeSelection } from 'lexical'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'

import {
  HighlightNode,
  $isHighlightNode,
  $wrapSelectionInHighlightNode,
  $unwrapHighlightNode,
} from './node'

const HighlightIcon = () => (
  <span
    style={{
      backgroundColor: '#fde047',
      borderRadius: '2px',
      padding: '0 4px',
      fontSize: '12px',
      fontWeight: 700,
      lineHeight: '1.2',
      color: '#000',
    }}
  >
    H
  </span>
)

function isHighlightActive(selection: any): boolean {
  if (!$isRangeSelection(selection)) return false
  for (const node of selection.getNodes()) {
    if ($isHighlightNode(node) || $isHighlightNode(node.getParent())) {
      return true
    }
  }
  return false
}

function toggleHighlight(editor: any): void {
  editor.update(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) return

    const isActive = isHighlightActive(selection)

    if (isActive) {
      const nodes = selection.getNodes()
      for (const node of nodes) {
        const highlightNode = $isHighlightNode(node) ? node : node.getParent()
        if (highlightNode && $isHighlightNode(highlightNode)) {
          $unwrapHighlightNode(highlightNode)
        }
      }
    } else {
      $wrapSelectionInHighlightNode(selection)
    }
  })
}

const toolbarGroups = [
  {
    type: 'buttons' as const,
    items: [
      {
        ChildComponent: HighlightIcon,
        isActive: ({ selection }: { selection: any }) => isHighlightActive(selection),
        key: 'highlight',
        label: 'Highlight',
        onSelect: ({ editor }: { editor: any }) => toggleHighlight(editor),
        order: 8,
      },
    ],
    key: 'format',
    order: 40,
  },
]

export const HighlightFeatureClient = createClientFeature({
  nodes: [HighlightNode],
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
