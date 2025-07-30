import type { INodeProperties } from 'n8n-workflow';

import { getSearchFilters } from './GenericFunctions';

export const specificPriceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['specific_price'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new specific price',
				action: 'Create an specific price',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an specific price',
				action: 'Delete an specific price',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an specific price',
				action: 'Get an specific price',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many specific prices',
				action: 'Get many specific prices',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an specific price',
				action: 'Update an specific price',
			},
		],
		default: 'create',
	},
];

export const specificPriceFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                   specific_price:delete		              */
	/*                                   specific_price:get		                  */
	/*                                   specific_price:update		              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Specific Price ID',
		name: 'specificPriceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['delete', 'update', 'get'],
			},
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                                   specific_price:create                    */
	/*                                   specific_price:update                    */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'number',
		required: true,
		default: 0,
		description: 'ID of the product',
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Combination ID',
		name: 'productAttributeId',
		type: 'number',
		default: 0,
		description: 'ID of the product combination (0 = all combinations)',
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
			},
		},
	},

	{
		displayName: 'Is Multishop',
		name: 'isMultishop',
		type: 'hidden',
		default: false,
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Shop Group',
		name: 'shopGroupId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getShopGroups' },
		default: 0,
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
				isMultishop: [true],
			},
		},
	},
	{
		displayName: 'Shop',
		name: 'shopId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getShops' },
		default: 0,
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
				isMultishop: [true],
			},
		},
	},
	{
		displayName: 'Currency',
		name: 'currencyId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCurrencies' },
		default: 0,
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Country',
		name: 'countryId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCountries' },
		default: 0,
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Customer Group',
		name: 'groupId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCustomerGroups' },
		default: 0,
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'number',
		default: 0,
		description: 'ID of the customer (0 = all customers)',
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Minimum Quantity',
		name: 'fromQuantity',
		type: 'number',
		required: true,
		default: 1,
		description: 'Minimum quantity to trigger this price',
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Unlimited Duration',
		name: 'unlimitedDuration',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'From Date',
		name: 'from',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
				unlimitedDuration: [false],
			},
		},
	},
	{
		displayName: 'To Date',
		name: 'to',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
				unlimitedDuration: [false],
			},
		},
	},
	{
		displayName: 'Impact Mode',
		name: 'impactMode',
		type: 'options',
		options: [
			{ name: 'Apply discount to base price', value: 'discount' },
			{ name: 'Set specific price', value: 'fixed' },
		],
		default: 'discount',
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Reduction Amount',
		name: 'reductionValue',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
				impactMode: ['discount'],
			},
		},
	},
	{
		displayName: 'Reduction Type',
		name: 'reductionType',
		type: 'options',
		options: [
			{ name: 'Amount', value: 'amount' },
			{ name: 'Percentage', value: 'percentage' },
		],
		default: 'amount',
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
				impactMode: ['discount'],
			},
		},
	},
	{
		displayName: 'Reduction Include Taxes',
		name: 'reductionIncludeTax',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
				impactMode: ['discount'],
			},
		},
	},
	{
		displayName: 'Fixed Price (tax excluded)',
		name: 'fixedPriceTaxExcluded',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['create', 'update'],
				impactMode: ['fixed'],
			},
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                                   specific_price:getAll			          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['specific_price'],
				operation: ['getAll'],
			},
		},
		default: 0,
		description: 'Max number of results to return. Set to 0 for no limit.',
	},
	...getSearchFilters('specific_price', 'getSpecificPriceAttributes', 'getSpecificPriceAttributes'),
];
