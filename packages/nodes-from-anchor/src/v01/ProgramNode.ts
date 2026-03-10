import { ProgramNode, programNode, ProgramVersion } from '@codama/nodes';

import { accountNodeFromAnchorV01 } from './AccountNode';
import { definedTypeNodeFromAnchorV01 } from './DefinedTypeNode';
import { errorNodeFromAnchorV01 } from './ErrorNode';
import { eventInstructionNodeFromAnchorV01 } from './EventInstructionNode';
import { IdlV01 } from './idl';
import { instructionNodeFromAnchorV01 } from './InstructionNode';
import { extractGenerics } from './unwrapGenerics';

export function programNodeFromAnchorV01(idl: IdlV01): ProgramNode {
    const [types, generics] = extractGenerics(idl.types ?? []);
    const accounts = idl.accounts ?? [];
    const instructions = idl.instructions ?? [];
    const events = idl.events ?? [];
    const errors = idl.errors ?? [];

    const filteredTypes = types.filter(type => !accounts.some(account => account.name === type.name));
    const definedTypes = filteredTypes.map(type => definedTypeNodeFromAnchorV01(type, generics));
    const accountNodes = accounts.map(account => accountNodeFromAnchorV01(account, types, generics));

    const instructionNodes = instructions.map(instruction => instructionNodeFromAnchorV01(instruction, generics));
    const eventInstructionNodes = events.map(event => {
        const typeDef = types.find(type => type.name === event.name);
        return eventInstructionNodeFromAnchorV01(event, typeDef, generics);
    });

    return programNode({
        accounts: accountNodes,
        definedTypes,
        errors: errors.map(errorNodeFromAnchorV01),
        instructions: [...instructionNodes, ...eventInstructionNodes],
        name: idl.metadata.name,
        origin: 'anchor',
        publicKey: idl.address,
        version: idl.metadata.version as ProgramVersion,
    });
}
