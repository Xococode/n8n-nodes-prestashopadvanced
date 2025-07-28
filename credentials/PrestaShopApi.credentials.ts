import { BINARY_ENCODING } from 'n8n-workflow';
import type {
	ICredentialDataDecryptedObject,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';
export class PrestaShopApi implements ICredentialType {
	name = 'prestashopApi';
	displayName = 'PrestaShop API';
	documentationUrl = 'https://devdocs.prestashop-project.org/9/webservice/getting-started/#enabling--creating-an-access-to-the-webservice';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			required: true,
			type: 'string',
			default: '',
			description: 'Base url of your shop (example: https://www.mishop.com)',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			required: true,
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		requestOptions.headers = {
			...requestOptions.headers,
			Authorization: `Basic ${Buffer.from(`${credentials.apiKey}:`).toString(BINARY_ENCODING)}`,
		};
		return requestOptions;
	}
}
