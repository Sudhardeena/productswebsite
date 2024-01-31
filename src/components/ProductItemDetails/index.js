// Write your code here
import {Component} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import ProductCard from '../ProductCard'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productItemDetails: {},
    quantity: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        price: fetchedData.price,
        rating: fetchedData.rating,
        similarPoducts: fetchedData.similar_products.map(eachFetchedData => ({
          availability: eachFetchedData.availability,
          brand: eachFetchedData.brand,
          description: eachFetchedData.description,
          id: eachFetchedData.id,
          imageUrl: eachFetchedData.image_url,
          price: eachFetchedData.price,
          rating: eachFetchedData.rating,
          style: eachFetchedData.style,
          title: eachFetchedData.title,
          totalReviews: eachFetchedData.total_reviews,
        })),
        style: fetchedData.style,
        title: fetchedData.title,
        totalReviews: fetchedData.total_reviews,
      }
      // console.log(updatedData)
      this.setState({
        productItemDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  increaseQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  decreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderProductDetais = () => {
    const {productItemDetails, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productItemDetails

    return (
      <div className="product-item-Details-container">
        <div className="product-item-details">
          <img className="product-item-image" src={imageUrl} alt="product" />
          <div className="product-item-info">
            <h1 className="product-item-title">{title}</h1>
            <p className="product-item-price">Rs {price}/-</p>
            <div className="rating-and-total-reviews">
              <p className="product-item-rating">
                {rating}
                <img
                  className="star-img"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </p>
              <p className="protduct-item-total-reviews">
                {totalReviews} Reviews
              </p>
            </div>
            <p className="product-item-description">{description}</p>
            <p className="product-item-availability">
              <span>Available:</span> {availability}
            </p>
            <p className="product-item-brand">
              <span>Brand:</span> {brand}
            </p>
            <hr className="hr-rule" />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-change-btn"
                data-testid="plus"
                onClick={this.increaseQuantity}
              >
                <BsPlusSquare />
              </button>
              <p className="qunatity-text">{quantity}</p>
              <button
                type="button"
                className="quantity-change-btn"
                data-testid="minus"
                onClick={this.decreaseQuantity}
              >
                <BsDashSquare />
              </button>
            </div>
            <button className="add-cart-btn" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1>Similar Products</h1>
        <ul className="products-list">
          {productItemDetails.similarPoducts.map(product => (
            <ProductCard
              productData={product}
              key={product.id}
              similarProduct={true}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  continueShopping = () => {
    const {history} = this.props
    // console.log(history)

    history.replace('/products')
  }

  renderProductDetailsFailureView = () => (
    <div className="error-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <button
        className="continue-shoppin-btn"
        type="button"
        onClick={this.continueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderproductDetailsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetais()
      case apiStatusConstants.failure:
        return this.renderProductDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderproductDetailsView()}
      </>
    )
  }
}

export default ProductItemDetails
