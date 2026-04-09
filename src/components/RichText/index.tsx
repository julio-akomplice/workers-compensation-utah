import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import type { SerializedSupportiveTextNode } from '@/lexical/supportiveText/node'
import type { SerializedHighlightNode } from '@/lexical/highlight/node'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  BlockquoteBlock as BlockquoteBlockProps,
  CallToActionBlock as CTABlockProps,
  CaseQuestionnaireCTABlock as CaseQuestionnaireCTABlockProps,
  CtaBannerBlock as CtaBannerBlockProps,
  ManualCtaBannerBlock as ManualCtaBannerBlockProps,
  MediaBlock as MediaBlockProps,
  VideoBlock as VideoBlockProps,
  ContactCtaBlock as ContactCtaBlockProps,
  PhoneButtonBlock as PhoneButtonBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { BlockquoteBlock } from '@/blocks/Blockquote/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CaseQuestionnaireCTALexicalBlock } from '@/blocks/CaseQuestionnaireCTABlock/LexicalComponent'
import { CtaBannerBlockComponent } from '@/blocks/CtaBanner/Component'
import { VideoBlockComponent } from '@/blocks/VideoBlock/Component'
import { ContactCtaBlockComponent } from '@/blocks/ContactCtaBlock/Component'
import { PhoneButtonBlockComponent } from '@/blocks/PhoneButtonBlock/Component'
import { ManualCtaBannerBlockComponent } from '@/blocks/ManualCtaBanner/Component'
import { PhoneInlineBlockComponent } from '@/blocks/PhoneInlineBlock/Component'
import { PhoneWorkInlineBlockComponent } from '@/blocks/PhoneWorkInlineBlock/Component'
import { cn } from '@/utilities/ui'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | CaseQuestionnaireCTABlockProps | MediaBlockProps | BannerBlockProps | BlockquoteBlockProps | CtaBannerBlockProps | ManualCtaBannerBlockProps | VideoBlockProps | ContactCtaBlockProps | PhoneButtonBlockProps | CodeBlockProps>
  | SerializedSupportiveTextNode
  | SerializedHighlightNode

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  supportiveText: ({ node, nodesToJSX }) => (
    <p className="supportive-text">{nodesToJSX({ nodes: node.children })}</p>
  ),
  highlight: ({ node, nodesToJSX }) => (
    <span className="highlight">{nodesToJSX({ nodes: node.children })}</span>
  ),
  blocks: {
    banner: ({ node }) => <BannerBlock className="mb-4" {...node.fields} />,
    blockquote: ({ node }) => <BlockquoteBlock {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="my-10"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    caseQuestionnaireCTA: ({ node }) => <CaseQuestionnaireCTALexicalBlock {...node.fields} />,
    ctaBanner: ({ node }) => <CtaBannerBlockComponent {...node.fields} />,
    videoBlock: ({ node }) => <VideoBlockComponent className="my-10" {...node.fields} />,
    contactCta: ({ node }) => <ContactCtaBlockComponent {...node.fields} />,
    phoneButton: ({ node }) => <PhoneButtonBlockComponent {...node.fields} />,
    manualCtaBanner: ({ node }) => <ManualCtaBannerBlockComponent {...node.fields} />,
  },
  inlineBlocks: {
    phoneInline: () => <PhoneInlineBlockComponent />,
    phoneWorkInline: () => <PhoneWorkInlineBlockComponent />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
