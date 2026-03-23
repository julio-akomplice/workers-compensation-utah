import { createServerFeature } from '@payloadcms/richtext-lexical'
import { createNode } from '@payloadcms/richtext-lexical'
import { convertLexicalNodesToHTML } from '@payloadcms/richtext-lexical'

import { SupportiveTextNode } from './node'

export const SupportiveTextFeature = createServerFeature({
  key: 'supportiveText',
  feature: {
    ClientFeature: '@/lexical/supportiveText/feature.client#SupportiveTextFeatureClient',
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

              return `<p class="supportive-text">${childrenText}</p>`
            },
            nodeTypes: [SupportiveTextNode.getType()],
          },
        },
        node: SupportiveTextNode,
      }),
    ],
  },
})
