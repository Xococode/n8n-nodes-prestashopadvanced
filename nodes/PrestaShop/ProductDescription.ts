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
				name: 'Stock',
				value: 'stock',
				description: 'Update a product stock',
				action: 'Update a product stock',
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
	/*                                   product:stock			                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Search Mode',
		name: 'searchMode',
		type: 'options',
		options: [
			{
				name: 'By Stock ID Available',
				value: 'byStockId',
			},
			{
				name: 'By Product + Combination + Shop',
				value: 'byCombination',
			},
		],
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['stock'],
			},
		},
		default: 'byStockId',
		description: 'Select how you want to find the stock record to update',
	},

	{
		displayName: 'Stock ID',
		name: 'stockId',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['stock'],
				searchMode: ['byStockId'],
			},
		},
	},

	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['stock'],
				searchMode: ['byCombination'],
			},
		},
	},
	{
		displayName: 'Combination ID',
		name: 'combinationId',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['stock'],
				searchMode: ['byCombination'],
			},
		},
	},

	{
		displayName: 'Is Multishop',
		name: 'isMultishop',
		type: 'hidden',
		typeOptions: {
			loadOptionsMethod: 'checkMultishop',
		},
		default: false,
	},
	{
		displayName: 'Shop Name or ID',
		name: 'shopId',
		type: 'options',
		description: 'Choose from the list. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'getShops',
		},
		default: 1,
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['stock'],
				searchMode: ['byCombination'],
				isMultishop: [true],
			},
		},
	},
	{
		displayName: 'Shop Group Name or ID',
		name: 'shopGroupId',
		type: 'options',
		description: 'Choose from the list. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'getShopGroups',
		},
		default: 0,
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['stock'],
				searchMode: ['byCombination'],
				isMultishop: [true],
			},
		},
	},
	{
		displayName: 'Quantity',
		name: 'quantity',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['stock'],
			},
		},
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
