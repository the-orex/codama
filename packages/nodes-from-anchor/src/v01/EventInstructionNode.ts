import {
    bytesTypeNode,
    camelCase,
    fieldDiscriminatorNode,
    fixedSizeTypeNode,
    instructionArgumentNode,
    InstructionNode,
    instructionNode,
} from '@codama/nodes';

import { getAnchorDiscriminatorV01 } from '../discriminators';
import type { IdlV01Event, IdlV01Field, IdlV01TypeDef } from './idl';
import { instructionArgumentNodeFromAnchorV01 } from './InstructionArgumentNode';
import type { GenericsV01 } from './unwrapGenerics';

export function eventInstructionNodeFromAnchorV01(
    event: IdlV01Event,
    typeDef: IdlV01TypeDef | undefined,
    generics: GenericsV01,
): InstructionNode {
    const fields: IdlV01Field[] =
        typeDef?.type.kind === 'struct' && Array.isArray(typeDef.type.fields)
            ? (typeDef.type.fields as IdlV01Field[])
            : [];

    let dataArguments = fields.map(field => instructionArgumentNodeFromAnchorV01(field, generics));

    const discriminatorField = instructionArgumentNode({
        defaultValue: getAnchorDiscriminatorV01(event.discriminator),
        defaultValueStrategy: 'omitted',
        name: 'discriminator',
        type: fixedSizeTypeNode(bytesTypeNode(), event.discriminator.length),
    });
    dataArguments = [discriminatorField, ...dataArguments];
    // Anchor CPI events have an 8-byte self-invocation prefix before the
    // actual event discriminator, so the discriminator starts at offset 8.
    const discriminators = [fieldDiscriminatorNode('discriminator', 8)];

    return instructionNode({
        accounts: [],
        arguments: dataArguments,
        discriminators,
        docs: [],
        name: camelCase(event.name),
    });
}
