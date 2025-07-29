import type { INodeProperties } from 'n8n-workflow';

import { getProductOptionalFields, getProductOptionalTranslatableFields, getSearchFilters } from './GenericFunctions';

export const productOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['product'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a product',
				action: 'Create a product',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a product',
				action: 'Delete a product',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a product',
				action: 'Get a product',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many products',
				action: 'Get many products',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product',
				action: 'Update a product',
			},
		],
		default: 'create',
	},
];

export const productFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                   product:delete			                  */
	/*                                   product:get			                  */
	/*                                   product:update			                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['delete', 'update', 'get'],
			},
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                                   product:create			                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Name',
		name: 'name',
		type: 'fixedCollection',
		placeholder: 'Add translations',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				displayName: 'Translations',
				name: 'translations',
				values: [
					{
						displayName: 'Language',
						name: 'idLang',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getLanguages',
						},
						default: '',
					},
					{
						displayName: 'Value',
						name: 'valueLang',
						type: 'string',
						default: '',
					},
				],
			},
		],
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create',],
			},
		},
	},
	{
		displayName: 'Link Rewrite',
		name: 'linkRewrite',
		type: 'fixedCollection',
		placeholder: 'Add translations',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				displayName: 'Translations',
				name: 'translations',
				placeholder: 'Add translation',
				default: {},
				values: [
					{
						displayName: 'Language',
						name: 'idLang',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getLanguages',
						},
						default: '',
					},
					{
						displayName: 'Value',
						name: 'valueLang',
						type: 'string',
						default: '',
					},
				],
			},
		],
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create'],
			},
		},
		default: 0,
	},

	/* -------------------------------------------------------------------------- */
	/*                                   product:update			                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Name',
		name: 'name',
		type: 'fixedCollection',
		placeholder: 'Add translations',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				displayName: 'Translations',
				name: 'translations',
				values: [
					{
						displayName: 'Language',
						name: 'idLang',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getLanguages',
						},
						default: '',
					},
					{
						displayName: 'Value',
						name: 'valueLang',
						type: 'string',
						default: '',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update',],
			},
		},
	},
	{
		displayName: 'Link Rewrite',
		name: 'linkRewrite',
		type: 'fixedCollection',
		placeholder: 'Add translations',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				displayName: 'Translations',
				name: 'translations',
				placeholder: 'Add translation',
				default: {},
				values: [
					{
						displayName: 'Language',
						name: 'idLang',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getLanguages',
						},
						default: '',
					},
					{
						displayName: 'Value',
						name: 'valueLang',
						type: 'string',
						default: '',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
		default: '',
	},
	
	/* -------------------------------------------------------------------------- */
	/*                                   product:create			                  */
	/*                                   product:update			                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Multi Language Fields',
		name: 'translationFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create', 'update'],
			},
		},
		options: [...getProductOptionalTranslatableFields()],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create', 'update'],
			},
		},
		options: [...getProductOptionalFields()],
	},

	/* -------------------------------------------------------------------------- */
	/*                                   product:getAll			              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['getAll'],
			},
		},
		default: 0,
		description: 'Max number of results to return. Set to 0 for no limit.',
	},
	...getSearchFilters('product', 'getProductAttributes', 'getProductAttributes'),
];
