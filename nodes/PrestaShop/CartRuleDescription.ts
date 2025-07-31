import type { INodeProperties } from 'n8n-workflow';

import { getSearchFilters } from './GenericFunctions';

export const cartRuleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cart_rule'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new cart rule',
				action: 'Create a cart rule',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a cart rule',
				action: 'Delete a cart rule',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a cart rule',
				action: 'Get a cart rule',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many cart rules',
				action: 'Get many cart rules',
			},
		],
		default: 'create',
	},
];

export const cartRuleFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                   cart_rule:delete		                  */
	/*                                   cart_rule:get		                      */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Cart Rule ID',
		name: 'cartRuleId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['cart_rule'],
				operation: ['delete', 'get'],
			},
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                                   cart_rule:create                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Information',
		name: 'information',
		type: 'fixedCollection',
		placeholder: 'Add information',
		default: {},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				values: [
					{
						displayName: 'Active',
						name: 'active',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Code',
						name: 'code',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Highlight',
						name: 'highlight',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'fixedCollection',
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
										displayName: 'Language Name or ID',
										name: 'idLang',
										type: 'options',
										typeOptions: {
											loadOptionsMethod: 'getLanguages',
										},
										default: '',
										description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
					},
					{
						displayName: 'Partial Use',
						name: 'partial_use',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'number',
						default: 1,
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['cart_rule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'fixedCollection',
		placeholder: 'Add conditions',
		default: {},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				values: [
					{
						displayName: 'Customer ID',
						name: 'id_customer',
						type: 'number',
						default: 0,
					},
					{
						displayName: 'Minimum Amount',
						name: 'minimum_amount',
						type: 'number',
						default: 0,
					},
					{
						displayName: 'Minimum Amount Currency Name or ID',
						name: 'minimum_amount_currency',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getCurrencies',
						},
						default: '',
						description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Minimum Amount Includes Shipping',
						name: 'minimum_amount_shipping',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Minimum Amount Includes Tax',
						name: 'minimum_amount_tax',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Total Available',
						name: 'quantity',
						type: 'number',
						default: 1,
					},
					{
						displayName: 'Total Available Per User',
						name: 'quantity_per_user',
						type: 'number',
						default: 1,
					},
					{
						displayName: 'Valid From',
						name: 'date_from',
						type: 'dateTime',
						required: true,
						default: '',
					},
					{
						displayName: 'Valid To',
						name: 'date_to',
						type: 'dateTime',
						required: true,
						default: '',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['cart_rule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Actions',
		name: 'actions',
		type: 'fixedCollection',
		placeholder: 'Add actions',
		default: {},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				values: [
					{
						displayName: 'Apply Discount',
						name: 'apply_discount',
						type: 'options',
						options: [
							{ name: 'Percentage', value: 'percent' },
							{ name: 'Amount', value: 'amount' },
							{ name: 'None', value: 'off' },
						],
						default: 'off',
					},
					{
						displayName: 'Apply Discount To',
						name: 'apply_discount_to',
						type: 'options',
						options: [
							{ name: 'Whole Order', value: 'order' },
							{ name: 'Specific Product', value: 'specific' },
							{ name: 'Cheapest Product', value: 'cheapest' },
						],
						default: 'order',
						displayOptions: {
							show: {
								apply_discount: ['percent', 'amount'],
							},
						},
					},
					{
						displayName: 'Discount Amount',
						name: 'reduction_amount',
						type: 'number',
						default: 0,
						displayOptions: {
							show: {
								apply_discount: ['amount'],
							},
						},
					},
					{
						displayName: 'Discount Currency Name or ID',
						name: 'reduction_currency',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getCurrencies',
						},
						default: '',
						displayOptions: {
							show: {
								apply_discount: ['amount'],
							},
						},
						description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Discount Includes Tax',
						name: 'reduction_tax',
						type: 'boolean',
						default: true,
						displayOptions: {
							show: {
								apply_discount: ['amount'],
							},
						},
					},
					{
						displayName: 'Discount Percentage',
						name: 'reduction_percent',
						type: 'number',
						default: 0,
						displayOptions: {
							show: {
								apply_discount: ['percent'],
							},
						},
					},
					{
						displayName: 'Exclude Discounted Products',
						name: 'reduction_exclude_special',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Free Shipping',
						name: 'free_shipping',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Gift Product',
						name: 'gift_product',
						type: 'number',
						default: 0,
						displayOptions: {
							show: {
								free_gift: [true],
							},
						},
					},
					{
						displayName: 'Gift Product Combination',
						name: 'gift_product_attribute',
						type: 'number',
						default: 0,
						displayOptions: {
							show: {
								free_gift: [true],
							},
						},
					},
					{
						displayName: 'Send Gift',
						name: 'free_gift',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Specific Discount Product',
						name: 'reduction_product',
						type: 'number',
						default: 0,
						displayOptions: {
							show: {
								apply_discount_to: ['specific'],
							},
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['cart_rule'],
				operation: ['create'],
			},
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                                   cart_rule:getAll			              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['cart_rule'],
				operation: ['getAll'],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	...getSearchFilters('cart_rule', 'getCartRuleAttributes', 'getCartRuleAttributes'),
];
