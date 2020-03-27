import React from 'react';
import { getProducts, getOffers } from '../../firebase/firestore';
import Menu from './Menu';
import RegisterOrder from './RegisterOrder';

const createOrder = (product, offer, state) => {

  if (offer !== null) {
    const findProductOffer = state.find((element) => element.id === (product.id +  offer.id));

    if (findProductOffer) {
      const mapProducts = state.map((order) => {

        if (order.id === (product.id + offer.id)) {
          const counter = order.quantity += 1;

          order.subTotal = counter * order.price;
        }

        order.subTotal = order.quantity * order.price;

        return order;
      });

      return mapProducts;
    }

    const newOrder = {
      id: product.id + offer.id,
      nameProduct: product.nameProduct + ' + ' + offer.nameOffer,
      price: product.price + offer.price,
      quantity: 1,
      subTotal: product.price + offer.price,
    }

    const arrayOrder = state.concat(newOrder);

    return arrayOrder;
  }

  const findProduct = state.find((element) => element.id === product.id);

  if (findProduct) {

    const mapProducts = state.map((order) => {
      if (order.id === product.id) {
        const counter = order.quantity += 1;

        order.subTotal = counter * order.price;
      }

      order.subTotal = order.quantity * order.price;

      return order;
    });

    return mapProducts;
  }

  const newOrder = {
    id: product.id,
    nameProduct: product.nameProduct,
    price: product.price,
    quantity: 1,
    subTotal: product.price,
  }

  const arrayOrder = state.concat(newOrder);

  return arrayOrder;
}



class Waiter extends React.Component {
  constructor(props) {
    super(props);

    this.state = { products: [], orders: [], offers: [], productOffer: {} };

    this.clickTabs = this.clickTabs.bind(this);
    this.clickProduct = this.clickProduct.bind(this);
    this.clickButtonAdd = this.clickButtonAdd.bind(this);
    this.clickButtonSubtrack = this.clickButtonSubtrack.bind(this);
    this.clickButtonDelete = this.clickButtonDelete.bind(this);
    this.clickOffer = this.clickOffer.bind(this);
  }

  clickTabs(category) {
    getProducts(category)
      .then(data => this.setState(
        { products: data }
      ));
  }

  clickProduct(product) {
    if (product.offer) {
      getOffers(product.category)
        .then(data => this.setState(
          { offers: data }
        ));

      const newProductOffer = {
        id: product.id,
        nameProduct: product.nameProduct,
        price: product.price,
      };

      this.setState({ productOffer: newProductOffer });
    }
    else {
      const listOrders = createOrder(product, null, this.state.orders);

      this.setState({orders: listOrders});
    }
  }

  clickOffer(productOffer, offer) {
    const listOrder = createOrder(productOffer, offer, this.state.orders);

    this.setState({ orders: listOrder });
    this.setState({ offers: [] });
  }

  clickButtonAdd(product) {

    const arrayOrders = createOrder(product, null, this.state.orders);
    this.setState({ orders: arrayOrders });

  }

  clickButtonSubtrack(product) {
    const findProduct = this.state.orders.find((element) => element.id === product.id);

    if (findProduct.quantity >= 1) {
      const mapProducts = this.state.orders.map((order) => {
        if (order.id === product.id) {
          const counter = order.quantity -= 1;

          order.total = counter * order.price;
        }

        order.total = order.quantity * order.price;

        return order;
      });

      this.setState({ orders: mapProducts });
    }

    if (findProduct.quantity === 0) {
      const orders = this.state.orders;

      const position = orders.findIndex((element) => element.id === findProduct.id);

      orders.splice(position, 1);

      this.setState({ orders: orders });
    }

  }

  clickButtonDelete(product) {
    const orders = this.state.orders;

    const findProduct = orders.find((element) => element.id === product.id);

    const position = orders.findIndex((element) => element.id === findProduct.id);

    orders.splice(position, 1);

    this.setState({ orders: orders });
  }

  render() {
    return (
      <main className="d-flex bd-highlight" id="waiter">
        <Menu clickTabs={this.clickTabs} products={this.state.products} clickProduct={this.clickProduct} offers={this.state.offers} productOffer={this.state.productOffer} clickOffer={this.clickOffer} />
        <RegisterOrder orderProduct={this.state.orders} clickButtonAdd={this.clickButtonAdd} clickButtonSubtrack={this.clickButtonSubtrack} clickButtonDelete={this.clickButtonDelete}/>
      </main>

    );
  }
}


export default Waiter;
