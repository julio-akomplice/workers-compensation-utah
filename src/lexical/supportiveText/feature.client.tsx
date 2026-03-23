'use client'

import { $setBlocksType } from '@lexical/selection'
import { $getSelection, $isRangeSelection } from 'lexical'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'

import { SupportiveTextNode, $createSupportiveTextNode, $isSupportiveTextNode } from './node'

const SupportiveTextIcon = () => (
  <span
    style={{
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '1px',
      textTransform: 'uppercase',
    }}
  >
    ST
  </span>
)

const toolbarGroups = [
  {
    type: 'dropdown' as const,
    ChildComponent: SupportiveTextIcon,
    items: [
      {
        ChildComponent: SupportiveTextIcon,
        isActive: ({ selection }: { selection: any }) => {
          if (!$isRangeSelection(selection)) {
            return false
          }
          for (const node of selection.getNodes()) {
            if (!$isSupportiveTextNode(node) && !$isSupportiveTextNode(node.getParent())) {
              return false
            }
          }
          return true
        },
        key: 'supportiveText',
        label: 'Supportive Text',
        onSelect: ({ editor }: { editor: any }) => {
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createSupportiveTextNode())
            }
          })
        },
        order: 0,
      },
    ],
    key: 'text',
    order: 25,
  },
]

export const SupportiveTextFeatureClient = createClientFeature({
  nodes: [SupportiveTextNode],
  slashMenu: {
    groups: [
      {
        items: [
          {
            Icon: SupportiveTextIcon,
            key: 'supportiveText',
            keywords: ['supportive', 'caption', 'kicker', 'subtitle'],
            label: 'Supportive Text',
            onSelect: ({ editor }: { editor: any }) => {
              editor.update(() => {
                const selection = $getSelection()
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createSupportiveTextNode())
                }
              })
            },
          },
        ],
        key: 'basic',
        label: 'Basic',
      },
    ],
  },
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
