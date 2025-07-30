import { capitalCase } from 'change-case';
import { XMLBuilder } from 'fast-xml-parser';
import {
	IExecuteFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import {
	getDefaultLanguage,
	getFilterQuery,
	getOrderFields,
	getCustomerFields,
	prestashopApiRequest,
	sort,
	getProductFields,
	buildMultilangField,
	getSpecificPriceFields,
} from './GenericFunctions';
import { customerFields, customerOperations } from './CustomerDescription';
import { orderFields, orderOperations } from './OrderDescription';
import { productFields, productOperations } from './ProductDescription';
import type {
	Filter,
	SortOrder,
	Translation,
} from './types';
import { specificPriceFields, specificPriceOperations } from './SpecificPriceDescription';

let cachedLanguages: INodePropertyOptions[] | null = null;

export class Prestashop implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PrestaShop',
		name: 'prestashop',
		icon: 'file:prestashop.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume PrestaShop API',
		defaults: {
			name: 'PrestaShop',
		},
		usableAsTool: true,
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'prestashopApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Order',
						value: 'order',
					},
					{
						name: 'Product',
						value: 'product',
					},
					{
						name: 'Specific Price',
						value: 'specific_price',
					},
				],
				default: 'customer',
			},
			{
				displayName: 'Output Format',
				name: 'output',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'JSON',
						value: 'JSON',
					},
					{
						name: 'XML',
						value: 'XML',
					},
				],
				default: 'JSON',
			},
			...customerOperations,
			...customerFields,
			...orderOperations,
			...orderFields,
			...productOperations,
			...productFields,
			...specificPriceOperations,
			...specificPriceFields
		],
	};

	methods = {
		loadOptions: {
			async getLanguages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				if (cachedLanguages) {
					return cachedLanguages;
				}

				//https://devdocs.prestashop-project.org/9/webservice/resources/languages/
				const response = await prestashopApiRequest.call(
					this,
					'GET',
					'languages',
					{},
					'display=full',
				);
				const languages = response['languages'] || [];
				const returnData: INodePropertyOptions[] = [];
				for (const lang of languages) {
					returnData.push({
						name: lang.name,
						value: lang.id,
					});
				}
				returnData.sort(sort);

				cachedLanguages = returnData;

				return returnData;
			},
			async getGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//https://devdocs.prestashop-project.org/9/webservice/resources/groups/
				const language = await getDefaultLanguage.call(this);
				const group = await prestashopApiRequest.call(
					this,
					'GET',
					'/groups',
					{},
					'language=' + language + '&display=full',
				);
				const returnData: INodePropertyOptions[] = [];
				returnData.push({
					name: group.name,
					value: group.id,
				});
				returnData.sort(sort);
				return returnData;
			},
			async getShops(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//https://devdocs.prestashop-project.org/9/webservice/resources/shops/
				const response = await prestashopApiRequest.call(
					this,
					'GET',
					'shops',
					{},
					'display=full',
				);
				const shops = response['shops'] || [];
				const returnData: INodePropertyOptions[] = [];
				for (const shop of shops) {
					returnData.push({
						name: shop.name,
						value: shop.id,
					});
				}
				returnData.sort(sort);
				return returnData;
			},
			async getShopGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//https://devdocs.prestashop-project.org/9/webservice/resources/shop_groups/
				const response = await prestashopApiRequest.call(
					this,
					'GET',
					'shop_groups',
					{},
					'display=full',
				);
				const shop_groups = response['shop_groups'] || [];
				const returnData: INodePropertyOptions[] = [];
				for (const shop_group of shop_groups) {
					returnData.push({
						name: shop_group.name,
						value: shop_group.id,
					});
				}
				returnData.sort(sort);
				return returnData;
			},
			async getCategories(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// https://devdocs.prestashop-project.org/9/webservice/resources/categories/
				const language = await getDefaultLanguage.call(this);
				const response = await prestashopApiRequest.call(
					this,
					'GET',
					'categories',
					{},
					'language=' + language + '&display=full',
				);
				const categories = response['categories'] || [];
				const returnData: INodePropertyOptions[] = [];
				for (const category of categories) {
					returnData.push({
						name: category.name,
						value: category.id,
					});
				}
				returnData.sort(sort);
				return returnData;
			},
			async getOrderStates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// https://devdocs.prestashop-project.org/9/webservice/resources/order_states/
				const language = await getDefaultLanguage.call(this);
				const response = await prestashopApiRequest.call(
					this,
					'GET',
					'order_states',
					{},
					'language=' + language + '&display=full',
				);
				const order_states = response['order_states'] || [];
				const returnData: INodePropertyOptions[] = [];
				for (const os of order_states) {
					returnData.push({
						name: os.name,
						value: os.id,
					});
				}
				returnData.sort(sort);
				return returnData;
			},
			async getManufacturers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// https://devdocs.prestashop-project.org/9/webservice/resources/manufacturers/
				const response = await prestashopApiRequest.call(
					this,
					'GET',
					'manufacturers',
					{},
					'display=full',
				);
				const manufacturers = response['manufacturers'] || [];
				const returnData: INodePropertyOptions[] = [];
				for (const manufacturer of manufacturers) {
					returnData.push({
						name: manufacturer.name,
						value: manufacturer.id,
					});
				}
				returnData.sort(sort);
				return returnData;
			},
			async getSuppliers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// https://devdocs.prestashop-project.org/9/webservice/resources/suppliers/
				const response = await prestashopApiRequest.call(
					this,
					'GET',
					'suppliers',
					{},
					'display=full',
				);
				const suppliers = response['suppliers'] || [];
				const returnData: INodePropertyOptions[] = [];
				for (const supplier of suppliers) {
					returnData.push({
						name: supplier.name,
						value: supplier.id,
					});
				}
				returnData.sort(sort);
				return returnData;
			},
			async getCurrencies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// https://devdocs.prestashop-project.org/9/webservice/resources/currencies/
				const response = await prestashopApiRequest.call(
					this,
					'GET',
					'currencies',
					{},
					'display=full',
				);
				const currencies = response['currencies'] || [];
				const returnData: INodePropertyOptions[] = [];

				for (const currency of currencies) {
					returnData.push({
						name: `${currency.name} (${currency.iso_code})`,
						value: currency.id,
					});
				}

				returnData.sort(sort);
				returnData.unshift({ name: 'All currencies', value: 0 });

				return returnData;
			},
			async getCountries(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// https://devdocs.prestashop-project.org/9/webservice/resources/countries/
				const language = await getDefaultLanguage.call(this);
				const response = await prestashopApiRequest.call(
					this,
					'GET',
					'countries',
					{},
					`language=${language}&display=full`,
				);
				const countries = response['countries'] || [];
				const returnData: INodePropertyOptions[] = [];

				for (const country of countries) {
					returnData.push({
						name: country.name,
						value: country.id,
					});
				}

				returnData.sort(sort);
				returnData.unshift({ name: 'All countries', value: 0 });

				return returnData;
			},
			async getCustomerGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// https://devdocs.prestashop-project.org/9/webservice/resources/groups/
				const language = await getDefaultLanguage.call(this);
				const response = await prestashopApiRequest.call(
					this,
					'GET',
					'groups',
					{},
					`language=${language}&display=full`,
				);
				const groups = response['groups'] || [];
				const returnData: INodePropertyOptions[] = [];

				for (const group of groups) {
					returnData.push({
						name: group.name,
						value: group.id,
					});
				}

				returnData.sort(sort);
				returnData.unshift({ name: 'All groups', value: 0 });

				return returnData;
			},
			async getProductAttributes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return getProductFields()
					.map((field) => ({ name: capitalCase(field), value: field }))
					.sort(sort);
			},
			async getOrderAttributes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return getOrderFields()
					.map((field) => ({ name: capitalCase(field), value: field }))
					.sort(sort);
			},
			async getCustomerAttributes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return getCustomerFields()
					.map((field) => ({ name: capitalCase(field), value: field }))
					.sort(sort);
			},
			async getSpecificPriceAttributes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return getSpecificPriceFields()
					.map((field) => ({ name: capitalCase(field), value: field }))
					.sort(sort);
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData;
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'customer') {
					if (operation === 'create') {
						const email = this.getNodeParameter('email', i) as string;
						const firstname = this.getNodeParameter('firstname', i) as string;
						const lastname = this.getNodeParameter('lastname', i) as string;
						const passwd = this.getNodeParameter('passwd', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);

						const response = await prestashopApiRequest.call(
							this,
							'GET',
							`customers`,
							{},
							'schema=blank',
						);
						
						const customerData = response.customer || {};

						if (email) customerData.email = email;
						if (firstname) customerData.firstname = firstname;
						if (lastname) customerData.lastname = lastname;
						if (passwd) customerData.passwd = passwd;
						Object.assign(customerData, additionalFields);

						['associations', 'date_add', 'date_upd'].forEach((prop) => delete customerData[prop]);

						for (const key of Object.keys(customerData)) {
							if (typeof customerData[key] === 'boolean') {
								customerData[key] = customerData[key] ? '1' : '0';
							} else if (typeof customerData[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(customerData[key])) {
								customerData[key] = customerData[key].replace('T', ' ');
							}
						}

						const builder = new XMLBuilder({ ignoreAttributes: false });
						const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
							builder.build({ prestashop: { customer: customerData } });

						responseData = await prestashopApiRequest.call(
							this,
							'POST',
							'customers',
							body
						);
					}

					if (operation === 'delete') {
						const customerId = this.getNodeParameter('customerId', i) as string;

						responseData = await prestashopApiRequest.call(
							this,
							'DELETE',
							`customers/${customerId}`,
						);

						responseData = { success: true };
					}

					if (operation === 'get') {
						const customerId = this.getNodeParameter('customerId', i) as string;

						responseData = await prestashopApiRequest.call(
							this,
							'GET',
							`customers/${customerId}`,
						);
					}

					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', 0) as number;
						const filterType = this.getNodeParameter('filterType', i) as string;
						const sortOption = this.getNodeParameter('options.sort', i, {}) as { sort: SortOrder[] };
						let qs: string = '';

						if (filterType === 'manual') {
							const filters = this.getNodeParameter('filters', i) as { conditions: Filter[] };
							qs = getFilterQuery({
								...filters,
								...sortOption,
								limit: limit,
							});
						}

						responseData = await prestashopApiRequest.call(
							this,
							'GET',
							'customers',
							{},
							qs,
						);
					}

					if (operation === 'update') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const firstname = this.getNodeParameter('firstname', i) as string;
						const lastname = this.getNodeParameter('lastname', i) as string;
						const passwd = this.getNodeParameter('passwd', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);

						const customerData: IDataObject = {};
						customerData.id = customerId;
						if (email) customerData.email = email;
						if (firstname) customerData.firstname = firstname;
						if (lastname) customerData.lastname = lastname;
						if (passwd) customerData.passwd = passwd;
						Object.assign(customerData, additionalFields);

						for (const key of Object.keys(customerData)) {
							if (typeof customerData[key] === 'boolean') {
								customerData[key] = customerData[key] ? '1' : '0';
							} else if (typeof customerData[key] === 'string') {
								if (key === 'birthday') {
									customerData[key] = customerData[key].split('T')[0];
								} else if(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(customerData[key])) {
									customerData[key] = customerData[key].replace('T', ' ');
								}
							}
						}

						const builder = new XMLBuilder({ ignoreAttributes: false });
						const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
							builder.build({ prestashop: { customer: customerData } });

						responseData = await prestashopApiRequest.call(
							this,
							'PATCH',
							`customers/${customerId}`,
							body
						);
					}
				}

				if (resource === 'order') {
					if (operation === 'delete') {
						const orderId = this.getNodeParameter('orderId', i) as string;

						responseData = await prestashopApiRequest.call(
							this,
							'DELETE',
							`orders/${orderId}`,
						);

						responseData = { success: true };
					}

					if (operation === 'get') {
						const orderId = this.getNodeParameter('orderId', i) as string;

						responseData = await prestashopApiRequest.call(
							this,
							'GET',
							`orders/${orderId}`,
						);
					}

					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', 0) as number;
						const filterType = this.getNodeParameter('filterType', i) as string;
						const sortOption = this.getNodeParameter('options.sort', i, {}) as { sort: SortOrder[] };
						let qs: string = '';

						if (filterType === 'manual') {
							const filters = this.getNodeParameter('filters', i) as { conditions: Filter[] };
							qs = getFilterQuery({
								...filters,
								...sortOption,
								limit: limit,
							});
						}

						responseData = await prestashopApiRequest.call(
							this,
							'GET',
							'orders',
							{},
							qs,
						);
					}

					if (operation === 'changeStatus') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						const orderStateId = this.getNodeParameter('orderStateId', i) as string;

						const orderData: IDataObject = {};
						orderData.id = orderId;
						orderData.current_state = orderStateId;

						const builder = new XMLBuilder({ ignoreAttributes: false });
						const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
							builder.build({ prestashop: { order: orderData } });

						responseData = await prestashopApiRequest.call(
							this,
							'PATCH',
							`orders/${orderId}`,
							body,
						);
					}

					if (operation === 'shippingNumber') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						const orderShippingNumber = this.getNodeParameter('orderShippingNumber', i) as string;
						
						const orderData: IDataObject = {};
						orderData.id = orderId;
						orderData.shipping_number = orderShippingNumber;

						const builder = new XMLBuilder({ ignoreAttributes: false });
						const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
							builder.build({ prestashop: { order: orderData } });

						responseData = await prestashopApiRequest.call(
							this,
							'PATCH',
							`orders/${orderId}`,
							body,
						);
					}

					if (operation === 'orderNote') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						const note = this.getNodeParameter('orderNoteMessage', i) as string;
						
						const orderData: IDataObject = {};
						orderData.id = orderId;
						orderData.note = note;

						const builder = new XMLBuilder({ ignoreAttributes: false });
						const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
							builder.build({ prestashop: { order: orderData } });

						responseData = await prestashopApiRequest.call(
							this,
							'PATCH',
							`orders/${orderId}`,
							body,
						);
					}
				}

				if (resource === 'product') {
					if (operation === 'create') {
						const nameTranslations = this.getNodeParameter('name', i) as { translations: Translation[] };
						const linkRewriteTranslations = this.getNodeParameter('linkRewrite', i) as { translations: Translation[] };
						const price = this.getNodeParameter('price', i) as number;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const translationFields = this.getNodeParameter('translationFields', i);

						const response = await prestashopApiRequest.call(
							this,
							'GET',
							`products`,
							{},
							'schema=blank',
						);

						const productData = response.product || {};
						
						productData.name = { language: buildMultilangField(nameTranslations) };
						productData.link_rewrite = { language: buildMultilangField(linkRewriteTranslations) };
						productData.price = price;
						productData.state = 1;
						if (translationFields) {
							for (const [key, value] of Object.entries(translationFields)) {
								if (
									value &&
									typeof value === 'object' &&
									Array.isArray((value as IDataObject).translations)
								) {
									productData[key] = { language: buildMultilangField(value as { translations: Translation[] }) };
								}
							}
						}
						Object.assign(productData, additionalFields);

						[
							'associations',
							'date_add',
							'date_upd',
							'cache_default_attribute',
							'supplier_reference',
							'location',
							'quantity_discount'
						].forEach((prop) => delete productData[prop]);

						for (const key of Object.keys(productData)) {
							if (typeof productData[key] === 'boolean') {
								productData[key] = productData[key] ? '1' : '0';
							} else if (typeof productData[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(productData[key])) {
								productData[key] = productData[key].replace('T', ' ');
							}
						}

						const builder = new XMLBuilder({ ignoreAttributes: false, cdataPropName: '__cdata' });
						const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
							builder.build({ prestashop: { product: productData } });

						responseData = await prestashopApiRequest.call(
							this,
							'POST',
							'products',
							body
						);
					}

					if (operation === 'delete') {
						const productId = this.getNodeParameter('productId', i) as string;

						responseData = await prestashopApiRequest.call(
							this,
							'DELETE',
							`products/${productId}`,
						);

						responseData = { success: true };
					}

					if (operation === 'get') {
						const productId = this.getNodeParameter('productId', i) as string;

						responseData = await prestashopApiRequest.call(
							this,
							'GET',
							`products/${productId}`,
						);
					}

					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', 0) as number;
						const filterType = this.getNodeParameter('filterType', i) as string;
						const sortOption = this.getNodeParameter('options.sort', i, {}) as { sort: SortOrder[] };
						let qs: string = '';

						if (filterType === 'manual') {
							const filters = this.getNodeParameter('filters', i) as { conditions: Filter[] };
							qs = getFilterQuery({
								...filters,
								...sortOption,
								limit: limit,
							});
						}

						responseData = await prestashopApiRequest.call(
							this,
							'GET',
							'products',
							{},
							qs,
						);
					}

					if (operation === 'update') {
						const productId = this.getNodeParameter('productId', i) as string;
						const nameTranslations = this.getNodeParameter('name', i) as { translations: Translation[] };
						const linkRewriteTranslations = this.getNodeParameter('linkRewrite', i) as { translations: Translation[] };
						const price = this.getNodeParameter('price', i) as number;
						const translationFields = this.getNodeParameter('translationFields', i);
						const additionalFields = this.getNodeParameter('additionalFields', i);

						const productData:IDataObject = {};
						productData.id = productId;
						if (nameTranslations && Array.isArray(nameTranslations.translations)) productData.name = { language: buildMultilangField(nameTranslations) };
						if (linkRewriteTranslations && Array.isArray(linkRewriteTranslations.translations)) productData.link_rewrite = { language: buildMultilangField(linkRewriteTranslations) };
						if (price && price > 0) productData.price = price;
						if (translationFields) {
							for (const [key, value] of Object.entries(translationFields)) {
								if (
									value &&
									typeof value === 'object' &&
									Array.isArray((value as IDataObject).translations)
								) {
									productData[key] = { language: buildMultilangField(value as { translations: Translation[] }) };
								}
							}
						}
						Object.assign(productData, additionalFields);

						for (const key of Object.keys(productData)) {
							if (typeof productData[key] === 'boolean') {
								productData[key] = productData[key] ? '1' : '0';
							} else if (typeof productData[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(productData[key])) {
								productData[key] = productData[key].replace('T', ' ');
							}
						}

						const builder = new XMLBuilder({ ignoreAttributes: false, cdataPropName: '__cdata' });
						const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
							builder.build({ prestashop: { product: productData } });

						responseData = await prestashopApiRequest.call(
							this,
							'PATCH',
							`products/${productId}`,
							body
						);
					}

					if (operation === 'stock') {
						//https://devdocs.prestashop-project.org/9/webservice/resources/stock_availables/
						const searchMode = this.getNodeParameter('searchMode', i) as string;
						const quantity = this.getNodeParameter('quantity', i) as number;

						let stockId: number | null = null;

						if (searchMode === 'byStockId') {
							stockId = this.getNodeParameter('stockId', i) as number;
						} else if (searchMode === 'byCombination') {
							const productId = this.getNodeParameter('productId', i) as string;
							const combinationId = this.getNodeParameter('combinationId', i) as number;
							const isMultishop = this.getNodeParameter('isMultishop', i, false) as boolean;

							let query = `filter[id_product]=[${productId}]&filter[id_product_attribute]=[${combinationId}]`;

							if (isMultishop) {
								const shopId = this.getNodeParameter('shopId', i) as number;
								const idShopGroup = this.getNodeParameter('shopGroupId', i) as number;
								query += `&filter[id_shop]=[${shopId}]&filter[id_shop_group]=[${idShopGroup}]`;
							}

							const stockResponse = await prestashopApiRequest.call(
								this,
								'GET',
								'stock_availables',
								{},
								query
							);

							if (stockResponse?.stock_availables?.length > 0) {
								stockId = parseInt(stockResponse.stock_availables[0].id, 10);
							} else {
								throw new NodeOperationError(
									this.getNode(),
									`No stock records were found with these parameters.`
								);
							}
						}

						if (!stockId) {
							throw new NodeOperationError(this.getNode(), 'No valid stock record identifier found.');
						}

						const stockData: IDataObject = {
							id: stockId,
							quantity,
						};

						const builder = new XMLBuilder({ ignoreAttributes: false });
						const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
							builder.build({ prestashop: { stock_available: stockData } });

						responseData = await prestashopApiRequest.call(
							this,
							'PATCH',
							`stock_availables/${stockId}`,
							body,
						);
					}
				}

				if (resource === 'specific_price') {
					if (operation === 'create') {
						const productId = this.getNodeParameter('productId', i) as number;
						const combinationId = this.getNodeParameter('combinationId', i, 0) as number;
						const currencyId = this.getNodeParameter('currencyId', i, 0) as number;
						const countryId = this.getNodeParameter('countryId', i, 0) as number;
						const groupId = this.getNodeParameter('groupId', i, 0) as number;
						const customerId = this.getNodeParameter('customerId', i, 0) as number;
						const fromQuantity = this.getNodeParameter('fromQuantity', i, 1) as number;
						const isMultishop = this.getNodeParameter('isMultishop', i, false) as boolean;

						const unlimitedDuration = this.getNodeParameter('unlimitedDuration', i, true) as boolean;
						let fromDate = '0000-00-00 00:00:00';
						let toDate = '0000-00-00 00:00:00';

						if (!unlimitedDuration) {
							fromDate = this.getNodeParameter('fromDate', i) as string;
							toDate = this.getNodeParameter('toDate', i) as string;
						}

						const impactMode = this.getNodeParameter('impactMode', i) as string;
						let reduction = 0;
						let reductionTax = 1;
						let reductionType = 'amount';
						let fixedPrice = -1;

						if (impactMode === 'discount') {
							reduction = this.getNodeParameter('reductionValue', i) as number;
							reductionTax = this.getNodeParameter('reductionIncludeTax', i, 1) as number;
							reductionType = this.getNodeParameter('reductionType', i, 'amount') as string;
							if (reductionType === 'percentage') {
								reduction /= 100;
							}
							fixedPrice = -1;
						} else if (impactMode === 'fixedPrice') {
							reduction = 0;
							reductionTax = 1;
							reductionType = 'amount';
							fixedPrice = this.getNodeParameter('fixedPriceTaxExcluded', i) as number;
						}

						const response = await prestashopApiRequest.call(
							this,
							'GET',
							`specific_prices`,
							{},
							'schema=blank',
						);

						const specificPriceData = Array.isArray(response.specific_price)
							? { ...response.specific_price }
							: (response.specific_price || {});

						specificPriceData.id_product = productId;
						specificPriceData.id_product_attribute = combinationId;
						specificPriceData.id_cart = 0;
						specificPriceData.id_currency = currencyId;
						specificPriceData.id_country = countryId;
						specificPriceData.id_group = groupId;
						specificPriceData.id_customer = customerId;
						specificPriceData.from_quantity = fromQuantity;
						specificPriceData.from = fromDate;
						specificPriceData.to = toDate;
						specificPriceData.price = fixedPrice;
						specificPriceData.reduction = reduction;
						specificPriceData.reduction_tax = reductionTax;
						specificPriceData.reduction_type = reductionType;

						if (isMultishop) {
							const shopId = this.getNodeParameter('shopId', i, 0) as number;
							const shopGroupId = this.getNodeParameter('shopGroupId', i, 0) as number;
							specificPriceData.id_shop = shopId;
							specificPriceData.id_shop_group = shopGroupId;
						}

						for (const key of Object.keys(specificPriceData)) {
							if (typeof specificPriceData[key] === 'boolean') {
								specificPriceData[key] = specificPriceData[key] ? '1' : '0';
							} else if (typeof specificPriceData[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(specificPriceData[key])) {
								specificPriceData[key] = specificPriceData[key].replace('T', ' ');
							}
						}

						const builder = new XMLBuilder({ ignoreAttributes: false });
						const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
							builder.build({ prestashop: { specific_price: specificPriceData } });

						responseData = await prestashopApiRequest.call(
							this,
							'POST',
							'specific_prices',
							body,
						);
					}

					if (operation === 'delete') {
						const specificPriceId = this.getNodeParameter('specificPriceId', i) as number;

						responseData = await prestashopApiRequest.call(
							this,
							'DELETE',
							`specific_prices/${specificPriceId}`,
						);

						responseData = { success: true };
					}

					if (operation === 'get') {
						const specificPriceId = this.getNodeParameter('specificPriceId', i) as number;

						responseData = await prestashopApiRequest.call(
							this,
							'GET',
							`specific_prices/${specificPriceId}`,
						);
					}

					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', 0) as number;
						const filterType = this.getNodeParameter('filterType', i) as string;
						const sortOption = this.getNodeParameter('options.sort', i, {}) as { sort: SortOrder[] };
						let qs: string = '';

						if (filterType === 'manual') {
							const filters = this.getNodeParameter('filters', i) as { conditions: Filter[] };
							qs = getFilterQuery({
								...filters,
								...sortOption,
								limit: limit,
							});
						}

						responseData = await prestashopApiRequest.call(
							this,
							'GET',
							'specific_prices',
							{},
							qs,
						);
					}

					if (operation === 'update') {
						const specificPriceId = this.getNodeParameter('specificPriceId', i) as string;
						const productId = this.getNodeParameter('productId', i) as string;
						const combinationId = this.getNodeParameter('combinationId', i, 0) as number;
						const currencyId = this.getNodeParameter('currencyId', i, 0) as number;
						const countryId = this.getNodeParameter('countryId', i, 0) as number;
						const groupId = this.getNodeParameter('groupId', i, 0) as number;
						const customerId = this.getNodeParameter('customerId', i, 0) as number;
						const fromQuantity = this.getNodeParameter('fromQuantity', i, 1) as number;
						const unlimitedDuration = this.getNodeParameter('unlimitedDuration', i, true) as boolean;
						const dateFrom = this.getNodeParameter('dateFrom', i, '') as string;
						const dateTo = this.getNodeParameter('dateTo', i, '') as string;
						const impactMode = this.getNodeParameter('impactMode', i) as string;
						const isMultishop = this.getNodeParameter('isMultishop', i, false) as boolean;

						const specificPriceData: IDataObject = {};
						specificPriceData.id = specificPriceId;
						if (productId) specificPriceData.id_product = productId;
						if (combinationId) specificPriceData.id_product_attribute = combinationId;
						if (fromQuantity) specificPriceData.from_quantity = fromQuantity;
						if (currencyId) specificPriceData.id_currency = currencyId;
						if (countryId) specificPriceData.id_country = countryId;
						if (groupId) specificPriceData.id_group = groupId;
						if (customerId) specificPriceData.id_customer = customerId;

						if (impactMode === 'discount') {
							const reduction = this.getNodeParameter('reductionValue', i, 0) as number;
							const reductionTax = this.getNodeParameter('reductionIncludeTax', i, true) as boolean;
							const reductionType = this.getNodeParameter('reductionType', i, 'amount') as string;
							if (reduction !== undefined) specificPriceData.reduction = (reductionType === 'percentage' ? reduction / 100 : reduction);
							if (reductionTax !== undefined) specificPriceData.reduction_tax = reductionTax ? '1' : '0';
							if (reductionType) specificPriceData.reduction_type = reductionType;
						} else if (impactMode === 'fixedPrice') {
							const fixedPrice = this.getNodeParameter('fixedPriceTaxExcluded', i) as number;
							if (fixedPrice !== undefined) specificPriceData.price = fixedPrice;
						}

						if (unlimitedDuration) {
							specificPriceData.from = '0000-00-00 00:00:00';
							specificPriceData.to = '0000-00-00 00:00:00';
						} else {
							if (dateFrom) specificPriceData.from = dateFrom.replace('T', ' ');
							if (dateTo) specificPriceData.to = dateTo.replace('T', ' ');
						}

						if (isMultishop) {
							const shopId = this.getNodeParameter('shopId', i, 0) as number;
							const shopGroupId = this.getNodeParameter('shopGroupId', i, 0) as number;
							if (shopId) specificPriceData.id_shop = shopId;
							if (shopGroupId) specificPriceData.id_shop_group = shopGroupId;
						}

						for (const key of Object.keys(specificPriceData)) {
							if (typeof specificPriceData[key] === 'boolean') {
								specificPriceData[key] = specificPriceData[key] ? '1' : '0';
							} else if (typeof specificPriceData[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(specificPriceData[key])) {
								specificPriceData[key] = (specificPriceData[key] as string).replace('T', ' ');
							}
						}

						const builder = new XMLBuilder({ ignoreAttributes: false });
						const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
							builder.build({ prestashop: { specific_price: specificPriceData } });

						responseData = await prestashopApiRequest.call(
							this,
							'PATCH',
							`specific_prices/${specificPriceId}`,
							body,
						);
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
