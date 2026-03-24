import { createServerFeature } from '@payloadcms/richtext-lexical'
import { createNode } from '@payloadcms/richtext-lexical'
import { convertLexicalNodesToHTML } from '@payloadcms/richtext-lexical'

import { HighlightNode } from './node'

export const HighlightFeature = createServerFeature({
  key: 'highlight',
  feature: {
    ClientFeature: '@/lexical/highlight/feature.client#HighlightFeatureClient',
    clientFeatureProps: null,
    nodes: [
      createNode({
        converters: {
          html: {
            converter: async ({
              converters,
              currentDepth,
              depth,
              draft,
              node,
              overrideAccess,
              parent,
              req,
              showHiddenFields,
            }) => {
              const childrenText = await convertLexicalNodesToHTML({
                converters,
                currentDepth,
                depth,
                draft,
                lexicalNodes: node.children,
                overrideAccess,
                parent: {
                  ...node,
                  parent,
                },
                req,
                showHiddenFields,
              })

              return `<span class="highlight">${childrenText}</span>`
            },
            nodeTypes: [HighlightNode.getType()],
          },
        },
        node: HighlightNode,
      }),
    ],
  },
})
