import {
	IPollFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeConnectionType,
} from 'n8n-workflow';
import { getFilterQuery, prestashopApiRequest } from './GenericFunctions';

export class PrestashopTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PrestaShop Trigger',
		name: 'prestashopTrigger',
		icon: 'file:prestashop.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handle PrestaShop events via API',
		subtitle: '={{$parameter["event"]}}',
		defaults: {
			name: 'PrestaShop Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		polling: true,
		credentials: [
			{
				name: 'prestashopApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Trigger On',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				default: 'customers.created',
				options: [
				{
					name: 'Address Created',
					value: 'addresses.created',
				},
				{
					name: 'Carrier Created',
					value: 'carriers.created',
				},
				{
					name: 'Cart Rule Created',
					value: 'cart_rules.created',
				},
				{
					name: 'Cart Created',
					value: 'carts.created',
				},
				{
					name: 'Category Created',
					value: 'categories.created',
				},
				{
					name: 'Combination Created',
					value: 'combinations.created',
				},
				{
					name: 'Customer Message Created',
					value: 'customer_messages.created',
				},
				{
					name: 'Customer Thread Created',
					value: 'customer_threads.created',
				},
				{
					name: 'Customer Created',
					value: 'customers.created',
				},
				{
					name: 'Employee Created',
					value: 'employees.created',
				},
				{
					name: 'Manufacturer Created',
					value: 'manufacturers.created',
				},
				{
					name: 'Message Created',
					value: 'messages.created',
				},
				{
					name: 'Order Carrier Created',
					value: 'order_carriers.created',
				},
				{
					name: 'Order Detail Created',
					value: 'order_details.created',
				},
				{
					name: 'Order History Created',
					value: 'order_histories.created',
				},
				{
					name: 'Order Payment Created',
					value: 'order_payments.created',
				},
				{
					name: 'Order Created',
					value: 'orders.created',
				},
				{
					name: 'Product Created',
					value: 'products.created',
				},
				{
					name: 'Specific Price Rule Created',
					value: 'specific_price_rules.created',
				},
				{
					name: 'Specific Price Created',
					value: 'specific_prices.created',
				},
				{
					name: 'Stock Available Created',
					value: 'stock_availables.created',
				},
				{
					name: 'Store Created',
					value: 'stores.created',
				},
				{
					name: 'Supplier Created',
					value: 'suppliers.created',
				},
				{
					name: 'Tag Created',
					value: 'tags.created',
				},
			]
			},
			{
				displayName: 'Starting ID',
				name: 'startingId',
				type: 'number',
				default: 0,
				description: 'Only entities with ID greater that this value will be detected',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const nodeData = this.getWorkflowStaticData('node') as IDataObject;
		const lastId = (nodeData.lastCheckedId as number) || this.getNodeParameter('startingId', 0) as number;
		const event = this.getNodeParameter('event') as string;
		const [entity, action] = event.split('.');

		let queryString: string = '';
		if (action === 'created') {
			queryString = getFilterQuery({
				conditions: [
					{
						field: 'id',
						condition_type: 'gt',
						value: lastId.toString(),
					}
				],
				sort: [{ direction: 'ASC', field: 'id' }],
			});
		}

		const response = await prestashopApiRequest.call(
			this,
			'GET',
			entity,
			{},
			queryString,
		);

		const newItems = response[entity] || [];

		if (newItems.length === 0) {
			return [];
		}

		const maxId = Math.max(...newItems.map((item: any) => parseInt(item.id)));
		nodeData.lastCheckedId = maxId;

		return [newItems.map((item: any) => ({ json: item }))];
	}
}