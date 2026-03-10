import {
    bytesTypeNode,
    camelCase,
    fieldDiscriminatorNode,
    fixedSizeTypeNode,
    InstructionArgumentNode,
    instructionArgumentNode,
    InstructionNode,
    instructionNode,
} from '@codama/nodes';

import { getAnchorEventDiscriminatorV00 } from '../discriminators';
import type { IdlV00Event } from './idl';
import { typeNodeFromAnchorV00 } from './typeNodes';

export function eventInstructionNodeFromAnchorV00(event: IdlV00Event): InstructionNode {
    const fieldArguments: InstructionArgumentNode[] = event.fields.map(field =>
        instructionArgumentNode({
            name: field.name,
            type: typeNodeFromAnchorV00(field.type),
        }),
    );

    const discriminatorField = instructionArgumentNode({
        defaultValue: getAnchorEventDiscriminatorV00(event.name),
        defaultValueStrategy: 'omitted',
        name: 'discriminator',
        type: fixedSizeTypeNode(bytesTypeNode(), 8),
    });
    const dataArguments = [discriminatorField, ...fieldArguments];
    const discriminators = [fieldDiscriminatorNode('discriminator')];

    return instructionNode({
        accounts: [],
        arguments: dataArguments,
        discriminators,
        docs: [],
        name: camelCase(event.name),
    });
}
