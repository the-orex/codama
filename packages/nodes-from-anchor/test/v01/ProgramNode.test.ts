import {
    accountNode,
    accountValueNode,
    argumentValueNode,
    arrayTypeNode,
    bytesTypeNode,
    constantPdaSeedNodeFromBytes,
    definedTypeLinkNode,
    definedTypeNode,
    enumEmptyVariantTypeNode,
    enumTupleVariantTypeNode,
    enumTypeNode,
    errorNode,
    fieldDiscriminatorNode,
    fixedCountNode,
    fixedSizeTypeNode,
    instructionAccountNode,
    instructionArgumentNode,
    instructionNode,
    numberTypeNode,
    pdaNode,
    pdaSeedValueNode,
    pdaValueNode,
    programNode,
    publicKeyTypeNode,
    structFieldTypeNode,
    structTypeNode,
    tupleTypeNode,
    variablePdaSeedNode,
} from '@codama/nodes';
import { expect, test } from 'vitest';

import { getAnchorDiscriminatorV01, programNodeFromAnchorV01 } from '../../src';

test('it creates program nodes', () => {
    const node = programNodeFromAnchorV01({
        accounts: [{ discriminator: [246, 28, 6, 87, 251, 45, 50, 42], name: 'MyAccount' }],
        address: '1111',
        errors: [{ code: 42, msg: 'my error message', name: 'myError' }],
        instructions: [
            {
                accounts: [
                    {
                        name: 'authority',
                        pda: {
                            seeds: [
                                { kind: 'const', value: [42, 31, 29] },
                                { kind: 'account', path: 'owner' },
                                { kind: 'arg', path: 'amount' },
                            ],
                        },
                    },
                    {
                        name: 'owner',
                    },
                    {
                        name: 'some_account',
                    },
                ],
                args: [
                    {
                        name: 'amount',
                        type: 'u8',
                    },
                ],
                discriminator: [246, 28, 6, 87, 251, 45, 50, 42],
                name: 'my_instruction',
            },
        ],
        metadata: { name: 'my_program', spec: '0.1.0', version: '1.2.3' },
        types: [{ name: 'MyAccount', type: { fields: [{ name: 'delegate', type: 'pubkey' }], kind: 'struct' } }],
    });

    expect(node).toEqual(
        programNode({
            accounts: [
                accountNode({
                    data: structTypeNode([
                        structFieldTypeNode({
                            defaultValue: getAnchorDiscriminatorV01([246, 28, 6, 87, 251, 45, 50, 42]),
                            defaultValueStrategy: 'omitted',
                            name: 'discriminator',
                            type: fixedSizeTypeNode(bytesTypeNode(), 8),
                        }),
                        structFieldTypeNode({
                            name: 'delegate',
                            type: publicKeyTypeNode(),
                        }),
                    ]),
                    discriminators: [fieldDiscriminatorNode('discriminator')],
                    name: 'myAccount',
                }),
            ],
            definedTypes: [],
            errors: [
                errorNode({
                    code: 42,
                    docs: ['myError: my error message'],
                    message: 'my error message',
                    name: 'myError',
                }),
            ],
            instructions: [
                instructionNode({
                    accounts: [
                        instructionAccountNode({
                            defaultValue: pdaValueNode(
                                pdaNode({
                                    name: 'authority',
                                    seeds: [
                                        constantPdaSeedNodeFromBytes('base58', 'F9bS'),
                                        variablePdaSeedNode('owner', publicKeyTypeNode()),
                                        variablePdaSeedNode('amount', numberTypeNode('u8')),
                                    ],
                                }),
                                [
                                    pdaSeedValueNode('owner', accountValueNode('owner')),
                                    pdaSeedValueNode('amount', argumentValueNode('amount')),
                                ],
                            ),
                            isSigner: false,
                            isWritable: false,
                            name: 'authority',
                        }),
                        instructionAccountNode({
                            isSigner: false,
                            isWritable: false,
                            name: 'owner',
                        }),
                        instructionAccountNode({
                            isSigner: false,
                            isWritable: false,
                            name: 'someAccount',
                        }),
                    ],
                    arguments: [
                        instructionArgumentNode({
                            defaultValue: getAnchorDiscriminatorV01([246, 28, 6, 87, 251, 45, 50, 42]),
                            defaultValueStrategy: 'omitted',
                            name: 'discriminator',
                            type: fixedSizeTypeNode(bytesTypeNode(), 8),
                        }),
                        instructionArgumentNode({ name: 'amount', type: numberTypeNode('u8') }),
                    ],
                    discriminators: [fieldDiscriminatorNode('discriminator')],
                    name: 'myInstruction',
                }),
            ],
            name: 'myProgram',
            origin: 'anchor',
            pdas: [],
            publicKey: '1111',
            version: '1.2.3',
        }),
    );
});

test('it converts events to instruction nodes', () => {
    const node = programNodeFromAnchorV01({
        address: '1111',
        events: [
            { discriminator: [124, 190, 74, 28, 177, 40, 200, 220], name: 'CancelDustOrderEvent' },
            { discriminator: [174, 66, 141, 17, 4, 224, 162, 77], name: 'CancelOrderEvent' },
            { discriminator: [49, 142, 72, 166, 230, 29, 84, 84], name: 'CreateOrderEvent' },
            { discriminator: [189, 219, 127, 211, 78, 230, 97, 238], name: 'TradeEvent' },
        ],
        instructions: [],
        metadata: { name: 'my_program', spec: '0.1.0', version: '1.2.3' },
        types: [
            {
                name: 'CancelDustOrderEvent',
                type: {
                    fields: [
                        { name: 'order_id', type: 'u128' },
                        { name: 'maker', type: 'pubkey' },
                    ],
                    kind: 'struct',
                },
            },
            {
                name: 'CancelOrderEvent',
                type: {
                    fields: [{ name: 'order_id', type: 'u128' }],
                    kind: 'struct',
                },
            },
            {
                name: 'CreateOrderEvent',
                type: {
                    fields: [
                        { name: 'order_id', type: 'u128' },
                        { name: 'price', type: 'u64' },
                        { name: 'quantity', type: 'u64' },
                    ],
                    kind: 'struct',
                },
            },
            {
                name: 'TradeEvent',
                type: {
                    fields: [
                        { name: 'price', type: 'u64' },
                        { name: 'quantity', type: 'u64' },
                        { name: 'maker', type: 'pubkey' },
                        { name: 'taker', type: 'pubkey' },
                    ],
                    kind: 'struct',
                },
            },
        ],
    });

    expect(node).toEqual(
        programNode({
            definedTypes: [
                definedTypeNode({
                    name: 'cancelDustOrderEvent',
                    type: structTypeNode([
                        structFieldTypeNode({ name: 'orderId', type: numberTypeNode('u128') }),
                        structFieldTypeNode({ name: 'maker', type: publicKeyTypeNode() }),
                    ]),
                }),
                definedTypeNode({
                    name: 'cancelOrderEvent',
                    type: structTypeNode([
                        structFieldTypeNode({ name: 'orderId', type: numberTypeNode('u128') }),
                    ]),
                }),
                definedTypeNode({
                    name: 'createOrderEvent',
                    type: structTypeNode([
                        structFieldTypeNode({ name: 'orderId', type: numberTypeNode('u128') }),
                        structFieldTypeNode({ name: 'price', type: numberTypeNode('u64') }),
                        structFieldTypeNode({ name: 'quantity', type: numberTypeNode('u64') }),
                    ]),
                }),
                definedTypeNode({
                    name: 'tradeEvent',
                    type: structTypeNode([
                        structFieldTypeNode({ name: 'price', type: numberTypeNode('u64') }),
                        structFieldTypeNode({ name: 'quantity', type: numberTypeNode('u64') }),
                        structFieldTypeNode({ name: 'maker', type: publicKeyTypeNode() }),
                        structFieldTypeNode({ name: 'taker', type: publicKeyTypeNode() }),
                    ]),
                }),
            ],
            instructions: [
                instructionNode({
                    accounts: [],
                    arguments: [
                        instructionArgumentNode({
                            defaultValue: getAnchorDiscriminatorV01([124, 190, 74, 28, 177, 40, 200, 220]),
                            defaultValueStrategy: 'omitted',
                            name: 'discriminator',
                            type: fixedSizeTypeNode(bytesTypeNode(), 8),
                        }),
                        instructionArgumentNode({ name: 'order_id', type: numberTypeNode('u128') }),
                        instructionArgumentNode({ name: 'maker', type: publicKeyTypeNode() }),
                    ],
                    discriminators: [fieldDiscriminatorNode('discriminator')],
                    name: 'cancelDustOrderEvent',
                }),
                instructionNode({
                    accounts: [],
                    arguments: [
                        instructionArgumentNode({
                            defaultValue: getAnchorDiscriminatorV01([174, 66, 141, 17, 4, 224, 162, 77]),
                            defaultValueStrategy: 'omitted',
                            name: 'discriminator',
                            type: fixedSizeTypeNode(bytesTypeNode(), 8),
                        }),
                        instructionArgumentNode({ name: 'order_id', type: numberTypeNode('u128') }),
                    ],
                    discriminators: [fieldDiscriminatorNode('discriminator')],
                    name: 'cancelOrderEvent',
                }),
                instructionNode({
                    accounts: [],
                    arguments: [
                        instructionArgumentNode({
                            defaultValue: getAnchorDiscriminatorV01([49, 142, 72, 166, 230, 29, 84, 84]),
                            defaultValueStrategy: 'omitted',
                            name: 'discriminator',
                            type: fixedSizeTypeNode(bytesTypeNode(), 8),
                        }),
                        instructionArgumentNode({ name: 'order_id', type: numberTypeNode('u128') }),
                        instructionArgumentNode({ name: 'price', type: numberTypeNode('u64') }),
                        instructionArgumentNode({ name: 'quantity', type: numberTypeNode('u64') }),
                    ],
                    discriminators: [fieldDiscriminatorNode('discriminator')],
                    name: 'createOrderEvent',
                }),
                instructionNode({
                    accounts: [],
                    arguments: [
                        instructionArgumentNode({
                            defaultValue: getAnchorDiscriminatorV01([189, 219, 127, 211, 78, 230, 97, 238]),
                            defaultValueStrategy: 'omitted',
                            name: 'discriminator',
                            type: fixedSizeTypeNode(bytesTypeNode(), 8),
                        }),
                        instructionArgumentNode({ name: 'price', type: numberTypeNode('u64') }),
                        instructionArgumentNode({ name: 'quantity', type: numberTypeNode('u64') }),
                        instructionArgumentNode({ name: 'maker', type: publicKeyTypeNode() }),
                        instructionArgumentNode({ name: 'taker', type: publicKeyTypeNode() }),
                    ],
                    discriminators: [fieldDiscriminatorNode('discriminator')],
                    name: 'tradeEvent',
                }),
            ],
            name: 'myProgram',
            origin: 'anchor',
            pdas: [],
            publicKey: '1111',
            version: '1.2.3',
        }),
    );
});

test('it unwraps and removes generic types', () => {
    const node = programNodeFromAnchorV01({
        address: '1111',
        instructions: [],
        metadata: { name: 'my_program', spec: '0.1.0', version: '1.2.3' },
        types: [
            {
                generics: [
                    { kind: 'const', name: 'N', type: 'usize' },
                    { kind: 'type', name: 'T' },
                ],
                name: 'SimpleAllocator',
                type: {
                    fields: [
                        {
                            name: 'state',
                            type: { array: [{ defined: { name: 'ItemState' } }, { generic: 'N' }] },
                        },
                        {
                            name: 'data',
                            type: { array: [{ generic: 'T' }, { generic: 'N' }] },
                        },
                    ],
                    kind: 'struct',
                },
            },
            {
                name: 'AccountData',
                type: {
                    kind: 'enum',
                    variants: [
                        { name: 'Unknown' },
                        {
                            fields: [
                                {
                                    defined: {
                                        generics: [
                                            { kind: 'const', value: '1000' },
                                            { kind: 'type', type: { defined: { name: 'VirtualTimelockAccount' } } },
                                        ],
                                        name: 'SimpleAllocator',
                                    },
                                },
                            ],
                            name: 'Timelock',
                        },
                        {
                            fields: [
                                {
                                    defined: {
                                        generics: [
                                            { kind: 'const', value: '500' },
                                            { kind: 'type', type: { defined: { name: 'VirtualDurableNonce' } } },
                                        ],
                                        name: 'SimpleAllocator',
                                    },
                                },
                            ],
                            name: 'Nonce',
                        },
                        {
                            fields: [
                                {
                                    defined: {
                                        generics: [
                                            { kind: 'const', value: '250' },
                                            { kind: 'type', type: { defined: { name: 'VirtualRelayAccount' } } },
                                        ],
                                        name: 'SimpleAllocator',
                                    },
                                },
                            ],
                            name: 'Relay',
                        },
                    ],
                },
            },
        ],
    });

    expect(node).toEqual(
        programNode({
            definedTypes: [
                definedTypeNode({
                    name: 'AccountData',
                    type: enumTypeNode([
                        enumEmptyVariantTypeNode('unknown'),
                        enumTupleVariantTypeNode(
                            'timelock',
                            tupleTypeNode([
                                structTypeNode([
                                    structFieldTypeNode({
                                        name: 'state',
                                        type: arrayTypeNode(definedTypeLinkNode('itemState'), fixedCountNode(1000)),
                                    }),
                                    structFieldTypeNode({
                                        name: 'data',
                                        type: arrayTypeNode(
                                            definedTypeLinkNode('virtualTimelockAccount'),
                                            fixedCountNode(1000),
                                        ),
                                    }),
                                ]),
                            ]),
                        ),
                        enumTupleVariantTypeNode(
                            'nonce',
                            tupleTypeNode([
                                structTypeNode([
                                    structFieldTypeNode({
                                        name: 'state',
                                        type: arrayTypeNode(definedTypeLinkNode('itemState'), fixedCountNode(500)),
                                    }),
                                    structFieldTypeNode({
                                        name: 'data',
                                        type: arrayTypeNode(
                                            definedTypeLinkNode('virtualDurableNonce'),
                                            fixedCountNode(500),
                                        ),
                                    }),
                                ]),
                            ]),
                        ),
                        enumTupleVariantTypeNode(
                            'relay',
                            tupleTypeNode([
                                structTypeNode([
                                    structFieldTypeNode({
                                        name: 'state',
                                        type: arrayTypeNode(definedTypeLinkNode('itemState'), fixedCountNode(250)),
                                    }),
                                    structFieldTypeNode({
                                        name: 'data',
                                        type: arrayTypeNode(
                                            definedTypeLinkNode('virtualRelayAccount'),
                                            fixedCountNode(250),
                                        ),
                                    }),
                                ]),
                            ]),
                        ),
                    ]),
                }),
            ],
            name: 'myProgram',
            origin: 'anchor',
            pdas: [],
            publicKey: '1111',
            version: '1.2.3',
        }),
    );
});
