# n8n-nodes-prestashop

This is an n8n community node. It lets you integrate [PrestaShop](https://www.prestashop.com/) Webservice/API in your n8n workflows.

It supports both **actions** (managing main resources) and **triggers** (listening for new entities created in PrestaShop).

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)
[Compatibility](#compatibility)  
[Usage](#usage)
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

#### Customers
- Create a customer
- Update a customer
- Delete a customer
- Get a customer
- Get all customers

#### Orders
- Get an order
- Get all orders
- Delete an order
- Change order state
- Set order shipping number

#### Products
- Create a product
- Update a product
- Delete a product
- Get a product
- Get all products

### Trigger Events
- Address created
- Carrier created
- Cart Rule created
- Cart created
- Category created
- Combination created
- Customer Message created
- Customer Thread created
- Customer created
- Employee created
- Manufacturer created
- Message created
- Order Carrier created
- Order Detail created
- Order History created
- Order Payment created
- Order created
- Product created
- Specific Price Rule created
- Specific Price created
- Stock Available created
- Store created
- Supplier created
- Tag created

## Credentials

You need a **PrestaShop API Key** and the **base URL** of your store.

1. In your PrestaShop back office, go to **Advanced Parameters → Webservice**.
2. Enable the webservice and generate a key.
3. Use this key and your store URL in the node credentials in n8n.

## Compatibility

- Minimum n8n version: **1.0.0**
- Tested with:
  - PrestaShop **1.7.x**
  - PrestaShop **8.x**
  - PrestaShop **9.x**

## Usage

1. Add the **PrestaShop** node to your workflow.
2. Configure credentials.
3. Choose a resource and an operation:
   - `Customer`, `Order`, or `Product`
   - For triggers, select one of the available events.
4. Connect the node with other nodes in your automation.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [PrestaShop webservice documentation](https://devdocs.prestashop-project.org/9/webservice/)

