import type { INodeProperties } from 'n8n-workflow';

import { getSearchFilters } from './GenericFunctions';

export const orderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['order'],
			},
		},
		options: [
			{
				name: 'Change Status',
				value: 'changeStatus',
				description: 'Change an order status',
				action: 'Change an order status',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an order',
				action: 'Delete an order',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an order',
				action: 'Get an order',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many orders',
				action: 'Get many orders',
			},
			{
				name: 'Set Shipping Number',
				value: 'shippingNumber',
				description: 'Change an order shipping number',
				action: 'Change an order shipping number',
			},
		],
		default: 'get',
	},
];

export const orderFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                   order:delete			                  */
	/*                                   order:get			              		  */
	/*                                   order:changeStatus			              */
	/*                                   order:shippingNumber			          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['delete', 'get', 'changeStatus', 'shippingNumber'],
			},
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                                   order:changeStatus			              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Order State ID',
		name: 'orderStateId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getOrderStates'
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['changeStatus'],
			},
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                                   order:shippingNumber			          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Shipping Number',
		name: 'orderShippingNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['shippingNumber'],
			},
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                                   order:getAll			                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['getAll'],
			},
		},
		default: 0,
		description: 'Max number of results to return. Set to 0 for no limit.',
	},
	...getSearchFilters('order', 'getOrderAttributes', 'getOrderAttributes'),
];
