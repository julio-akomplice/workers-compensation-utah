import React from 'react'
import type { CtaBannerBlock as CtaBannerBlockProps, CtaBanner } from '@/payload-types'
import { CtaBannerDisplay } from '@/components/CtaBannerDisplay'

type Props = {
  className?: string
} & CtaBannerBlockProps

export const CtaBannerBlockComponent: React.FC<Props> = ({ className, ctaBanner, variables }) => {
  if (!ctaBanner || typeof ctaBanner !== 'object') return null

  const banner = ctaBanner as CtaBanner
  const { template } = banner

  if (!template) return null

  // Merge: block instance variables override collection defaults
  const mergedVariables = mergeVariables(banner.variables, variables)

  // Deep clone the lexical tree and replace {{variables}} in text nodes
  const processedTemplate = replaceVariablesInLexical(
    JSON.parse(JSON.stringify(template)),
    mergedVariables,
  )

  return <CtaBannerDisplay data={processedTemplate} className={className} />
}

type MergedVariable = {
  name: string
  value: string
  isLink?: boolean | null
  href?: string | null
  newTab?: boolean | null
}

/**
 * Merges collection defaults with block instance overrides by variable name.
 * The collection defines the variable names and defaults.
 * Block instance overrides match by name and take priority.
 */
function mergeVariables(
  defaults: CtaBanner['variables'],
  overrides: CtaBannerBlockProps['variables'],
): MergedVariable[] {
  if (!defaults || defaults.length === 0) return []

  return defaults.map((def) => {
    if (!def.name) return null

    const override = overrides?.find((v) => v.name === def.name)

    return {
      name: def.name,
      value: override?.value || def.defaultValue || def.name,
      isLink: override?.isLink ?? def.isLink ?? false,
      href: override?.href ?? def.href ?? null,
      newTab: override?.newTab ?? def.newTab ?? false,
    }
  }).filter(Boolean) as MergedVariable[]
}

/**
 * Recursively walks the Lexical JSON tree.
 * For each text node, finds {{varName}} patterns and replaces them with the variable value.
 * If the variable is a link, it injects a Lexical link node wrapping the value.
 */
function replaceVariablesInLexical(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any,
  variables: MergedVariable[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (!node) return node

  // Handle the root wrapper: { root: { children: [...] } }
  if (node.root) {
    node.root = replaceVariablesInLexical(node.root, variables)
    return node
  }

  // If this node has children, process them
  if (node.children && Array.isArray(node.children)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newChildren: any[] = []

    for (const child of node.children) {
      if (child.type === 'text' && typeof child.text === 'string') {
        const expanded = expandTextNode(child, variables)
        newChildren.push(...expanded)
      } else {
        newChildren.push(replaceVariablesInLexical(child, variables))
      }
    }

    node.children = newChildren
  }

  return node
}

/**
 * Takes a single Lexical text node and splits it wherever {{varName}} appears.
 * Returns an array of nodes — plain text nodes and link nodes for link variables.
 */
function expandTextNode(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  textNode: any,
  variables: MergedVariable[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
  const text: string = textNode.text
  const regex = /\{\{(\w+)\}\}/g
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      result.push({
        ...textNode,
        text: text.slice(lastIndex, match.index),
      })
    }

    const varName = match[1]
    const variable = variables?.find((v) => v.name === varName)

    if (variable) {
      if (variable.isLink && variable.href) {
        // Create a Lexical link node
        result.push({
          type: 'link',
          version: 3,
          fields: {
            linkType: 'custom',
            newTab: variable.newTab || false,
            url: variable.href,
          },
          children: [
            {
              ...textNode,
              text: variable.value,
            },
          ],
        })
      } else {
        // Plain text replacement
        result.push({
          ...textNode,
          text: variable.value,
        })
      }
    } else {
      // Variable not found — keep original {{varName}}
      result.push({
        ...textNode,
        text: match[0],
      })
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    result.push({
      ...textNode,
      text: text.slice(lastIndex),
    })
  }

  // If no matches were found, return the original node
  if (result.length === 0) {
    return [textNode]
  }

  return result
}
